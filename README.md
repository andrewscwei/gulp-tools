# gulp-task-images [![Circle CI](https://circleci.com/gh/andrewscwei/gulp-task-images/tree/master.svg?style=svg)](https://circleci.com/gh/andrewscwei/gulp-task-images/tree/master) [![npm version](https://badge.fury.io/js/gulp-task-images.svg)](https://badge.fury.io/js/gulp-task-images)

## DEPRECATED, USE [`gulp-pipe-media`](https://www.npmjs.com/package/gulp-pipe-media) INSTEAD

Gulp task for processing images with built-in support for watching emitted source files for changes. This task supports the following plugins:

1. [`gulp-imagemin`](https://www.npmjs.com/package/gulp-imagemin)

## Usage

```js
import gulp from 'gulp';
import images from 'gulp-task-images';

gulp.task('images', images({
  base: 'app',
  src: 'images/**/*',
  dest: 'public',
  imagemin: false
}));
```

```
$ gulp images
```

## API

### `images(options[, extendsDefaults])`

Return: `Function`

#### `options`

Type: `Object`<br>
Default: 
```js
{
  base: undefined,
  dest: undefined,
  src: undefined,
  watch: {
    files: {Emitted files}
    tasks: {Current task name}
  },
  envs: {
    development: {
      imagemin: false
    }
  }
}
```

Options that define the behavior of this task. This object is parsed by `config()` in [`gulp-task-helpers`](https://www.npmjs.com/package/gulp-task-helpers), so you can target specific `NODE_ENV` environments.

##### `options.base`

Type: `string`<br>
Default: `undefined`

If specified, this is the base path for the source files to emit into the stream. Patterns defined in `options.src` will be prefixed by this path.

##### `options.src`

Type: `string` or `string[]`<br>
Default: `undefined`

Glob pattern(s), relative to `options.base` if specified, that specifies what files to emit into the Gulp stream. These patterns are automatically appended with a wildcard glob of affected file extensions unless custom extensions are specified in the patterns.

##### `options.dest`

Type: `string`<br>
Default: `undefined`

Path of destination directory to write files to.

##### `options.imagemin`

Type: `Object`<br>
Default: `false` when `NODE_ENV=development`, `undefined` otherwise 

Options for [`gulp-imagemin`](https://www.npmjs.com/package/gulp-imagemin) package. If set to `false`, `gulp-imagemin` will be skipped. Use `options.imagemin.plugins` and `options.imagemin.options`.

##### `options.watch`

Type: `Object` or `boolean`

Options that define the file watching behavior. If set to `false`, watching will be disabled regardless of the `--watch` flag.

###### `options.watch.files`

Type: `string` or `string[]`<br>
Default: Emitted source files

Glob pattern(s) that matches the files to be watched. Defaults to the emitted source file patterns computed from `options.base` and `options.src`.

###### `options.watch.tasks`

Type: `string`, `Function` or `Array`<br>
Default: Current task name

Task(s) or methods to invoke whenever watched files have changed. This array is applied to [`run-sequence`](https://www.npmjs.com/package/run-sequence). Defaults to the current task name.

#### `extendsDefaults`

Type: `boolean`<br>
Default: `true`

Maps to `useConcat` param in `config()` of [`gulp-task-helpers`](https://www.npmjs.com/package/gulp-task-helpers).

## Watching for Changes

You can pass a `--watch` or `--w` flag to the Gulp command to enable file watching, like so:

```
$ gulp images --watch
```

By default, files that were emitted as source files will be marked for watching and the task name assigned to this module will be executed whenever a file changes. To override this behavior see `options.watch`.
