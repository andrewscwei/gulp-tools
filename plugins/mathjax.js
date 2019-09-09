// © Andrew Wei


const async = require('async');
const path = require('path');
const util = require('gulp-util');
const mathjaxDOM = require('mathjax-dom');

/**
 * Metalsmith for prerendering math equations in HTML files in MathJax.
 *
 * @param {Object} [options] - Options for MathJax.
 * @param {string} [locale] - Current locale.
 *
 * @return {Function} Metalsmith plugin.
 */
module.exports = function(options, locale) {
  return function(files, metalsmith, done) {
    async.eachSeries(Object.keys(files), prerender, done);

    function prerender(file, done) {
      const data = files[file];

      if ((path.extname(file) !== '.html') || !data.mathjax) {
        done();
      }
      else {
        const contents = data.contents.toString('utf8');

        mathjaxDOM(contents, Object.assign(typeof options === 'object' ? options : {}, typeof data.mathjax === 'object' ? data.mathjax : {}))
          .then(html => {
            data.contents = new Buffer(html);

            if (locale) util.log(util.colors.blue('[metalsmith]'), util.colors.green(`[${locale}]`), 'Prerendered MathJax for', util.colors.magenta(file));
            else util.log(util.colors.blue('[metalsmith]'), 'Prerendered MathJax for', util.colors.magenta(file));

            done();
          })
          .catch(err => {
            if (locale) util.log(util.colors.blue('[metalsmith]'), util.colors.green(`[${locale}]`), util.colors.red('Error occured when attempting MathJax rendering on'), util.colors.magenta(file));
            else util.log(util.colors.blue('[metalsmith]'), util.colors.red('Error occured when attempting MathJax rendering on'), util.colors.magenta(file));

            throw (err);
          });
      }
    }
  };
};
