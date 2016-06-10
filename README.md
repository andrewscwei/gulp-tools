# gulp-pipe-media [![Circle CI](https://circleci.com/gh/VARIANTE/gulp-pipe-media/tree/master.svg?style=svg)](https://circleci.com/gh/VARIANTE/gulp-pipe-media/tree/master) [![npm version](https://badge.fury.io/js/gulp-pipe-media.svg)](https://badge.fury.io/js/gulp-pipe-media)

Gulp pipeline for media tasks (i.e. images, videos, fonts and documents). This pipeline creates the following Gulp tasks:

1. `images` - [`gulp-task-images`](https://www.npmjs.com/package/gulp-task-images)
2. `videos` - [`gulp-task-videos`](https://www.npmjs.com/package/gulp-task-videos)
3. `fonts` - [`gulp-task-fonts`](https://www.npmjs.com/package/gulp-task-fonts)
4. `documents` - [`gulp-task-documents`](https://www.npmjs.com/package/gulp-task-documents)
5. `media` - Sequence of the above tasks.

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

Options that define the behavior of this pipeline's tasks. This object is parsed by `config()` in [`gulp-task-helpers`](https://www.npmjs.com/package/gulp-task-helpers), so you can target specific `NODE_ENV` environments.

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

Maps to `useConcat` param in `config()` of [`gulp-task-helpers`](https://www.npmjs.com/package/gulp-task-helpers).

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
