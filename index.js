// © Andrew Wei
/**
 * @file An end-to-end Gulp build system and asset pipeline for a webapp
 *       templated by Metalsmith and content-managed by Prismic.io. Includes
 *       tasks for processing all asset types and asset fingerprinting.
 */

const $ = require(`./helpers/task-helpers`);
const _ = require(`lodash`);
const browserSync = require(`browser-sync`);
const del = require(`del`);
const documents = require(`./tasks/documents`);
const extras = require(`./tasks/extras`);
const fonts = require(`./tasks/fonts`);
const gulp = require(`gulp`);
const images = require(`./tasks/images`);
const moment = require(`moment`);
const path = require(`path`);
const fs = require(`fs-extra`);
const rev = require(`./tasks/rev`);
const sass = require(`./tasks/sass`);
const scripts = require(`./tasks/scripts`);
const sitemap = require(`gulp-sitemap`);
const util = require(`gulp-util`);
const view = require(`./helpers/view-helpers`);
const prismic = require(`./helpers/prismic-helpers`);
const sequence = require(`run-sequence`);
const videos = require(`./tasks/videos`);
const views = require(`./tasks/views`);
const yaml = require(`yamljs`);

util.log(`${util.colors.magenta(`NODE_ENV`)}=${process.env.NODE_ENV}`);
util.log(`${util.colors.magenta(`PORT`)}=${process.env.PORT}`);
util.log(`${util.colors.magenta(`PRISMIC_API_ENDPOINT`)}=${process.env.PRISMIC_API_ENDPOINT}`);
util.log(`${util.colors.magenta(`PRISMIC_ACCESS_TOKEN`)}=${process.env.PRISMIC_ACCESS_TOKEN}`);

const DEFAULT_CONFIG = {
  apiEndpoint: process.env.PRISMIC_API_ENDPOINT,
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  base: undefined,
  dest: undefined,
  clean: undefined, // Defaults to [`$options.dest}`, `${options.base}/views/.prismic`]
  images: {
    src: `images/**/*`,
    dest: undefined // `options.dest/assets`
  },
  videos: {
    src: `videos/**/*`,
    dest: undefined // `options.dest/assets`
  },
  fonts: {
    src: `fonts/**/*`,
    dest: undefined // `options.dest/assets`
  },
  documents: {
    src: `documents/**/*`,
    dest: undefined // `options.dest/assets`
  },
  extras: {
    src: `*`
  },
  scripts: {
    context: undefined, // `options.base/javascripts`
    output: {
      path: undefined,  // `options.dest/assets/javascripts`
      publicPath: `assets/javascripts`
    }
  },
  styles: {
    src: `stylesheets/*`,
    dest: undefined, // `options.dest/assets`
    envs: {
      production: {
        purify: undefined // `options.dest/**/*`
      }
    }
  },
  rev: {
    envs: {
      production: {
        src: undefined // `options.dest`
      }
    }
  },
  views: {
    src: `views`,
    related: {
      pattern: `.prismic/**/*.html`
    }
  },
  sitemap: undefined,
  serve: {
    server: {
      baseDir: undefined // Defaults to `${options.dest}`
    },
    files: false,
    notify: false,
    port: process.env.PORT || 8080,
    logLevel: `info`,
    open: false
  },
  watch: { tasks: [browserSync.reload] }
};

