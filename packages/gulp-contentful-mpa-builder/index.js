// © Andrew Wei
/**
 * @file An end-to-end Gulp build system and asset pipeline for a webapp
 *       templated by Metalsmith and content-managed by Contentful. Includes
 *       tasks for processing all asset types and asset fingerprinting.
 */

const $ = require(`./helpers/task-helpers`);
const _ = require(`lodash`);
const browserSync = require(`browser-sync`);
const contentful = require(`./helpers/contentful-helpers`);
const del = require(`del`);
const documents = require(`./tasks/documents`);
const extras = require(`./tasks/extras`);
const fonts = require(`./tasks/fonts`);
const gulp = require(`gulp`);
const images = require(`./tasks/images`);
const path = require(`path`);
const fs = require(`fs-extra`);
const rev = require(`./tasks/rev`);
const sass = require(`./tasks/sass`);
const scripts = require(`./tasks/scripts`);
const sitemap = require(`gulp-sitemap`);
const util = require(`gulp-util`);
const view = require(`./helpers/view-helpers`);
const sequence = require(`run-sequence`);
const videos = require(`./tasks/videos`);
const views = require(`./tasks/views`);
const yaml = require(`yamljs`);

util.log(`${util.colors.magenta(`NODE_ENV`)}=${process.env.NODE_ENV}`);
util.log(`${util.colors.magenta(`PORT`)}=${process.env.PORT}`);
util.log(`${util.colors.magenta(`CONTENTFUL_SPACE`)}=${process.env.CONTENTFUL_SPACE}`);
util.log(`${util.colors.magenta(`CONTENTFUL_ACCESS_TOKEN`)}=${process.env.CONTENTFUL_ACCESS_TOKEN}`);
util.log(`${util.colors.magenta(`CONTENTFUL_HOST`)}=${process.env.CONTENTFUL_HOST}`);

const DEFAULT_CONFIG = {
  contentful: {
    space: process.env.CONTENTFUL_SPACE,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    host: process.env.CONTENTFUL_HOST
  },
  base: undefined,
  dest: undefined,
  clean: undefined, // Defaults to [`$options.dest}`, `${options.base}/views/.contentful`]
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
      pattern: `.contentful/**/*.html`
    }
  },
  sitemap: undefined,
  serve: {
    server: {
      baseDir: undefined // Defaults to `${options.dest}`
    },
    files: false,
    notify: false,
    port: process.env.PORT || 3000,
    logLevel: `info`,
    open: false
  },
  watch: { tasks: [browserSync.reload] }
};

/**
 * Initializes the Contentful-Metalsmith build system with customizable options.
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
 * @param {Object} [options.views] - Options for `gulp-pipe-metalcontentful`.
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
      path.join(options.base, `views`, `.contentful`)
    ];

    DEFAULT_CONFIG.serve.server.baseDir = options.dest;

    DEFAULT_CONFIG.views.metadata = {
      p: function(p) {
        return view.getPath(p, path.join(options.dest, _.get(options, `rev.manifestFile`) || `rev-manifest.json`));
      }
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

      if (config.contentful.space) {
        generateContentfulDocuments(c)
          .then(() => views(c).bind(this)(callback))
          .catch(err => {
            util.log(util.colors.blue(`[contentful]`), util.colors.red(err));
            throw new Error(err);
          });
      }
      else {
        util.log(util.colors.blue(`[contentful]`), util.colors.yellow(`No credentials provided`));
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
    gulp.task(`sitemap`, function(callback) {
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
 * Generates HTML files with YAML front matters from Contentful entries.
 *
 * @param {Object} config - Config object.
 *
 * @return {Promise} - Promise with no fulfillment value.
 */
function generateContentfulDocuments(config) {
  return contentful
    .createClient({
      space: config.contentful.space,
      accessToken: config.contentful.accessToken,
      host: config.contentful.host
    })
    .getEntries()
    .then(res => {
      util.log(util.colors.blue(`[contentful]`), `Fetched a total of ${res.total} entries out of a ${res.limit} limit`);
      if (res.total) res.items.forEach(entry => util.log(util.colors.blue(`[contentful]`), `Fetched entry [${entry.sys.contentType.sys.id}]: ${entry.fields.title}`));
      const entries = contentful.reduce(res.items, false, config);

      if (!config.metadata) config.metadata = { data: {} };
      _.merge(config.metadata.data, entries);

      for (let contentType in entries) {
        const c = _.get(config, `collections.${contentType}`);

        if (c && c.permalink) {
          const subdir = `.contentful/${contentType}`;
          const dir = path.join(path.join(config.base || ``, config.src || ``), subdir);
          c.pattern = path.join(subdir, `**/*`);

          entries[contentType].forEach(entry => {
            const filename = `${_.kebabCase(entry.title)}.md`;
            const frontMatter = yaml.stringify(_.omit(entry, [`body`, `next`, `prev`]));
            fs.mkdirsSync(dir);
            fs.writeFileSync(path.join(dir, filename), `---\n${frontMatter}---\n${entry.body}`);
          });
        }
      }
    });
}
