# gulp-task-webpack [![Circle CI](https://circleci.com/gh/VARIANTE/gulp-task-webpack/tree/master.svg?style=svg)](https://circleci.com/gh/VARIANTE/gulp-task-webpack/tree/master) [![npm version](https://badge.fury.io/js/gulp-task-webpack.svg)](https://badge.fury.io/js/gulp-task-webpack)

Gulp task for Webpack.

## Usage

```js
import gulp from 'gulp';
import browserSync from 'browser-sync';
import webpack from 'gulp-task-webpack';

gulp.task('scripts', webpack(options, true, {
  callback: browserSync.reload
}));
```

```
$ gulp scripts
```

## API

### `webpack(options[, extendsDefaults][, watchOptions])`

#### `options`

Type: `Object`<br>
Default: 
```js
{
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
  resolveLoader: {
    modulesDirectories: [
      path.join(__dirname, 'node_modules')
    ]
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
```

[`webpack`](https://webpack.github.io/) options. You can override options for specific `NODE_ENV` environments by putting the same option inside `options.envs.{NODE_ENV}`. For example:

```js
{
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common.js')
  ],
  envs: {
    production: {
      plugins: [
        new webpack.optimize.CommonsChunkPlugin('common.js'),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, sourceMap: false })
      ]
    }
  }
}
```

...would use Webpack's `UglifyJsPlugin` when `NODE_ENV` is `production`. 

When `NODE_ENV` is blank, `production` environment is assumed.

#### `watchOptions`

Type: `Object`<br>
Default: `undefined`

Options that define the watching behavior. If set to `false`, file watching will be disabled even if `--watch` is set.

##### `watchOptions.callback`

Type: `Function`<br>
Default: `undefined`

Method invoked whenever Webpack rebundles changed files.

#### `extendsDefaults`

Type: `boolean`<br>
Default: `true`

This module has a default Webpack config provided for you. When you pass in your own Webpack config via the `options` parameter, the module resolves your config and the default config by using `lodash`(https://lodash.com/)'s `merge` function, which doesn't concatenate array values. If `extendsDefaults` is set to `true`, array values will be concatenated.

## Watching for Changes

You can pass a `--watch` or `--w` flag to the Gulp command to enable file watching, like so:

```
$ gulp scripts --watch
```

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
