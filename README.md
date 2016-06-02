# gulp-task-documents [![Circle CI](https://circleci.com/gh/VARIANTE/gulp-task-documents/tree/master.svg?style=svg)](https://circleci.com/gh/VARIANTE/gulp-task-documents/tree/master) [![npm version](https://badge.fury.io/js/gulp-task-documents.svg)](https://badge.fury.io/js/gulp-task-documents)

Gulp task for processing documents with the option to watch the emitted source files for changes.

## Usage

```js
import gulp from 'gulp';
import documents from 'gulp-task-documents';

gulp.task('documents', documents(options));
```

```
$ gulp documents
```

## API

### `documents(options)`

#### `options`

Type: `Object`<br>
Default: `{ src: '**/*' }`

Options that define the behavior of this task. You can override options for specific `NODE_ENV` environments by putting the same option inside `options.envs.{NODE_ENV}`. For example:

```js
{
  src: '**/*',
  envs: {
    production: {
      src: 'foo/**/*'
    }
  }
}
```

...would give you the following when `NODE_ENV` is `production`:

```js
{
  src: 'foo/**/*'
}
```

When `NODE_ENV` is blank, `production` environment is assumed.


##### `options.base` (required)

Type: `string`

Base path for the source files to emit into the stream.

##### `options.src`

Type: `string` or `Array`<br>
Default: `**/*`

Glob or an array of globs that matches files to emit. These globs are all relative to `options.base`.

##### `options.dest` (required)

Type: `string`

Path of destination directory to write files to.

##### `options.watch`

Type: `string`, `Function` or `Array`<br>
Default: Current task name

Task(s) or methods to invoke whenever watched files have changed. This array is applied to [`run-sequence`](https://www.npmjs.com/package/run-sequence). Defaults to the current task name.

## Watching for Changes

You can pass a `--watch` or `--w` flag to the Gulp command to enable file watching, like so:

```
$ gulp documents --watch
```

Files that were emitted as source files will be marked for watching, and by default the task name assigned to this module will be executed whenever a file changes. To override this behavior use `options.watch`.

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
