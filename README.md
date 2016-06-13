# gulp-pipe-assets [![Circle CI](https://circleci.com/gh/andrewscwei/gulp-pipe-assets/tree/master.svg?style=svg)](https://circleci.com/gh/andrewscwei/gulp-pipe-assets/tree/master) [![npm version](https://badge.fury.io/js/gulp-pipe-assets.svg)](https://badge.fury.io/js/gulp-pipe-assets)

Gulp asset pipeline (i.e. images, videos, fonts, documents, stylesheets via Sass, JavaScripts via Webpack, etc). This pipeline creates the following Gulp tasks:

1. `images` - [`gulp-task-images`](https://www.npmjs.com/package/gulp-task-images)
2. `videos` - [`gulp-task-videos`](https://www.npmjs.com/package/gulp-task-videos)
3. `fonts` - [`gulp-task-fonts`](https://www.npmjs.com/package/gulp-task-fonts)
4. `documents` - [`gulp-task-documents`](https://www.npmjs.com/package/gulp-task-documents)
5. `extras` - [`gulp-task-extras`](https://www.npmjs.com/package/gulp-task-extras)
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
Default: 
```js
{ 
  src: 'images/**/*',
  dest: `${options.dest}/assets`
}
```

Options for [`gulp-task-images`](https://www.npmjs.com/package/gulp-task-images).

##### `options.videos`

Type: `Object`<br>
Default:
```js
{ 
  src: 'videos/**/*',
  dest: `${options.dest}/assets`
}
```

Options for [`gulp-task-videos`](https://www.npmjs.com/package/gulp-task-videos).

##### `options.fonts`

Type: `Object`<br>
Default:
```js
{ 
  src: 'fonts/**/*',
  dest: `${options.dest}/assets`
}
```

Options for [`gulp-task-fonts`](https://www.npmjs.com/package/gulp-task-fonts).

##### `options.documents`

Type: `Object`<br>
Default: 
```js
{ 
  src: 'documents/**/*',
  dest: `${options.dest}/assets`
}
```

Options for [`gulp-task-documents`](https://www.npmjs.com/package/gulp-task-documents).

##### `options.extras`

Type: `Object`<br>
Default: 
```js
{ 
  src: '*',
  dest: `${options.dest}`
}
```

Options for [`gulp-task-extras`](https://www.npmjs.com/package/gulp-task-extras).

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

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
