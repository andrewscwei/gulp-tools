// (c) Andrew Wei

const _ = require('lodash');
const async = require('async');
const JSDOM = require('jsdom').JSDOM;
const path = require('path');
const util = require('gulp-util');
const MathJax = require('mathjax-node');

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
    MathJax.config(_.omit(options, 'delimiters') || {});

    const delimiters = options.delimiter || [['\\(', '\\)']];

    async.eachSeries(Object.keys(files), prerender, done);

    function prerender(file, done) {
      const data = files[file];

      if ((path.extname(file) !== '.html') || !data.mathjax) {
        done();
      }
      else {
        const contents = data.contents.toString('utf8');
        const window = new JSDOM(contents).window;
        
        let innerHTML = window.document.body.innerHTML;
        let matches = match(innerHTML);
        let offset = 0;

        function escape(regexString) {
          return regexString.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        }

        function match(string) {
          let matches = [];

          for (let i = 0; i < delimiters.length; i++) {
            const start = delimiters[i][0];
            const end = delimiters[i][1];
            const regex1 = new RegExp(`${escape(start)}\\s*(.*)\\s*${escape(end)}`, 'g');
            const regex2 = new RegExp(`${escape(start)}\\n\\s*([\\s\\S]*)\\n\\s*${escape(end)}`, 'g');

            let match;
            while (match = regex1.exec(string)) matches.push(match);
            while (match = regex2.exec(string)) matches.push(match);
          }
          
          return matches;
        }

        function parse(match, done) {
          const index = match.index + offset;
          const wholeMatch = match[0];
          const firstHalf = innerHTML.substring(0, index);
          const secondHalf = innerHTML.substring(index + wholeMatch.length, innerHTML.length);
          const math = match[1];
    
          MathJax.typeset({ math: math, svg: true, format: 'TeX' }, (data) => {
            innerHTML = firstHalf + data.svg + secondHalf;
            offset += data.svg.length - wholeMatch.length;
            done();
          });
        }

        async.eachSeries(matches, parse, () => {
          window.document.body.innerHTML = innerHTML;
          const html = '<!DOCTYPE html>\n' + window.document.documentElement.outerHTML.replace(/^(\n|\s)*/, '');
          data.contents = new Buffer(html);

          if (locale)
            util.log(util.colors.blue('[metalsmith]'), util.colors.green(`[${locale}]`), 'Prerendered MathJax for', util.colors.magenta(file));
          else
            util.log(util.colors.blue('[metalsmith]'), 'Prerendered MathJax for', util.colors.magenta(file));
            
          done();
        });
      }
    }
  };
};
