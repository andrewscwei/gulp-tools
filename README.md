# gulp-pipe-media [![Circle CI](https://circleci.com/gh/VARIANTE/gulp-pipe-media/tree/master.svg?style=svg)](https://circleci.com/gh/VARIANTE/gulp-pipe-media/tree/master) [![npm version](https://badge.fury.io/js/gulp-pipe-media.svg)](https://badge.fury.io/js/gulp-pipe-media)

Gulp pipeline for media tasks (i.e. images, videos, fonts and documents). This pipeline creates 5 Gulp tasks: 'images', 'videos', 'fonts', 'documents' and 'media'. This pipeline uses the following submodules to generate its tasks:

1. [`gulp-task-images`](https://www.npmjs.com/package/gulp-task-images)
2. [`gulp-task-videos`](https://www.npmjs.com/package/gulp-task-videos)
3. [`gulp-task-fonts`](https://www.npmjs.com/package/gulp-task-fonts)
4. [`gulp-task-documents`](https://www.npmjs.com/package/gulp-task-documents)

## Usage

```js
import gulp from 'gulp';
import media from 'gulp-pipe-media';

media.init(gulp, {
  base: 'app',
  dest: 'public'
});
```

```
$ gulp media
```

## API

### `init(gulp, options[, extendsDefaults])`

#### `gulp`

Type: `Object`

Gulp instance.

#### `options`

Type: `Object`

Options that define the behavior of this pipeline's tasks. You can override options for specific `NODE_ENV` environments by putting the same option inside `options.envs.{NODE_ENV}`. For example:

```js
{
  base: 'app'
  envs: {
    production: {
      base: 'public'
    }
  }
}
```

...would give you the following when `NODE_ENV` is `production`:

```js
{
  base: 'public'
}
```

When `NODE_ENV` is blank, `production` environment is assumed.

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
Default: `{ src: 'images/**/*' }`

Options for [`gulp-task-images`](https://www.npmjs.com/package/gulp-task-images).

##### `options.videos`

Type: `Object`<br>
Default: `{ src: 'videos/**/*' }`

Options for [`gulp-task-videos`](https://www.npmjs.com/package/gulp-task-videos).

##### `options.fonts`

Type: `Object`<br>
Default: `{ src: 'fonts/**/*' }`

Options for [`gulp-task-fonts`](https://www.npmjs.com/package/gulp-task-fonts).

##### `options.documents`

Type: `Object`<br>
Default: `{ src: 'documents/**/*' }`

Options for [`gulp-task-documents`](https://www.npmjs.com/package/gulp-task-documents).

#### `extendsDefaults`

Type: `boolean`<br>
Default: `true`

This module has a default config provided for you. When you pass in your own config via the `options` parameter, the module resolves your config with the default config by using `lodash`(https://lodash.com/)'s `merge` function, which doesn't concatenate array values. If `extendsDefaults` is set to `true`, array values will be concatenated.

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
