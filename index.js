// (c) Andrew Wei
/**
 * @file Gulp pipeline for media files (i.e. images, videos, fonts, documents,
 *       and other miscellaneous files), with the option to watch for
 *       changes by passing either `--watch` or `--w` flag when running the
 *       task using the CLI.
 */

const $ = require('gulp-task-helpers');
const _ = require('lodash');
const documents = require('./tasks/documents');
const extras = require('./tasks/extras');
const fonts = require('./tasks/fonts');
const images = require('./tasks/images');
const path = require('path');
const sequence = require('run-sequence');
const videos = require('./tasks/videos');

const DEFAULT_CONFIG = {
  base: undefined,
  dest: undefined,
  watch: undefined,
  images: {
    src: 'images/**/*',
    dest: undefined // `options.dest/assets`
  },
  videos: {
    src: 'videos/**/*',
    dest: undefined // `options.dest/assets`
  },
  fonts: {
    src: 'fonts/**/*',
    dest: undefined // `options.dest/assets`
  },
  documents: {
    src: 'documents/**/*',
    dest: undefined // `options.dest/assets`
  },
  extras: {
    src: '*'
  }
};

/**
 * Creates media processing Gulp tasks for images, videos, documents and fonts.
 *
 * @param {Object} gulp - Gulp instance.
 * @param {Object} options - Task options.
 * @param {string} [options.base] - Fallback base path if individual task base
 *                                  paths are not provided.
 * @param {string} [options.dest] - Fallback dest path if individual task dest
 *                                  paths are not provided.
 * @param {Object} [options.watch] - Fallback watch options if invidual task
 *                                   watch options are not provided.
 * @param {Object|boolean} [options.images] - Options for `./tasks/images`. If
 *                                            `false`, this task is disabled.
 * @param {Object|boolean} [options.videos] - Options for `./tasks/videos`. If
 *                                            `false`, this task is disabled.
 * @param {Object|boolean} [options.fonts] - Options for `./tasks/fonts`. If
 *                                           `false`, this task is disabled.
 * @param {Object|boolean} [options.documents] - Options for `./tasks/documents`.
 *                                               If `false`, this task is
 *                                               disabled.
 * @param {Object|boolean} [options.extras] - Options for `./tasks/extras`. If
 *                                            `false`, this task is disabled.
 * @param {boolean} [extendsDefaults=true] - Maps to `useConcat` param in
 *                                           `gulp-task-helpers`#config.
 */
exports.init = function(gulp, options, extendsDefaults) {
  if (typeof extendsDefaults !== 'boolean') extendsDefaults = true;

  // Set defaults before merging.
  if (options.dest) {
    DEFAULT_CONFIG.images.dest = path.join(options.dest, 'assets');
    DEFAULT_CONFIG.videos.dest = path.join(options.dest, 'assets');
    DEFAULT_CONFIG.fonts.dest = path.join(options.dest, 'assets');
    DEFAULT_CONFIG.documents.dest = path.join(options.dest, 'assets');
  }

  const config = $.config(options, DEFAULT_CONFIG, extendsDefaults);
  const tasks = ['images', 'videos', 'fonts', 'documents', 'extras'];
  const seq = [];

  if (options.images !== false) {
    gulp.task('images', images(_.merge(_.omit(config, tasks), _.get(config, 'images')), extendsDefaults));
    seq.push('images');
  }

  if (options.videos !== false) {
    gulp.task('videos', videos(_.merge(_.omit(config, tasks), _.get(config, 'videos')), extendsDefaults));
    seq.push('videos');
  }

  if (options.fonts !== false) {
    gulp.task('fonts', fonts(_.merge(_.omit(config, tasks), _.get(config, 'fonts')), extendsDefaults));
    seq.push('fonts');
  }

  if (options.documents !== false) {
    gulp.task('documents', documents(_.merge(_.omit(config, tasks), _.get(config, 'documents')), extendsDefaults));
    seq.push('documents');
  }

  if (options.extras !== false) {
    gulp.task('extras', documents(_.merge(_.omit(config, tasks), _.get(config, 'extras')), extendsDefaults));
    seq.push('extras');
  }

  gulp.task('media', function(callback) {
    sequence.use(gulp).apply(null, seq.concat(callback));
  });
};
