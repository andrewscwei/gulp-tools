// (c) VARIANTE
/**
 * @file Gulp task for processing JavaScript files using Webpack, with the
 *       option to use the built-in Webpack watching feature by passing either
 *       `--watch` or `--w` flag when running the task using the CLI.
 */

const $ = require('gulp-task-helpers');
const path = require('path');
const util = require('gulp-util');
const webpack = require('webpack');

const DEFAULT_CONFIG = {
  output: {
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    loaders: [{
      test: /\.js/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['es2015']
      }
    }, {
      test: /\.json/,
      loader: 'json',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common.js')
  ],
  envs: {
    development: {
      debug: true,
      devtool: 'eval-source-map'
    },
    production: {
      plugins: [
        new webpack.optimize.CommonsChunkPlugin('common.js'),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, sourceMap: false })
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
 * @param {boolean} [extendsDefaults=true] - Specifies whether array values are
 *                                           concatenated when merging config
 *                                           options with defaults.
 *
 * @return {Function} - A function that returns a Gulp stream.
 */
module.exports = function(options, watchOptions, extendsDefaults) {
  if (typeof extendsDefaults !== 'boolean') extendsDefaults = true;


  let isWatching = false;

  return function(callback) {
    const taskName = this.seq[0];

    // Set defaults based on options before merging.
    if (options.context) {
      DEFAULT_CONFIG.resolve.root = [options.context];
    }

    const config = $.config(options, DEFAULT_CONFIG, extendsDefaults);
    const watchCallback = watchOptions && watchOptions.callback;
    const shouldWatch = (util.env['watch'] || util.env['w']) && (watchOptions !== false);

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
            util.log(util.colors.blue('[webpack]'), util.colors.red(err));
          else if (details.errors.length > 0)
            util.log(util.colors.blue('[webpack]'), util.colors.red(stats.toString()));
          else
            util.log(util.colors.blue('[webpack]'), stats.toString());

          if (!isWatching)
            done();
          else if (typeof watchCallback === 'function')
            watchCallback();

          isWatching = shouldWatch;
        }
      };
    }
  }
};
