// (c) VARIANTE
/**
 * @file Gulp pipeline for processing templates content managed by Prismic.io.
 *       This pipeline generates a single task, `views`, which does two things:
 *       1) fetch and process documents from the Prismic repo so the resulting
 *       data can be made useful to the templates, and 2) generate static
 *       views using Metalsmith.
 */

const $ = require('gulp-task-helpers');
const _ = require('lodash');
const browserSync = require('browser-sync');
const del = require('del');
const gulp = require('gulp');
const path = require('path');
const util = require('gulp-util');
const sequence = require('run-sequence');

const DEFAULT_CONFIG = {
  base: undefined,
  dest: undefined,
  clean: undefined, // Defaults to [`$options.dest}`, `${options.dest}/views/.prismic`]
  views: {
    apiEndpoint: process.env.PRISMIC_API_ENDPOINT,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  },
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
 * Initializes the Prismic-Metalsmith pipeline with customizable options. The
 * options are basically an extension of the options supported by
 * `gulp-task-metalsmith`.
 *
 * @param {Object} gulp - Gulp instance.
 * @param {Object} options - Pipeline options, extends options supported by
 *                           `gulp-task-metalsmith`.
 * @param {string} options.apiEndpoint - API endpoint of the Prismic repo.
 * @param {string} [options.accessToken] - Access token of the Prismic repo.
 * @param {boolean} [extendsDefaults=true] - Specifies whether array values are
 *                                           concatenated when merging config
 *                                           options with defaults.
 *
 * @return {Function} - A function that returns a Gulp stream.
 */
exports.init = function(options, extendsDefaults) {
  if (typeof extendsDefaults !== 'boolean') extendsDefaults = true;

  if (options.dest) {
    DEFAULT_CONFIG.clean = [
      options.dest,
      path.join(options.dest, 'views', '.prismic')
    ];

    DEFAULT_CONFIG.serve.server.baseDir = options.dest;
  }

  const config = $.config(options, DEFAULT_CONFIG, extendsDefaults);
  const tasks = ['clean', 'serve', 'images', 'videos', 'fonts', 'documents', 'extras', 'scripts', 'styles', 'rev', 'views'];

  require('gulp-pipe-assets').init(gulp, _.omit(config, ['views', 'clean', 'serve']), extendsDefaults);
  require('gulp-pipe-metalprismic').init(gulp, _.merge(_.omit(config, tasks), _.get(config, 'views')), extendsDefaults);

  gulp.task('clean', function(callback) {
    del(config.clean).then(paths => callback());
  });

  gulp.task('serve', function() {
    browserSync.init(config.serve);
  });

  gulp.task('default', function(callback) {
    let seq = ['clean', 'views', 'assets'];
    if (util.env['serve'] || util.env['s']) seq.push('serve');
    seq.push(callback);
    sequence.apply(null, seq);
  });
};
