# gulp-task-webpack ![](https://img.shields.io/maintenance/no/2016)

Gulp task for [Webpack](https://webpack.github.io/).

## Usage

```js
import gulp from 'gulp';
import browserSync from 'browser-sync';
import webpack from 'gulp-task-webpack';

gulp.task('scripts', webpack({
  context: 'app/javascripts',
  entry: {
    application: 'application.js'
  },
  resolve: {
    modules: [
      path.join(__dirname, '../', 'node_modules')
    ]
  },
  output: {
    path: 'public/javascripts',
    publicPath: 'javascripts'
  }
}, {
  callback: browserSync.reload
}));
```

```
$ gulp scripts
```

## Example

Run the example using `$ npm run example` to see it in action.

## API

### `webpack(options[, watchOptions][, extendsDefaults])`

Return: `Function`

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
    rules: [{
      test: /\.js/,
      loader: 'babel-loader',
      options: {
        presets: ['env']
      }
    }, {
      test: /\.json/,
      loader: 'json-loader'
    }]
  },
  resolve: {
    extensions: ['.js', '.json'],
    modules: [
      {options.context} // If specified
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common')
  ],
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },
  envs: {
    development: {
      devtool: 'cheap-eval-source-map',
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('development')
          }
        }),
        new webpack.optimize.CommonsChunkPlugin('common')
      ]
    },
    production: {
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production')
          }
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin('common'),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
      ]
    }
  }
}
```

[`webpack`](https://webpack.github.io/) options. This object is parsed by `config()` in [`gulp-task-helpers`](https://www.npmjs.com/package/gulp-task-helpers), so you can target specific `NODE_ENV` environments.

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

Maps to `useConcat` param in `config()` of [`gulp-task-helpers`](https://www.npmjs.com/package/gulp-task-helpers).

## Watching for Changes

You can pass a `--watch` or `--w` flag to the Gulp command to enable file watching, like so:

```
$ gulp scripts --watch
```

By default, files that were emitted as source files will be marked for watching and the task name assigned to this module will be executed whenever a file changes. To override this behavior see `watchOptions`.

## Disclaimer

This is an experimental project driven by internal requirements.
