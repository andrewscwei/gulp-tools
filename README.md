# gulp-pipe-assets [![Circle CI](https://circleci.com/gh/andrewscwei/gulp-pipe-assets/tree/master.svg?style=svg)](https://circleci.com/gh/andrewscwei/gulp-pipe-assets/tree/master) [![npm version](https://badge.fury.io/js/gulp-pipe-assets.svg)](https://badge.fury.io/js/gulp-pipe-assets)

Gulp asset pipeline (i.e. images, videos, fonts, documents, stylesheets via Sass, JavaScripts via Webpack, etc). This pipeline creates the following Gulp tasks:

1. `images` - `images` task from [`gulp-pipe-media`](https://www.npmjs.com/package/gulp-pipe-media)
2. `videos` - `videos` task from [`gulp-pipe-media`](https://www.npmjs.com/package/gulp-pipe-media)
3. `fonts` - `fonts` task from [`gulp-pipe-media`](https://www.npmjs.com/package/gulp-pipe-media)
4. `documents` - `documents` task from [`gulp-pipe-media`](https://www.npmjs.com/package/gulp-pipe-media)
5. `extras` - `extras` task from [`gulp-pipe-media`](https://www.npmjs.com/package/gulp-pipe-media)
6. `styles` - [`gulp-task-sass`](https://www.npmjs.com/package/gulp-task-sass)
7. `scripts` - [`gulp-task-webpack`](https://www.npmjs.com/package/gulp-task-webpack)
8. `rev` - [`gulp-task-rev`](https://www.npmjs.com/package/gulp-task-rev)
9. `assets` - Sequence of the above tasks in that order.

## Usage

```js
import gulp from 'gulp';
import assets from 'gulp-pipe-assets';

assets.init(gulp, {
  base: 'app',
  dest: 'public',
  scripts: {
    entry: {
      application: './application.js' 
    }
  }
});
```

```
$ gulp assets
```

## API

### `init(gulp, options[, extendsDefaults])`

#### `gulp`

Type: `Object`

Gulp instance.

#### `options`

Type: `Object`

Options that define the behavior of this task. This object is parsed by `config()` in [`gulp-task-helpers`](https://www.npmjs.com/package/gulp-task-helpers), so you can target specific `NODE_ENV` environments.

##### `options.base`

Type: `string`<br>
Default: `undefined`

The fallback base path for the individual tasks if a specific one is not provided.

##### `options.dest`

Type: `string`<br>
Default: `undefined`

The fallback destination path for the individual tasks if a specific one is not provided.

##### `options.watch`

Type: `Object` or `boolean`

Fallback watch options for the individual tasks if a specific one is not provided.

##### `options.images`

Type: `Object`<br>
Default: `undefined`

Options for `images` task from [`gulp-pipe-media`](https://www.npmjs.com/package/gulp-pipe-media).

##### `options.videos`

Type: `Object`<br>
Default: `undefined`

Options for `videos` task from [`gulp-pipe-media`](https://www.npmjs.com/package/gulp-pipe-media).

##### `options.fonts`

Type: `Object`<br>
Default: `undefined`

Options for `fonts` task from [`gulp-pipe-media`](https://www.npmjs.com/package/gulp-pipe-media).

##### `options.documents`

Type: `Object`<br>
Default: `undefined`

Options for `documents` task from [`gulp-pipe-media`](https://www.npmjs.com/package/gulp-pipe-media).

##### `options.extras`

Type: `Object`<br>
Default: `undefined`

Options for `extras` task from [`gulp-pipe-media`](https://www.npmjs.com/package/gulp-pipe-media).

##### `options.scripts`

Type: `Object`<br>
Default:
```js
{
  context: `${options.base}/javascripts`,
  output: {
    path: `${config.dest}/assets/javascripts`,
    publicPath: 'assets/javascripts'
  }
}
```

Options for [`gulp-task-webpack`](https://www.npmjs.com/package/gulp-task-webpack).

##### `options.styles`

Type: `Object`<br>
Default:
```js
{
  src: 'stylesheets/*',
  dest: `${options.dest}/assets`,
  sass: {
    includePaths: [`${options.base}/stylesheets`]
  },
  watch: {
    files: `${options.base}/stylesheets/**/*`
  },
  envs: {
    production: {
      purify: `${options.dest}/**/*`
    }
  }
}
```

Options for [`gulp-task-sass`](https://www.npmjs.com/package/gulp-task-sass).

##### `options.rev`

Type: `Object`<br>
Default:
```js
{
  envs: {
    production: {
      src: `${options.dest}`
    }
  }
}
```

Options for [`gulp-task-rev`](https://www.npmjs.com/package/gulp-task-rev).

#### `extendsDefaults`

Type: `boolean`<br>
Default: `true`

Maps to `useConcat` param in `config()` of [`gulp-task-helpers`](https://www.npmjs.com/package/gulp-task-helpers).

## Disclaimer

This is an experimental project driven by internal requirements.
