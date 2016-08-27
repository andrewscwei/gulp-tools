// (c) Andrew Wei
/**
 * @file Gulp task for performing static asset revisioning by appending content
 *       hash to filenames. Original paths in html/js/css files will be
 *       automatically replaced with the revisioned path. Option to add a prefix
 *       to revisioned paths (i.e. CDN host).
 */

const $ = require('gulp-task-helpers');
const fs = require('fs');
const path = require('path');
const replace = require('gulp-replace');
const rev = require('gulp-rev');
const util = require('gulp-util');

const FILE_EXTENSIONS = ['jpg', 'jpeg', 'gif', 'png', 'svg', 'ico', 'tiff', 'bmp', 'mov', 'avi', 'ogg', 'ogv', 'webm', 'flv', 'swf', 'mp4', 'mv4', 'eot', 'svg', 'ttf', 'woff', 'woff2', 'css', 'js', 'md', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'csv', 'rtf'];
const REPLACE_EXTENSIONS = ['html', 'htm', 'php', 'js', 'css'];

const DEFAULT_CONFIG = {
  src: undefined,
  ignore: `**/favicon.{ico,png}`,
  replace: undefined,
  prefix: undefined
};

/**
 * Method that defines the Gulp task.
 *
 * @param {Object} options - Task options.
 * @param {string} [options.src] - Path to the directory that contains files
 *                                 that needs to be revisioned. If unspecified,
 *                                 this module is disabled. By default, the most
 *                                 common file extensions are used.
 * @param {string|string[]} [options.ignore] - Glob pattern(s) matching files to
 *                                             ignore for revisioning.
 * @param {string|string[]} [options.replace] - Path to the directory that
 *                                              contains files that might have
 *                                              the original file paths of the
 *                                              revisioned files. Only the
 *                                              directory path is needed. This
 *                                              module automatically scans for
 *                                              html/js/css files within the
 *                                              directory. Defaults to the same
 *                                              directory as `options.src`.
 * @param {string} [options.prefix] - Prefix to be added to the revisioned file
 *                                    paths (i.e. CDN host).
 * @param {boolean} [extendsDefaults=true] - Maps to `useConcat` param in
 *                                           `gulp-task-helpers`#config.
 *
 * @return {Function} - A function that returns a Gulp stream.
 */
module.exports = function(options, extendsDefaults) {
  const config = $.config(options, DEFAULT_CONFIG, (typeof extendsDefaults !== 'boolean') || extendsDefaults);

  if (config.ignore) config.ignore = [].concat(config.ignore);
  config.ignore.forEach((val, i) => { config.ignore[i] = `!${val}`; });

  return function(callback) {
    if (!config.src || config.src.length === 0) {
      callback();
      return;
    }

    const taskName = this.seq[0];
    const src = $.glob(['**/*'].concat(config.ignore), { base: config.src, exts: FILE_EXTENSIONS });
    const manifestFileName = $.revManifest || 'rev-manifest.json';
    const rep = $.glob('**/*', { base: config.replace || config.src, exts: REPLACE_EXTENSIONS });

    this
      .src(src)
      .pipe(rev())
      .pipe(this.dest(config.src))
      .pipe(rev.manifest(manifestFileName))
      .pipe(this.dest(config.src))
      .on('end', () => {
        const manifest = require(path.join(config.src, manifestFileName));
        const pattern = Object.keys(manifest).map(v => (`${v}\\b`)).join('|');

        for (let v in manifest) {
          util.log(util.colors.blue(`[${taskName}]`), `${v} => ${manifest[v]}`);
          if (v !== manifest[v]) fs.unlinkSync(path.join(config.src, v));
        }

        if (config.prefix) {
          this
            .src(rep)
            .pipe(replace(new RegExp(`((?:\\.?\\.\\/?)+)?([\\/\\da-z\\.-]+)(${pattern})`, 'gi'), (m) => {
              let k = m.match(new RegExp(pattern, 'i'))[0];
              let v = manifest[k];
              return m.replace(k, v).replace(/^((?:\.?\.?\/?)+)?/, (config.prefix.charAt(config.prefix.length-1) === '/') ? config.prefix : `${config.prefix}/`);
            }))
            .pipe(this.dest(config.src))
            .on('end', callback)
            .on('error', callback);
        }
        else {
          this
            .src(rep)
            .pipe(replace(new RegExp(`${pattern}`, 'gi'), (m) => (manifest[m])))
            .pipe(this.dest(config.src))
            .on('end', callback)
            .on('error', callback);
        }
      })
      .on('error', callback);
  };
};
