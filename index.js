// (c) Andrew Wei
/**
 * @file Gulp pipeline for processing templates content managed by Prismic.io.
 *       This pipeline generates a single task, `views`, which does two things:
 *       1) fetch and process documents from the Prismic repo so the resulting
 *       data can be made useful to the templates, and 2) generate static
 *       views using Metalsmith.
 */

const $ = require('gulp-task-helpers');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const prismic = require('./prismic-helpers');
const util = require('gulp-util');
const yaml = require('yamljs');

const DEFAULT_CONFIG = {
  src: 'views',
  apiEndpoint: undefined,
  accessToken: undefined,
  related: {
    pattern: '.prismic/**/*.html'
  }
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
 * @param {boolean} [extendsDefaults=true] - Maps to `useConcat` param in
 *                                           `gulp-task-helpers`#config.
 *
 * @return {Function} - A function that returns a Gulp stream.
 */
exports.init = function(gulp, options, extendsDefaults) {
  const config = $.config(options, DEFAULT_CONFIG, (typeof extendsDefaults !== 'boolean') || extendsDefaults);

  gulp.task('views', function(callback) {
    if (config.apiEndpoint) {
      generatePrismicDocuments(config)
      .then(() => require('gulp-task-metalsmith')(config).bind(this)(callback))
      .catch(err => {
        util.log(util.colors.blue(`[prismic]`), util.colors.red(err));
        throw new Error(err);
      });
    }
    else {
      util.log(util.colors.blue(`[prismic]`), util.colors.yellow('No credentials provided'));
      require('gulp-task-metalsmith')(config).bind(this)(callback);
    }
  });
};

/**
 * Generates HTML files with YAML front matters from Prismic documents.
 *
 * @param {Object} config - Config object.
 *
 * @return {Promise} - Promise with no fulfillment value.
 */
function generatePrismicDocuments(config) {
  return prismic.getAPI(config.apiEndpoint, { accessToken: config.accessToken })
    .then(api => (prismic.getEverything(api, null, '', _.flatMap(config.collections, (val, key) => (`my.${key}.${val.sortBy}${val.reverse ? ' desc' : ''}`)))))
    .then(res => {
      util.log(util.colors.blue('[prismic]'), `Fetched a total of ${res.results.length} documents`);
      if (res.results.length) res.results.forEach(doc => util.log(util.colors.blue('[prismic]'), `Fetched document [${doc.type}]: ${doc.slug}`));
      const documents = prismic.reduce(res.results, false, config);

      // Populate config metadata with retrieved documents.
      if (!config.metadata) config.metadata = { data: {} };
      _.merge(config.metadata.data, documents);

      for (let docType in documents) {
        const c = _.get(config, `collections.${docType}`);

        if (c && c.permalink) {
          const subdir = `.prismic/${docType}`;
          const dir = path.join(path.join(config.base || '', config.src || ''), subdir);
          c.pattern = path.join(subdir, '**/*');

          documents[docType].forEach(doc => {
            const filename = `${doc.uid || _.kebabCase(doc.slug)}.html`;
            const frontMatter = yaml.stringify(_.omit(doc, ['next', 'prev']));
            fs.mkdirsSync(dir);
            fs.writeFileSync(path.join(dir, filename), `---\n${frontMatter}---\n`);
          });
        }
      }

      return;
    });
}
