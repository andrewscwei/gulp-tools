// (c) Andrew Wei
/**
 * @file This file bundles up several Gulp tasks to form a full asset pipeline.
 *       The tasks involve processing images, videos, fonts, documents,
 *       stylesheets (via Sass), JavaScripts (via Webpack) and revisioning
 *       files.
 */

const $ = require('gulp-task-helpers');
const _ = require('lodash');
const media = require('gulp-pipe-media');
const path = require('path');
const rev = require('gulp-task-rev');
const sass = require('gulp-task-sass');
const sequence = require('run-sequence');
const webpack = require('gulp-task-webpack');

const DEFAULT_CONFIG = {
  base: undefined,
  dest: undefined,
  watch: undefined,
  images: undefined,
  videos: undefined,
  fonts: undefined,
  documents: undefined,
  extras: undefined,
  scripts: {
    context: undefined, // `options.base/javascripts`
    output: {
      path: undefined,  // `options.dest/assets/javascripts`
      publicPath: 'assets/javascripts'
    }
  },
  styles: {
    src: 'stylesheets/*',
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
  }
};

/**
 * Initializes Gulp tasks for processing and revisioning assets, such as images,
 * videos, fonts, documents, misc files (i.e. robots.txt), stylesheets and
 * JavaScripts. This pipeline uses Sass for handling stylesheets and Webpack for
 * handling JavaScripts.
 *
 * @param {Object} gulp - Gulp instance.
 * @param {Object} options - Task options.
 * @param {string} [options.base] - Fallback base path if individual task base
 *                                  paths are not provided.
 * @param {string} [options.dest] - Fallback dest path if individual task dest
 *                                  paths are not provided.
 * @param {Object} [options.watch] - Fallback watch options if invidual task
 *                                   watch options are not provided.
 * @param {Object} [options.images] - Options for the `images` task in
 *                                    `gulp-pipe-media`.
 * @param {Object} [options.videos] - Options for the `videos` task in
 *                                   `gulp-pipe-media`.
 * @param {Object} [options.fonts] - Options for the `fonts` task in
 *                                   `gulp-pipe-media`.
 * @param {Object} [options.documents] - Options for the `documents` task in
 *                                       `gulp-pipe-media`.
 * @param {Object} [options.extras] - Options for the `extras` task in
 *                                    `gulp-pipe-media`.
 * @param {Object} [options.scripts] - Options for `gulp-task-webpack`.
 * @param {Object} [options.styles] - Options for `gulp-task-sass`.
 * @param {Object} [options.rev] - Options for `gulp-task-rev`.
 * @param {boolean} [extendsDefaults=true] - Maps to `useConcat` param in
 *                                           `gulp-task-helpers`#config.
 */
exports.init = function(gulp, options, extendsDefaults) {
  if (typeof extendsDefaults !== 'boolean') extendsDefaults = true;

  // Set defaults before merging.
  if (options.base) {
    DEFAULT_CONFIG.scripts.context = path.join(options.base, 'javascripts');
  }

  if (options.dest) {
    DEFAULT_CONFIG.scripts.output.path = path.join(options.dest, DEFAULT_CONFIG.scripts.output.publicPath);
    DEFAULT_CONFIG.styles.dest = path.join(options.dest, 'assets');
    DEFAULT_CONFIG.styles.envs.production.purify = path.join(options.dest, '**/*');
    DEFAULT_CONFIG.rev.envs.production.src = options.dest;
  }

  const config = $.config(options, DEFAULT_CONFIG, extendsDefaults);
  const tasks = ['images', 'videos', 'fonts', 'documents', 'extras', 'scripts', 'styles', 'rev'];
  const seq = [];

  media.init(gulp, config, extendsDefaults);

  gulp.task('scripts', webpack(_.merge(_.omit(config, tasks), _.get(config, 'scripts')), { callback: config.watch.tasks && (typeof config.watch.tasks[0] === 'function') && config.watch.tasks[0] }, extendsDefaults));
  gulp.task('styles', sass(_.merge(_.omit(config, tasks), _.get(config, 'styles')), extendsDefaults));
  gulp.task('rev', rev(_.merge(_.omit(config, tasks), _.get(config, 'rev')), extendsDefaults));

  if (options.images !== false) seq.push('images');
  if (options.videos !== false) seq.push('videos');
  if (options.fonts !== false) seq.push('fonts');
  if (options.documents !== false) seq.push('documents');
  if (options.extras !== false) seq.push('extras');

  gulp.task('assets', function(callback) {
    sequence.use(gulp).apply(null, seq.concat(['scripts', 'styles', 'rev', callback]));
  });
};
