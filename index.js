// (c) VARIANTE
/**
 * @file Gulp task for processing documents files, with the option to watch for
 *       changes by passing either `--watch` or `--w` flag when running the
 *       task using the CLI.
 */

const $ = require('gulp-task-helpers');
const sequence = require('run-sequence');
const size = require('gulp-size');
const util = require('gulp-util');

const FILE_EXTENSIONS = ['md', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'csv', 'rtf'];

const DEFAULT_CONFIG = {
  base: undefined,
  dest: undefined,
  src: undefined,
  watch: undefined
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
 * @param {string|Function|Array} [options.watch] - Task(s) or methods to invoke
 *                                                  whenever watched files have
 *                                                  changed. This array is
 *                                                  applied to `run-sequence`.
 *                                                  Defaults to the current
 *                                                  task name.
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

    if (shouldWatch && !isWatching) {
      isWatching = true;
      this.watch((config.watch && config.watch.files) || src, () => { sequence.use(this).apply(null, [].concat((config.watch && config.watch.tasks) || [taskName])); });
    }

    return this
      .src(src, { base: config.base })
      .pipe(size({ title: `[${taskName}]`, gzip: true }))
      .pipe(this.dest(dest));
  }
};
