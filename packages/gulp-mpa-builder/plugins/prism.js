// © Andrew Wei

const async = require(`async`);
const path = require(`path`);
const util = require(`gulp-util`);
const prismDOM = require(`prism-dom`);

/**
 * Metalsmith plugin for syntax highlighting code blocks using Prism.
 *
 * @return {Function} Metalsmith plugin.
 */
module.exports = function(options, locale) {
  options = options || {};

  return function(files, metalsmith, done) {
    async.eachSeries(Object.keys(files), prerender, done);

    function prerender(file, done) {
      const data = files[file];

      if ((path.extname(file) !== `.html`) || !data.prism) {
        done();
      }
      else {
        const contents = data.contents.toString(`utf8`);
        
        prismDOM(contents, Object.assign(typeof options === `object` ? options : {}, typeof data.prism === `object` ? data.prism : {}))
          .then(htmlString => {
            data.contents = new Buffer(htmlString);

            if (locale)
              util.log(util.colors.blue(`[metalsmith]`), util.colors.green(`[${locale}]`), `Finished Prism syntax highlighting for`, util.colors.magenta(file));
            else
              util.log(util.colors.blue(`[metalsmith]`), `Finished Prism syntax highlighting for`, util.colors.magenta(file));

            done();
          });
      }
    }
  };
};
