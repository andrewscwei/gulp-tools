// (c) Andrew Wei
/**
 * @file An end-to-end Gulp build system for assets only.
 */

const $ = require('gulp-task-helpers');
const _ = require('lodash');
const browserSync = require('browser-sync');
const del = require('del');
const gulp = require('gulp');
const util = require('gulp-util');
const sequence = require('run-sequence');

util.log(`${util.colors.magenta('NODE_ENV')}=${process.env.NODE_ENV}`);
util.log(`${util.colors.magenta('PORT')}=${process.env.PORT}`);

const DEFAULT_CONFIG = {
  base: undefined,
  dest: undefined,
  clean: undefined, // Defaults to [`$options.dest}`]
  serve: {
    server: {
      baseDir: undefined // Defaults to `${options.dest}`
    },
    files: false,
    notify: false,
    port: process.env.PORT || 3000,
    logLevel: 'info',
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
 * @param {Object} options - System options, extends options supported by
 *                           `gulp-pipe-assets`, with a few extras (see below).
 * @param {string} options.base - Fallback base path for source files.
 * @param {string} options.dest - Fallback path to destination directory where
 *                                piped files are written to.
 * @param {Object} [options.watch] - Fallback file watching options.
 * @param {Object} [options.images] - Options for `gulp-task-images`.
 * @param {Object} [options.videos] - Options for `gulp-task-videos`.
 * @param {Object} [options.fonts] - Options for `gulp-task-fonts`.
 * @param {Object} [options.documents] - Options for `gulp-task-documents`.
 * @param {Object} [options.extras] - Options for `gulp-task-extras`.
 * @param {Object} [options.styles] - Options for `gulp-task-sass`.
 * @param {Object} [options.scripts] - Options for `gulp-task-webpack`.
 * @param {Object} [options.rev] - Options for `gulp-task-rev`.
 * @param {Array} [options.clean] - Path(s) to remove in the `clean` task.
 * @param {Object} [options.serve] - Options for `browser-sync`.
 * @param {boolean} [extendsDefaults=true] - Maps to `useConcat` param in
 *                                           `gulp-task-helpers`#config.
 */
exports.init = function(options, extendsDefaults) {
  if (typeof extendsDefaults !== 'boolean') extendsDefaults = true;

  if (options.dest && options.base) {
    DEFAULT_CONFIG.clean = [options.dest];
    DEFAULT_CONFIG.serve.server.baseDir = options.dest;
  }

  const config = $.config(options, DEFAULT_CONFIG, extendsDefaults);
  const tasks = ['clean', 'serve', 'images', 'videos', 'fonts', 'documents', 'extras', 'scripts', 'styles', 'rev'];

  require('gulp-pipe-assets').init(gulp, _.omit(config, ['clean', 'serve']), extendsDefaults);

  gulp.task('clean', function() {
    if (!config.clean || !config.clean.length) return;
    config.clean.forEach(val => util.log(util.colors.blue('[clean]'), 'Removing', util.colors.cyan(val)));
    return del(config.clean, { force: true });
  });

  gulp.task('serve', function() {
    browserSync.init(config.serve);
  });

  gulp.task('default', function(callback) {
    let seq = ['clean'];
    seq.push('assets');
    if (util.env['serve'] || util.env['s']) seq.push('serve');
    seq.push(callback);
    sequence.use(gulp).apply(null, seq);
  });
};
