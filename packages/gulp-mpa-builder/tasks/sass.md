# `sass.js`

Gulp task for processing Sass files with the option to watch the emitted source files for changes.

## Usage

```js
import gulp from 'gulp';
import sass from 'gulp-sys-assets/tasks/sass';

gulp.task('styles', sass({
  base: 'app',
  src: 'stylesheets/*',
  dest: 'public',
  sourcemaps: true
}));
```

```
$ gulp styles
```

## Example

Run `$ npm run example` to see it in action.

## API

### `sass(options[, extendsDefaults])`

#### `options`

Type: `Object`<br>
Default:
```js
{
  base: undefined,
  dest: undefined,
  src: undefined,
  watch: undefined,
  sass: undefined,
  autoprefixer: undefined,
  globbing: undefined,
  nano: false,
  purify: false,
  sourcemaps: true,
  envs: {
    production: {
      nano: {},
      sourcemaps: false
    }
  }
}
```

Options that define the behavior of this task. This object is parsed by `config()` in [`task-helpers.js`](../helpers/tasks-helpers.md), so you can target specific `NODE_ENV` environments.

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

##### `options.sass`

Type: `Object`<br>
Default:
```js
{
  includePaths: [
    {Directory of source files},
    {Directory of Node modules}
  ]
}
```

Options for [`gulp-sass`](https://www.npmjs.com/package/gulp-sass).

##### `options.autoprefixer`

Type: `Object`<br>
Default: `undefined`

Options for [`autoprefixer`](https://www.npmjs.com/package/autoprefixer).

##### `options.globbing`

Type: `Object`<br>
Default:
```js
{
  extensions: ['.sass', '.scss', '.css']
}
```

Options for [`gulp-css-globbing`](https://www.npmjs.com/package/gulp-css-globbing).

##### `options.nano`

Type: `Object`<br>
Default: `false`, `{}` in `production`

Options for [`cssnano`](https://www.npmjs.com/package/cssnano).

##### `options.purify`

Type: `Object`<br>
Default: `false`

Options for [`gulp-purifycss`](https://www.npmjs.com/package/gulp-purifycss).

##### `options.sourcemaps`

Type: `boolean`<br>
Default: `true`, `false` when `NODE_ENV=production`

Specifies whether sourcemaps are enabled.

#### `extendsDefaults`

Type: `boolean`<br>
Default: `true`

Maps to `useConcat` param in `config()` of [`task-helpers.js`](../helpers/task-helpers.md).

## Watching for Changes

You can pass a `--watch` or `--w` flag to the Gulp command to enable file watching, like so:

```
$ gulp styles --watch
```

By default, files that were emitted as source files will be marked for watching and the task name assigned to this module will be executed whenever a file changes. To override this behavior see `options.watch`.
