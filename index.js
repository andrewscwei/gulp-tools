// (c) VARIANTE
/**
 * @file Gulp task for processing fonts files, with the option to watch for
 *       changes by passing either `--watch` or `--w` flag when running the
 *       task using the CLI.
 */

const $ = require('gulp-task-helpers');
const _ = require('lodash');
const documents = require('gulp-task-documents');
const fonts = require('gulp-task-fonts');
const images = require('gulp-task-images');
const sequence = require('run-sequence');
const videos = require('gulp-task-videos');

const DEFAULT_CONFIG = {
  base: undefined,
  dest: undefined,
  watch: undefined,
  images: {
    src: 'images/**/*'
  },
  videos: {
    src: 'videos/**/*',
  },
  fonts: {
    src: 'fonts/**/*',
  },
  documents: {
    src: 'documents/**/*'
  }
};

/**
 * Creates media processing Gulp tasks.
 *
 * @param {Object} gulp - Gulp instance.
 * @param {Object} options - Task options.
 * @param {string} [options.base] - Fallback base path if individual task base
 *                                  paths are not provided.
 * @param {string} [options.dest] - Fallback dest path if individual task dest
 *                                  paths are not provided.
 * @param {Object} [options.watch] - Fallback watch options if invidual task
 *                                   watch options are not provided.
 * @param {Object} [options.images] - Options for `gulp-task-images`.
 * @param {Object} [options.videos] - Options for `gulp-task-videos`.
 * @param {Object} [options.fonts] - Options for `gulp-task-fonts`.
 * @param {Object} [options.documents] - Options for `gulp-task-documents`.
 * @param {boolean} [extendsDefaults=true] - Specifies whether array values are
 *                                           concatenated when merging config
 *                                           options with defaults.
 */
exports.init = function(gulp, options, extendsDefaults) {
  if (typeof extendsDefaults !== 'boolean') extendsDefaults = true;

  const config = $.config(options, DEFAULT_CONFIG, extendsDefaults);
  const tasks = ['images', 'videos', 'fonts', 'documents'];

  gulp.task('images', images(_.merge(_.omit(config, tasks), _.get(config, 'images')), extendsDefaults));
  gulp.task('videos', videos(_.merge(_.omit(config, tasks), _.get(config, 'videos')), extendsDefaults));
  gulp.task('fonts', fonts(_.merge(_.omit(config, tasks), _.get(config, 'fonts')), extendsDefaults));
  gulp.task('documents', documents(_.merge(_.omit(config, tasks), _.get(config, 'documents')), extendsDefaults));

  gulp.task('media', function(callback) {
    const seq = ['images', 'videos', 'fonts', 'documents'];
    sequence.use(gulp).apply(null, seq);
  });
};
