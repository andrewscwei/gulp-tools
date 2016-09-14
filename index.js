// (c) Andrew Wei
/**
 * @file Gulp pipeline for processing templates content managed by Contentful.
 *       This pipeline generates a single task, `views`, which does two things:
 *       1) fetch and process documents from the Contentful repo so the
 *       resulting data can be made useful to the templates, and 2) generate
 *       static views using Metalsmith.
 */

const $ = require('gulp-task-helpers');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const contentful = require('./helpers');
const util = require('gulp-util');
const yaml = require('yamljs');

const DEFAULT_CONFIG = {
  src: 'views',
  contentful: {
    space: undefined,
    accessToken: undefined,
    host: undefined
  },
  related: {
    pattern: '.contentful/**/*.html'
  }
};

/**
 * Initializes the Contentful-Metalsmith pipeline with customizable options. The
 * options are basically an extension of the options supported by
 * `gulp-task-metalsmith`.
 *
 * @param {Object} gulp - Gulp instance.
 * @param {Object} options - Pipeline options, extends options supported by
 *                           `gulp-task-metalsmith`.
 * @param {string} options.contentful - Contentful options.
 * @param {boolean} [extendsDefaults=true] - Maps to `useConcat` param in
 *                                           `gulp-task-helpers`#config.
 *
 * @return {Function} - A function that returns a Gulp stream.
 */
exports.init = function(gulp, options, extendsDefaults) {
  const config = $.config(options, DEFAULT_CONFIG, (typeof extendsDefaults !== 'boolean') || extendsDefaults);

  gulp.task('views', function(callback) {
    if (config.contentful.space) {
      generateContentfulDocuments(config)
      .then(() => require('gulp-task-metalsmith')(config).bind(this)(callback))
      .catch(err => {
        util.log(util.colors.blue(`[contentful]`), util.colors.red(err));
        throw new Error(err);
      });
    }
    else {
      util.log(util.colors.blue(`[contentful]`), util.colors.yellow('No credentials provided'));
      require('gulp-task-metalsmith')(config).bind(this)(callback);
    }
  });
};

/**
 * Generates HTML files with YAML front matters from Contentful entries.
 *
 * @param {Object} config - Config object.
 *
 * @return {Promise} - Promise with no fulfillment value.
 */
function generateContentfulDocuments(config) {
  return contentful
    .createClient({
      space: config.contentful.space,
      accessToken: config.contentful.accessToken,
      host: config.contentful.host
    })
    .getEntries()
    .then(res => {
      util.log(util.colors.blue('[contentful]'), `Fetched a total of ${res.total} entries out of a ${res.limit} limit`);
      if (res.total) res.items.forEach(entry => util.log(util.colors.blue('[contentful]'), `Fetched entry [${entry.sys.contentType.sys.id}]: ${entry.fields.title}`));
      const entries = contentful.reduce(res.items, false, config);

      if (!config.metadata) config.metadata = { data: {} };
      _.merge(config.metadata.data, entries);

      for (let contentType in entries) {
        const c = _.get(config, `collections.${contentType}`);

        if (c && c.collection) {
          const subdir = `.contentful/${contentType}`;
          const dir = path.join(path.join(config.base || '', config.src || ''), subdir);
          c.pattern = path.join(subdir, '**/*');

          entries[contentType].forEach(entry => {
            const filename = `${_.kebabCase(entry.title)}.md`;
            const frontMatter = yaml.stringify(_.omit(entry, ['body', 'next', 'prev']));
            fs.mkdirsSync(dir);
            fs.writeFileSync(path.join(dir, filename), `---\n${frontMatter}---\n${entry.body}`);
          });
        }
      }
    });
}
