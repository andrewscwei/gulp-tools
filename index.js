// (c) Andrew Wei
/**
 * @file Gulp task for processing JavaScript files using Browserify. Option to
 *       watch for changes by passing either `--watch` or `--w` flag in the CLI.
 */

const $ = require('gulp-task-helpers');
const assert = require('assert');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const through2 = require('through2');
const uglify = require('gulp-uglify');
const util = require('gulp-util');
const watchify = require('watchify');

const FILE_EXTENSIONS = ['js'];

const DEFAULT_CONFIG = {
  base: undefined,
  src: undefined,
  dest: undefined,
  debug: true,
  uglify: false,
  sourcemaps: true,
  watch: {
    callback: undefined
  },
  transforms: [{
    name: 'babelify',
    options: {
      presets: ['es2015']
    }
  }],
  envs: {
    production: {
      debug: false,
      uglify: true,
      sourcemaps: false
    }
  }
};

/**
 * Returns a function that returns a Gulp stream for carrying out Browserify
 * operations.
 *
 * @param {Object} options - Customizable options that define the behavior of
 *                           the task.
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
 * @param {boolean} [options.debug] - Specifies bundler should operate in debug
 *                                    mode.
 * @param {boolean} [options.uglify] - Specifies whether bundled files should be
 *                                     uglified.
 * @param {boolean} [options.sourcemaps] - Specifies whether sourcemaps should
 *                                         be generated.
 * @param {Array} [options.transform] - Array of transforms to apply to the
 *                                      bundler.
 * @param {Object|boolean} [options.watch] - Options that define the file
 *                                           watching behavior. If set to
 *                                           `false`, watching will be disabled
 *                                           even if the CLI flag is set.
 * @param {Function} [options.watch.callback] - Method to invoke whenever a
 *                                              watched file changes.
 * @param {boolean} [extendsDefaults=true] - Maps to `useConcat` param in
 *                                           `gulp-task-helpers`#config.
 *
 * @return {Function} - A function that returns a Gulp stream.
 */
module.exports = function(options, extendsDefaults) {
  let isWatching = false;

  return function() {
    const taskName = this.seq[0];
    const config = $.config(options, DEFAULT_CONFIG, (typeof extendsDefaults !== 'boolean') || extendsDefaults);
    const src = $.glob(config.src, { base: config.base, exts: FILE_EXTENSIONS });
    const dest = $.glob('', { base: config.dest });
    const watchCallback = config.watch && config.watch.callback;
    const shouldWatch = (util.env['watch'] || util.env['w']) && (config.watch !== false);
    const gulp = this;

    return gulp.src(src)
      .pipe(through2.obj(function(file, enc, next) {
        const opts = {
          entries: [file.path],
          debug: config.debug
        };
        const bundler = (shouldWatch) ? watchify(browserify(opts)) : browserify(opts);
        const output = file.path.replace(file.base, '');

        if (shouldWatch) {
          bundler.on('time', function(time) { util.log(util.colors.blue('[browserify]'), output, util.colors.magenta(`in ${time} ms`)); });
          bundler.on('update', function() { bundle(bundler, output); });
        }

        bundle(bundler, output, next).on('end', function() { next(null, file); });
      }));

    function bundle(bundler, output, next) {
      let b = bundler;

      if (config.transforms) {
        for (let i = 0; i < config.transforms.length; i++) {
          const transform = config.transforms[i];
          assert(transform.name, 'Transform name must be provided');
          b = b.transform(transform.name, transform.options);
        }
      }

      b = b.bundle()
        .on('error', function(err) {
          util.log(util.colors.blue('[browserify]'), util.colors.red(`Error: ${err.message}`));
          if (next) next(); else this.emit('end');
        })
        .on('end', function() {
          if (isWatching && (typeof watchCallback === 'function')) watchCallback();
          isWatching = shouldWatch;
        })
        .pipe(source(output))
        .pipe(buffer());

      if (config.sourcemaps) b = b.pipe(sourcemaps.init({ loadMaps: true }));
      if (config.uglify) b = b.pipe(uglify()).on('error', util.log);
      if (config.sourcemaps) b = b.pipe(sourcemaps.write('./'));

      return b.pipe(gulp.dest(dest));
    }
  }
};
