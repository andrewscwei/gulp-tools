# gulp-pipe-media ![](https://img.shields.io/maintenance/no/2017)

Gulp pipeline for media tasks (i.e. images, videos, fonts, documents and extras) with built-in support for watching files for changes. This pipeline creates the following Gulp tasks:

1. `images` - Processes image files, defaults to the following file extensions: `['jpg', 'jpeg', 'gif', 'png', 'svg', 'ico', 'tiff', 'bmp']`
2. `videos` - Processes video files, defaults to the following file extensions: `['mov', 'avi', 'ogg', 'ogv', 'webm', 'flv', 'swf', 'mp4', 'mv4']`
3. `fonts` - Processes font files, defaults to the following file extensions: `['eot', 'svg', 'ttf', 'woff', 'woff2']`
4. `documents` - Processes document files, defaults to the following file extensions: `['md', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'csv', 'rtf']`
5. `extras` - Processes miscellaneous files, no file extension restrictions
6. `media` - Sequence of the above tasks

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

## Example

```sh
$ npm run example
```

## API

### `init(gulp, options[, extendsDefaults])`

#### `gulp`

Type: `Object`

Gulp instance.

#### `options`

Type: `Object`<br>
Default:
```js
{
  base: undefined,
  dest: undefined,
  watch: undefined,
  images: {
    src: 'images/**/*',
    dest: `${options.dest}/assets`
  },
  videos: {
    src: 'videos/**/*',
    dest: `${options.dest}/assets`
  },
  fonts: {
    src: 'fonts/**/*',
    dest: `${options.dest}/assets`
  },
  documents: {
    src: 'documents/**/*',
    dest: `${options.dest}/assets`
  },
  extras: {
    src: '*'
  }
}
```

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

Type: `Object` or `boolean`<br>
Default:
```js
{
  base: undefined,
  src: 'images/**/*',
  dest: `${options.dest}/assets`,
  watch: {
    files: Emitted files
    tasks: Current task name
  },
  envs: {
    development: {
      imagemin: false
    }
  }
}
```

Options for the `images` task. Set this to `false` to disable this task.

###### `options.images.base`

Type: `string`<br>
Default: `undefined`

If specified, this is the base path for the source files to emit into the stream. Patterns defined in `options.images.src` will be prefixed by this path.

###### `options.images.src`

Type: `string` or `string[]`<br>
Default: `undefined`

Glob pattern(s), relative to `options.images.base` if specified, that specifies what files to emit into the Gulp stream. These patterns are automatically appended with a wildcard glob of affected file extensions unless custom extensions are specified in the patterns.

###### `options.images.dest`

Type: `string`<br>
Default: `undefined`

Path of destination directory to write files to.

###### `options.images.imagemin`

Type: `Object`<br>
Default: `false` when `NODE_ENV=development`, `undefined` otherwise 