/**
 * Initializes the Prismic-Metalsmith build system with customizable options.
 * This operation creates the following Gulp tasks for you: `clean`, `serve`,
 * `images`, `videos`, `fonts`, `documents`, `extras`, `scripts`, `styles`,
 * `rev`, `views` and `default`.
 *
 * @param {Object} options - Options.
 * @param {string} options.base - Fallback base path for source files.
 * @param {string} options.dest - Fallback path to destination directory where
 *                                piped files are written to.
 * @param {Object} [options.watch] - Fallback file watching options.
 * @param {Object|boolean} [options.images] - Set to `false` to disable this
 *                                            task. @see tasks/images
 * @param {Object|boolean} [options.videos] - Set to `false` to disable this
 *                                            task. @see tasks/videos
 * @param {Object|boolean} [options.fonts] - Set to `false` to disable this
 *                                           task. @see tasks/fonts
 * @param {Object|boolean} [options.documents] - Set to `false` to disable this
 *                                               task. @see tasks/documents
 * @param {Object|boolean} [options.extras] - Set to `false` to disable this
 *                                            task. @see tasks/extras
 * @param {Object|boolean} [options.styles] - Set to `false` to disable this
 *                                            task. @see tasks/styles
 * @param {Object|boolean} [options.scripts] - Set to `false` to disable this
 *                                             task. @see tasks/scripts
 * @param {Object|boolean} [options.rev] - Set to `false` to disable this
 *                                         task. @see tasks/rev
 * @param {Object} [options.sitemap] - Options for `gulp-sitemap`.
 * @param {Object|boolean} [options.views] - Set to `false` to disable this
 *                                           task. @see tasks/views
 * @param {Array} [options.clean] - Path(s) to remove in the `clean` task.
 * @param {Object} [options.serve] - Options for `browser-sync`.
 * @param {boolean} [extendsDefaults=true] - Maps to `useConcat` param in
 *                                           task-helpers#config.
 */
exports.init = function(options, extendsDefaults) {
  if (typeof extendsDefaults !== `boolean`) extendsDefaults = true;

  if (options.base) {
    DEFAULT_CONFIG.scripts.context = path.join(options.base, `javascripts`);
  }

  if (options.dest && options.base) {
    DEFAULT_CONFIG.clean = [
      options.dest,
      path.join(options.base, `views`, `.prismic`)
    ];

    DEFAULT_CONFIG.serve.server.baseDir = options.dest;

    DEFAULT_CONFIG.views.metadata = {
      $asset: function(p) {
        return view.getPath(p, path.join(options.dest, _.get(options, `rev.manifestFile`) || `rev-manifest.json`));
      },
      $moment: moment,
      $env: process.env,
      _: _
    };
  }

  if (options.dest) {
    DEFAULT_CONFIG.images.dest = path.join(options.dest, `assets`);
    DEFAULT_CONFIG.videos.dest = path.join(options.dest, `assets`);
    DEFAULT_CONFIG.fonts.dest = path.join(options.dest, `assets`);
    DEFAULT_CONFIG.documents.dest = path.join(options.dest, `assets`);
    DEFAULT_CONFIG.scripts.output.path = path.join(options.dest, DEFAULT_CONFIG.scripts.output.publicPath);
    DEFAULT_CONFIG.styles.dest = path.join(options.dest, `assets`);
    DEFAULT_CONFIG.styles.envs.production.purify = path.join(options.dest, `**/*`);
    DEFAULT_CONFIG.rev.envs.production.src = options.dest;
  }

  const config = $.config(options, DEFAULT_CONFIG, extendsDefaults);
  const tasks = [`clean`, `serve`, `images`, `videos`, `fonts`, `documents`, `extras`, `scripts`, `styles`, `rev`, `views`, `sitemap`];
  const seq = [];

  if (config.views !== false) {
    gulp.task(`views`, function(callback) {
      const c = _.merge(_.omit(config, tasks), _.get(config, `views`));

      if (config.apiEndpoint) {
        generatePrismicDocuments(c)
          .then(() => views(c).bind(this)(callback))
          .catch(err => {
            util.log(util.colors.blue(`[prismic]`), util.colors.red(err));
            throw new Error(err);
          });
      }
      else {
        util.log(util.colors.blue(`[prismic]`), util.colors.yellow(`No credentials provided`));
        views(c).bind(this)(callback);
      }
    });
    seq.push(`views`);
  }

  gulp.task(`clean`, function() {
    if (!config.clean || !config.clean.length) return;
    config.clean.forEach(val => util.log(util.colors.blue(`[clean]`), `Removing`, util.colors.cyan(val)));
    return del(config.clean, { force: true });
  });

  if (config.sitemap !== undefined) {
    gulp.task(`sitemap`, function() {
      return gulp.src([
        path.join(config.dest, `**/*.html`),
        `!${path.join(config.dest, `**/{404,500}.html`)}`
      ])
        .pipe(sitemap(config.sitemap))
        .pipe(gulp.dest(config.dest));
    });
    seq.push(`sitemap`);
  }

  if (options.images !== false) {
    gulp.task(`images`, images(_.merge(_.omit(config, tasks), _.get(config, `images`)), extendsDefaults));
    seq.push(`images`);
  }

  if (options.videos !== false) {
    gulp.task(`videos`, videos(_.merge(_.omit(config, tasks), _.get(config, `videos`)), extendsDefaults));
    seq.push(`videos`);
  }

  if (options.fonts !== false) {
    gulp.task(`fonts`, fonts(_.merge(_.omit(config, tasks), _.get(config, `fonts`)), extendsDefaults));
    seq.push(`fonts`);
  }

  if (options.documents !== false) {
    gulp.task(`documents`, documents(_.merge(_.omit(config, tasks), _.get(config, `documents`)), extendsDefaults));
    seq.push(`documents`);
  }

  if (options.extras !== false) {
    gulp.task(`extras`, extras(_.merge(_.omit(config, tasks), _.get(config, `extras`)), extendsDefaults));
    seq.push(`extras`);
  }

  if (options.scripts !== false) {
    gulp.task(`scripts`, scripts(_.get(config, `scripts`), { callback: config.watch.tasks && (typeof config.watch.tasks[0] === `function`) && config.watch.tasks[0] }, extendsDefaults));
    seq.push(`scripts`);
  }

  if (options.styles !== false) {
    gulp.task(`styles`, sass(_.merge(_.omit(config, tasks), _.get(config, `styles`)), extendsDefaults));
    seq.push(`styles`);
  }

  if (options.rev !== false) {
    gulp.task(`rev`, rev(_.merge(_.omit(config, tasks), _.get(config, `rev`)), extendsDefaults));
    seq.push(`rev`);
  }

  gulp.task(`serve`, function() {
    browserSync.init(config.serve);
  });

  if (util.env[`serve`] || util.env[`s`]) seq.push(`serve`);

  gulp.task(`default`, function(callback) {
    sequence.use(gulp).apply(null, [`clean`].concat(seq, callback));
  });
};

