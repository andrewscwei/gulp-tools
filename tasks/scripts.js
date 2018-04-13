// © Andrew Wei
/**
 * @file Gulp task for processing JavaScript files using Webpack. Option to
 *       watch for changes by passing either `--watch` or `--w` flag in the CLI.
 */

const $ = require(`../helpers/task-helpers`);
const util = require(`gulp-util`);
const webpack = require(`webpack`);

const DEFAULT_CONFIG = {
  output: {
    filename: `[name].js`,
    chunkFilename: `[chunkhash].js`
  },
  module: {
    rules: [{
      test: /\.js/,
      loader: `babel-loader`,
      options: {
        presets: [`env`]
      }
    }, {
      test: /\.json/,
      loader: `json-loader`
    }]
  },
  resolve: {
    extensions: [`.js`, `.json`]
  },
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },
  envs: {
    development: {
      devtool: `cheap-eval-source-map`,
      plugins: [
        new webpack.EnvironmentPlugin({
          NODE_ENV: `development`
        })
      ]
    },
    production: {
      plugins: [
        new webpack.EnvironmentPlugin({
          NODE_ENV: `production`
        }),
        new webpack.NoEmitOnErrorsPlugin(),
      ]
    }
  }
};

/**
 * Returns a function that returns a Gulp stream for carrying out Webpack
 * operations.
 *
 * @param {Object} options - `webpack` options.
 * @param {Function} [watchOptions.callback] - Method invoked every a Webpack
 *                                             rebundles changed files.
 * @param {Object|boolean} [watchOptions] - Object describing watch behavior. If
 *                                          set to `false`, watching will be
 *                                          disabled even if the `--watch` flag
 *                                          is set.
 * @param {boolean} [extendsDefaults=true] - Maps to `useConcat` param in
 *                                           `gulp-task-helpers`#config.
 *
 * @return {Function} - A function that returns a Gulp stream.
 */
module.exports = function(options, watchOptions, extendsDefaults) {
  let isWatching = false;

  return function(callback) {
    // Set defaults based on options before merging.
    if (options.context) {
      DEFAULT_CONFIG.resolve.modules = [options.context];
    }

    const config = $.config(options, DEFAULT_CONFIG, (typeof extendsDefaults !== `boolean`) || extendsDefaults);
    const watchCallback = watchOptions && watchOptions.callback;
    const shouldWatch = (util.env[`watch`] || util.env[`w`]) && (watchOptions !== false);

    if (shouldWatch)
      webpack(config).watch(100, bundle(callback));
    else
      webpack(config).run(bundle(callback));

    function bundle(done) {
      return function(err, stats) {
        let details = stats.toJson();

        if (!shouldWatch && err) {
          done(err);
        }
        else if (!shouldWatch && details.errors.length > 0) {
          done(details.errors);
        }
        else {
          if (err)
            util.log(util.colors.blue(`[webpack]`), util.colors.red(err));
          else if (details.errors.length > 0)
            util.log(util.colors.blue(`[webpack]`), util.colors.red(stats.toString()));
          else
            util.log(util.colors.blue(`[webpack]`), stats.toString());

          if (!isWatching)
            done();
          else if (typeof watchCallback === `function`)
            watchCallback();

          isWatching = shouldWatch;
        }
      };
    }
  };
};
