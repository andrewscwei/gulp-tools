// (c) VARIANTE
/**
 * @file Gulp task for processing Sass files, with the option to watch for
 *       changes by passing either `--watch` or `--w` flag when running the
 *       task using the CLI.
 */

const $ = require('gulp-task-helpers');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const purifycss = require('gulp-purifycss');
const sass = require('gulp-sass');
const size = require('gulp-size');
const sequence = require('run-sequence');
const sourcemaps = require('gulp-sourcemaps');
const util = require('gulp-util');

const FILE_EXTENSIONS = ['sass', 'scss', 'css'];
const PURIFY_EXTENSIONS = ['js', 'html', 'htm', 'php'];

const DEFAULT_CONFIG = {
  base: undefined,
  dest: undefined,
  src: undefined,
  watch: undefined,
  sass: undefined,
  autoprefixer: undefined,
  nano: false,
  purify: false,
  sourcemaps: true,
  envs: {
    production: {
      nano: {},
      sourcemaps: false
    }
  }
};

/**
 * Method that defines the task with configurable options. Only `options.src`
 * and `options.dest` are required.
 *
 * @param {Object} options - Task options.
 * @param {string} [options.base] - Base path for the source files to emit.
 * @param {string|string[]} options.src - Glob or an array of globs that matches
 *                                        files to emit. These globs are all
 *                                        relative to `options.base`.
 * @param {string} options.dest - Path of destination directory to write files
 *                                to.
 * @param {Object} [options.watch] - Options that define the file watching
 *                                   behavior. If set to `false`, watching will
 *                                   be disabled even if the CLI flag is set.
 * @param {string|string[]} [options.watch.files] - Glob pattern(s) that matches
 *                                                  files to watch. Defaults to
 *                                                  the emitted files.
 * @param {string|Function|Array} [options.watch.tasks] - Array of task names or
 *                                                        functions to execute
 *                                                        when watched files
 *                                                        change. Defaults to
 *                                                        the current task name.
 * @param {Object} [options.sass] - Options for `gulp-sass`. Defaults to an
 *                                  object with `includePaths` set to
 *                                  `options.base`.
 * @param {Object} [options.autoprefixer] - Options for `autoprefixer`. If set
 *                                          to `false`, `autoprefixer` will be
 *                                          skipped.
 * @param {Object} [options.nano] - Options for `cssnano`. If `false`, `cssnano`
 *                                  will be skipped.
 * @param {boolean} [options.sourcemaps] - Specifies whether sourcemaps are
 *                                         enabled.
 * @param {boolean} [extendsDefaults=false] - Specifies whether array values are
 *                                            concatenated when merging config
 *                                            options with defaults.
 *
 * @return {Function} - A function that returns a Gulp stream.
 */
module.exports = function(options, extendsDefaults) {
  const config = $.config(options, DEFAULT_CONFIG, extendsDefaults);
  let isWatching = false;

  return function() {
    const taskName = this.seq[0];
    const shouldWatch = (util.env['watch'] || util.env['w']) && (config.watch !== false);
    const src = $.glob(config.src, { base: config.base, exts: FILE_EXTENSIONS });
    const dest = $.glob('', { base: config.dest });
    const postcssPlugins = [];
    const sassOptions = config.sass || { includePaths: [ config.base ] };
    const purify = config.purify && [].concat($.glob(config.purify, { exts: PURIFY_EXTENSIONS }));
    if (config.autoprefixer !== false) postcssPlugins.push(autoprefixer(config.autoprefixer));
    if (config.nano !== false) postcssPlugins.push(cssnano());

    if (shouldWatch && !isWatching) {
      isWatching = true;
      this.watch((config.watch && config.watch.files) || src, () => { sequence.use(this).apply(null, [].concat((config.watch && config.watch.tasks) || [taskName])); });
    }

    let stream = this.src(src);
    if (config.sourcemaps) stream = stream.pipe(sourcemaps.init());
    stream = stream.pipe(sass(sassOptions).on('error', function(err) {
      if (shouldWatch) {
        // When watching, don't kill the process.
        util.log(util.colors.blue(`[sass]`), util.colors.red(err));
        this.emit('end');
      }
      else {
        throw new util.PluginError('sass', err);
      }
    }));
    if (purify) stream = stream.pipe(purifycss(purify));
    stream = stream.pipe(postcss(postcssPlugins));
    if (config.sourcemaps) stream = stream.pipe(sourcemaps.write('/'));

    return stream
      .pipe(size({ title: `[${taskName}]`, gzip: true }))
      .pipe(this.dest(dest));
  }
};