/**
 * Generates HTML files with YAML front matters from Prismic documents.
 *
 * @param {Object} config - Config object.
 *
 * @return {Promise} - Promise with no fulfillment value.
 */
function generatePrismicDocuments(config) {
  return prismic.getAPI(config.apiEndpoint, { accessToken: config.accessToken })
    .then(api => (prismic.getEverything(api, null, ``, _.flatMap(config.collections, (val, key) => (`my.${key}.${val.sortBy}${val.reverse ? ` desc` : ``}`)))))
    .then(res => {
      util.log(util.colors.blue(`[prismic]`), `Fetched a total of ${res.results.length} documents`);
      if (res.results.length) res.results.forEach(doc => util.log(util.colors.blue(`[prismic]`), `Fetched document [${doc.type}]: ${doc.slug}`));
      const documents = prismic.reduce(res.results, false, config);

      // Populate config metadata with retrieved documents.
      if (!config.metadata) config.metadata = { $data: {} };
      _.merge(config.metadata.$data, documents);

      for (let docType in documents) {
        const c = _.get(config, `collections.${docType}`);

        if (c && c.permalink) {
          const subdir = `.prismic/${docType}`;
          const dir = path.join(path.join(config.base || ``, config.src || ``), subdir);
          c.pattern = path.join(subdir, `**/*`);

          documents[docType].forEach(doc => {
            const filename = `${doc.uid || _.kebabCase(doc.slug)}.html`;
            const frontMatter = yaml.stringify(_.omit(doc, [`next`, `prev`]));
            fs.mkdirsSync(dir);
            fs.writeFileSync(path.join(dir, filename), `---\n${frontMatter}---\n`);
          });
        }
      }

      return;
    });
}
