# `fonts.js`

Processes document files, defaults to the following file extensions: `['md', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'csv', 'rtf']`

## Usage

```js
import gulp from 'gulp';
import fonts from 'gulp-assets-pipeline/tasks/fonts';

gulp.task('fonts', fonts({
  src: 'app/fonts/**/*',
  dest: 'public/fonts'
}));
```

```
$ gulp fonts
```

## API

### `fonts(options[, extendsDefaults])`

#### `options`

Type: `Object`

Options that define the behavior of this task. This object is parsed by `config()` in [`task-helpers.js`](../helpers/task-helpers.md), so you can target specific `NODE_ENV` environments.

###### `options.base`

Type: `string`<br>
Default: `undefined`

If specified, this is the base path for the source files to emit into the stream. Patterns defined in `options.src` will be prefixed by this path.

###### `options.src`

Type: `string` or `string[]`<br>
Default: `undefined`

Glob pattern(s), relative to `options.base` if specified, that specifies what files to emit into the Gulp stream. These patterns are automatically appended with a wildcard glob of affected file extensions unless custom extensions are specified in the patterns.

###### `options.dest`

Type: `string`<br>
Default: `undefined`

Path of destination directory to write files to.

###### `options.watch`

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

Maps to `useConcat` param in `config()` of [`task-helpers.js`](../helpers/task-helpers.md).
