# gulp-task-browserify [![Circle CI](https://circleci.com/gh/VARIANTE/gulp-task-browserify/tree/master.svg?style=svg)](https://circleci.com/gh/VARIANTE/gulp-task-browserify/tree/master) [![npm version](https://badge.fury.io/js/gulp-task-browserify.svg)](https://badge.fury.io/js/gulp-task-browserify)

Gulp task for [Browserify](http://browserify.org/).

## Usage

```js
import gulp from 'gulp';
import browserSync from 'browser-sync';
import browserify from 'gulp-task-browserify';

gulp.task('scripts', browserify({
  src: 'app/scripts/*',
  dest: 'public',
  uglify: true,
  sourcemaps: true,
  watch: {
    callback: browserSync.reload
  }
}));
```

```
$ gulp scripts
```

## API

### `browserify(options[, extendsDefaults])`

Return: `Function`

#### `options`

Type: `Object`<br>
Default: 
```js
{
  base: undefined,
  src: undefined,
  dest: undefined,
  debug: true,
  uglify: false,
  sourcemaps: true,
  watch: {
    callback: undefined
  },
  transform: [
    babelify
  ],
  envs: {
    production: {
      debug: false,
      uglify: true,
      sourcemaps: false
    }
  }
};
```

This object is parsed by `config()` in [`gulp-task-helpers`](https://www.npmjs.com/package/gulp-task-helpers), so you can target specific `NODE_ENV` environments.

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

##### `options.debug`

Type: `boolean`<br>
Default: `true`, `false` when `NODE_ENV=production`

Specifies whether the bundler should operate in debug mode.

##### `options.uglify`

Type: `boolean`<br>
Default: `false`, `true` when `NODE_ENV=production`

Specifies whether bundled files should be uglified.

##### `options.sourcemaps`

Type: `boolean`<br>
Default: `true`, `false` when `NODE_ENV=production`

Specifies whether sourcemaps should be generated.

##### `options.transform`

Type: `Array`<br>
Default: `[babelify]`

Array of transforms to apply to the bundler.

##### `options.watch`

Type: `Object` or `boolean`

Options that define the file watching behavior. If set to `false`, watching will be disabled regardless of the `--watch` flag.

###### `options.watch.callback`

Type: `Function`<br>
Default: `undefined`

Method invoked whenever Browserify rebundles changed files.

#### `extendsDefaults`

Type: `boolean`<br>
Default: `true`

Maps to `useConcat` param in `config()` of [`gulp-task-helpers`](https://www.npmjs.com/package/gulp-task-helpers).

## Watching for Changes

You can pass a `--watch` or `--w` flag to the Gulp command to enable file watching, like so:

```
$ gulp scripts --watch
```

By default, files that were emitted as source files will be marked for watching and the task name assigned to this module will be executed whenever a file changes. To override this behavior see `options.watch`.

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
