// © Andrew Wei
/**
 * @file An end-to-end Gulp build system for assets only.
 */

const $ = require(`./helpers/task-helpers`);
const _ = require(`lodash`);
const browserSync = require(`browser-sync`);
const del = require(`del`);
const documents = require(`./tasks/documents`);
const extras = require(`./tasks/extras`);
const fonts = require(`./tasks/fonts`);
const images = require(`./tasks/images`);
const gulp = require(`gulp`);
const path = require(`path`);
const rev = require(`./tasks/rev`);
const sass = require(`./tasks/sass`);
const util = require(`gulp-util`);
const scripts = require(`./tasks/scripts`);
const sequence = require(`run-sequence`);
const videos = require(`./tasks/videos`);

util.log(`${util.colors.magenta(`NODE_ENV`)}=${process.env.NODE_ENV}`);
util.log(`${util.colors.magenta(`PORT`)}=${process.env.PORT}`);

const DEFAULT_CONFIG = {
  base: undefined,
  dest: undefined,
  clean: undefined, // Defaults to [`$options.dest}`]
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
 * Initializes the build system with customizable options. This operation
 * creates the following Gulp tasks for you: `clean`, `serve`, `images`,
 * `videos`, `fonts`, `documents`, `extras`, `scripts`, `styles`, `rev` and
 * `default`.
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
 * @param {Array} [options.clean] - Path(s) to remove in the `clean` task.
 * @param {Object} [options.serve] - Options for `browser-sync`.
 * @param {boolean} [extendsDefaults=true] - Maps to `useConcat` param in
 *                                           helpers/task-helpers#config.
 */
exports.init = function(options, extendsDefaults) {
  if (typeof extendsDefaults !== `boolean`) extendsDefaults = true;

  if (options.base) {
    DEFAULT_CONFIG.scripts.context = path.join(options.base, `javascripts`);
  }

  if (options.dest && options.base) {
    DEFAULT_CONFIG.clean = [options.dest];
    DEFAULT_CONFIG.serve.server.baseDir = options.dest;
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
  const tasks = [`clean`, `images`, `videos`, `fonts`, `documents`, `extras`, `scripts`, `styles`, `rev`, `serve`];
  const seq = [];

  gulp.task(`clean`, function() {
    if (!config.clean || !config.clean.length) return;
    config.clean.forEach(val => util.log(util.colors.blue(`[clean]`), `Removing`, util.colors.cyan(val)));
    return del(config.clean, { force: true });
  });

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

  gulp.task(`default`, function(callback) {
    let s = [`clean`].concat(seq);
    if (util.env[`serve`] || util.env[`s`]) s.push(`serve`);
    s.push(callback);
    sequence.use(gulp).apply(null, s);
  });
};
