// © Andrew Wei
/**
 * @file Gulp task for processing Sass files. Option to watch for changes by
 *       passing either `--watch` or `--w` flag in the CLI.
 */

const $ = require(`gulp-task-helpers`);
const autoprefixer = require(`autoprefixer`);
const cssnano = require(`cssnano`);
const globbing = require(`gulp-css-globbing`);
const path = require(`path`);
const postcss = require(`gulp-postcss`);
const purifycss = require(`gulp-purifycss`);
const sass = require(`gulp-sass`);
const size = require(`gulp-size`);
const sequence = require(`run-sequence`);
const sourcemaps = require(`gulp-sourcemaps`);
const util = require(`gulp-util`);

const FILE_EXTENSIONS = [`sass`, `scss`, `css`];
const PURIFY_EXTENSIONS = [`js`, `html`, `htm`, `php`];

const DEFAULT_CONFIG = {
  base: undefined,
  dest: undefined,
  src: undefined,
  watch: undefined,
  sass: undefined,
  globbing: {
    extensions: FILE_EXTENSIONS.map(val => (`.${val}`))
  },
  autoprefixer: undefined,
  nano: false,
  purify: false,
  sourcemaps: true
};

/**
 * Method that defines the Gulp task.
 *
 * @param {Object} options - Task options.
 * @param {string} [options.base] - Base path for the source files to emit.
 * @param {string|string[]} [options.src] - Glob pattern(s), relative to
 *                                          `options.base` if specified, that
 *                                          specifies what files to emit into
 *                                          the Gulp stream. These patterns are
 *                                          automatically appended with a
 *                                          wildcard glob of affected file
 *                                          extensions unless custom extensions
 *                                          are specified in the patterns.
 * @param {string} options.dest - Destination path to write files to.
 * @param {Object} [options.watch] - Options that define the file watching
 *                                   behavior. If set to `false`, watching will
 *                                   be disabled even if the CLI flag is set.
 * @param {string|string[]} [options.watch.files] - Glob pattern(s) that matches
 *                                                  files to watch. Defaults to
 *                                                  the emitted source files.
 * @param {string|Function|Array} [options.watch.tasks] - Array of task names or
 *                                                        functions to execute
 *                                                        when watched files
 *                                                        change. Defaults to
 *                                                        the current task name.
 * @param {Object} [options.sass] - Options for `gulp-sass`.
 * @param {Object} [options.autoprefixer] - Options for `autoprefixer`. If set
 *                                          to `false`, `autoprefixer` will be
 *                                          skipped.
 * @param {Object} [options.globbing] - Options for `gulp-css-globbing`.
 * @param {Object} [options.nano] - Options for `cssnano`. If `false`, `cssnano`
 *                                  will be skipped.
 * @param {boolean} [options.sourcemaps] - Specifies whether sourcemaps are
 *                                         enabled.
 * @param {boolean} [extendsDefaults=true] - Maps to `useConcat` param in
 *                                           `gulp-task-helpers`#config.
 *
 * @return {Function} - A function that returns a Gulp stream for this task.
 */
module.exports = function(options, extendsDefaults) {
  let isWatching = false;

  return function() {
    const taskName = this.seq[0];

    // Set defaults based on options before merging.
    if (options.src) {
      DEFAULT_CONFIG.watch = {
        files: [$.glob(path.join(path.dirname(options.src), `**/*`), { base: options.base, exts: FILE_EXTENSIONS })],
        tasks: [taskName]
      };

      DEFAULT_CONFIG.sass = {
        includePaths: [
          path.dirname(path.join(options.base || ``, options.src || ``)),
          path.join(require.resolve(`gulp`).split(`node_modules`)[0], `node_modules`)
        ]
      };
    }

    const config = $.config(options, DEFAULT_CONFIG, (typeof extendsDefaults !== `boolean`) || extendsDefaults);
    const shouldWatch = (util.env[`watch`] || util.env[`w`]) && (config.watch !== false);
    const src = $.glob(config.src, { base: config.base, exts: FILE_EXTENSIONS });
    const dest = $.glob(``, { base: config.dest });
    const postcssPlugins = [];
    const purify = config.purify && [].concat($.glob(config.purify, { exts: PURIFY_EXTENSIONS }));
    if (config.autoprefixer !== false) postcssPlugins.push(autoprefixer(config.autoprefixer));
    if (config.nano !== false) postcssPlugins.push(cssnano());

    if (shouldWatch && !isWatching) {
      isWatching = true;
      this.watch(config.watch.files, () => sequence.use(this).apply(null, config.watch.tasks));
    }

    let stream = this
      .src(src, { base: config.base })
      .pipe(globbing(config.globbing));

    if (config.sourcemaps) stream = stream.pipe(sourcemaps.init());
    stream = stream.pipe(sass(config.sass).on(`error`, function(err) {
      if (shouldWatch) {
        // When watching, don't kill the process.
        util.log(util.colors.blue(`[sass]`), util.colors.red(err));
        this.emit(`end`);
      }
      else {
        throw new util.PluginError(`sass`, err);
      }
    }));
    if (purify) stream = stream.pipe(purifycss(purify));
    stream = stream.pipe(postcss(postcssPlugins));
    if (config.sourcemaps) stream = stream.pipe(sourcemaps.write(`/`));

    return stream
      .pipe(size({ title: `[${taskName}]`, gzip: true }))
      .pipe(this.dest(dest));
  };
};