Options for [`gulp-imagemin`](https://www.npmjs.com/package/gulp-imagemin) package. If set to `false`, `gulp-imagemin` will be skipped. Use `options.images.imagemin.plugins` and `options.images.imagemin.options.images`.

###### `options.images.watch`

Type: `Object` or `boolean`

Options that define the file watching behavior. If set to `false`, watching will be disabled regardless of the `--watch` flag.

###### `options.images.watch.files`

Type: `string` or `string[]`<br>
Default: Emitted source files

Glob pattern(s) that matches the files to be watched. Defaults to the emitted source file patterns computed from `options.images.base` and `options.images.src`.

###### `options.images.watch.tasks`

Type: `string`, `Function` or `Array`<br>
Default: Current task name

Task(s) or methods to invoke whenever watched files have changed. This array is applied to [`run-sequence`](https://www.npmjs.com/package/run-sequence). Defaults to the current task name.

##### `options.videos`

Type: `Object` or `boolean`<br>
Default:
```js
{
  base: undefined,
  src: 'videos/**/*',
  dest: `${options.dest}/assets`,
  watch: {
    files: Emitted files
    tasks: Current task name
  }
}
```

Options for the `videos` task. Set this to `false` to disable this task.

###### `options.videos.base`

Type: `string`<br>
Default: `undefined`

If specified, this is the base path for the source files to emit into the stream. Patterns defined in `options.videos.src` will be prefixed by this path.

###### `options.videos.src`

Type: `string` or `string[]`<br>
Default: `undefined`

Glob pattern(s), relative to `options.videos.base` if specified, that specifies what files to emit into the Gulp stream. These patterns are automatically appended with a wildcard glob of affected file extensions unless custom extensions are specified in the patterns.

###### `options.videos.dest`

Type: `string`<br>
Default: `undefined`

Path of destination directory to write files to.

###### `options.videos.watch`

Type: `Object` or `boolean`

Options that define the file watching behavior. If set to `false`, watching will be disabled regardless of the `--watch` flag.

###### `options.videos.watch.files`

Type: `string` or `string[]`<br>
Default: Emitted source files

Glob pattern(s) that matches the files to be watched. Defaults to the emitted source file patterns computed from `options.videos.base` and `options.videos.src`.

###### `options.videos.watch.tasks`

Type: `string`, `Function` or `Array`<br>
Default: Current task name

Task(s) or methods to invoke whenever watched files have changed. This array is applied to [`run-sequence`](https://www.npmjs.com/package/run-sequence). Defaults to the current task name.

##### `options.fonts`

Type: `Object` or `boolean`<br>
Default:
```js
{
  base: undefined,
  src: 'fonts/**/*',
  dest: `${options.dest}/assets`,
  watch: {
    files: Emitted files
    tasks: Current task name
  }
}
```

Options for the `fonts` task. Set this to `false` to disable this task.

###### `options.fonts.base`

Type: `string`<br>
Default: `undefined`

If specified, this is the base path for the source files to emit into the stream. Patterns defined in `options.fonts.src` will be prefixed by this path.

###### `options.fonts.src`

Type: `string` or `string[]`<br>
Default: `undefined`

Glob pattern(s), relative to `options.fonts.base` if specified, that specifies what files to emit into the Gulp stream. These patterns are automatically appended with a wildcard glob of affected file extensions unless custom extensions are specified in the patterns.

###### `options.fonts.dest`

Type: `string`<br>
Default: `undefined`

Path of destination directory to write files to.

###### `options.fonts.watch`

Type: `Object` or `boolean`

Options that define the file watching behavior. If set to `false`, watching will be disabled regardless of the `--watch` flag.

###### `options.fonts.watch.files`

Type: `string` or `string[]`<br>
Default: Emitted source files

Glob pattern(s) that matches the files to be watched. Defaults to the emitted source file patterns computed from `options.fonts.base` and `options.fonts.src`.

###### `options.fonts.watch.tasks`

Type: `string`, `Function` or `Array`<br>
Default: Current task name

Task(s) or methods to invoke whenever watched files have changed. This array is applied to [`run-sequence`](https://www.npmjs.com/package/run-sequence). Defaults to the current task name.

##### `options.documents`

Type: `Object` or `boolean`<br>
Default:
```js
{
  base: undefined,
  src: 'documents/**/*',
  dest: `${options.dest}/assets`,
  watch: {
    files: Emitted files
    tasks: Current task name
  }
}
```

Options for the `documents` task. Set this to `false` to disable this task.

###### `options.documents.base`

Type: `string`<br>
Default: `undefined`

If specified, this is the base path for the source files to emit into the stream. Patterns defined in `options.documents.src` will be prefixed by this path.

###### `options.documents.src`

Type: `string` or `string[]`<br>
Default: `undefined`

Glob pattern(s), relative to `options.documents.base` if specified, that specifies what files to emit into the Gulp stream. These patterns are automatically appended with a wildcard glob of affected file extensions unless custom extensions are specified in the patterns.

###### `options.documents.dest`

Type: `string`<br>
Default: `undefined`

Path of destination directory to write files to.

###### `options.documents.watch`

Type: `Object` or `boolean`

Options that define the file watching behavior. If set to `false`, watching will be disabled regardless of the `--watch` flag.

###### `options.documents.watch.files`

Type: `string` or `string[]`<br>
Default: Emitted source files

Glob pattern(s) that matches the files to be watched. Defaults to the emitted source file patterns computed from `options.documents.base` and `options.documents.src`.

###### `options.documents.watch.tasks`

Type: `string`, `Function` or `Array`<br>
Default: Current task name

Task(s) or methods to invoke whenever watched files have changed. This array is applied to [`run-sequence`](https://www.npmjs.com/package/run-sequence). Defaults to the current task name.

##### `options.extras`

Type: `Object` or `boolean`<br>
Default:
```js
{
  base: undefined,
  src: '*',
  dest: `${options.dest}`,
  watch: {
    files: Emitted files
    tasks: Current task name
  }
}
```

Options for the `extras` task. Set this to `false` to disable this task.

#### `extendsDefaults`

Type: `boolean`<br>
Default: `true`

Maps to `useConcat` param in `config()` of [`gulp-task-helpers`](https://www.npmjs.com/package/gulp-task-helpers).

## Watching for Changes

You can pass a `--watch` or `--w` flag to the Gulp command to enable file watching, like so:

```
$ gulp media --watch
```

By default, files that were emitted as source files will be marked for watching and the task name assigned to each task will be executed whenever a corresponding file changes. To override this behavior see `options.watch` or individual `options.{task}.watch` config.

## Disclaimer

This is an experimental project driven by internal requirements.
