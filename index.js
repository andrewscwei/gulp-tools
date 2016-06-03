// (c) VARIANTE
/**
 * @file Gulp task for processing image files, with the option to watch for
 *       changes by passing either `--watch` or `--w` flag when running the
 *       task using the CLI.
 */

const $ = require('gulp-task-helpers');
const imagemin = require('gulp-imagemin');
const sequence = require('run-sequence');
const size = require('gulp-size');
const util = require('gulp-util');

const FILE_EXTENSIONS = ['jpg', 'jpeg', 'gif', 'png', 'svg', 'ico', 'tiff', 'bmp'];

const DEFAULT_CONFIG = {
  base: undefined,
  dest: undefined,
  src: undefined,
  watch: undefined,
  envs: {
    development: {
      imagemin: false
    }
  }
};

/**
 * Method that defines the task with configurable options. Only `options.base`
 * and `options.dest` are required.
 *
 * @param {Object} options - Task options.
 * @param {string} [options.base] - Base path for the source files to emit.
 * @param {string|string[]} options.src - Glob or an array of globs that matches
 *                                        files to emit. These globs are all
 *                                        relative to `options.base`.
 * @param {string} options.dest - Path of destination directory to write files
 *                                to.
 * @param {Object} [options.imagemin] - `gulp-imagemin` options. If `false`,
 *                                      `gulp-imagemin` will be omitted.
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
 *
 * @return {Function} - A function that returns a Gulp stream.
 */
module.exports = function(options) {
  const config = $.config(options, DEFAULT_CONFIG);
  let isWatching = false;

  return function() {
    const taskName = this.seq[0];
    const shouldWatch = (util.env['watch'] || util.env['w']) && (config.watch !== false);
    const src = $.glob(config.src, { base: config.base, exts: FILE_EXTENSIONS });
    const dest = $.glob('', { base: config.dest });

    if (shouldWatch && !isWatching) {
      isWatching = true;
      this.watch((config.watch && config.watch.files) || src, () => { sequence.use(this).apply(null, [].concat((config.watch && config.watch.tasks) || [taskName])); });
    }

    let stream = this.src(src, { base: config.base });

    if (config.imagemin !== false)
      stream = stream.pipe(imagemin(config.imagemin));

    return stream
      .pipe(size({ title: `[${taskName}]`, gzip: true }))
      .pipe(this.dest(dest));
  }
};
