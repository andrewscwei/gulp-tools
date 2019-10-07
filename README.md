# gulp-task-browserify ![](https://img.shields.io/maintenance/no/2016)

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

## Example

Run the example using `$ npm run example` to see it in action.

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
  transforms: [{
    name: 'babelify',
    options: {
      presets: ['es2015']
    }
  }],
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

##### `options.transforms`

Type: `Array`<br>
Default:
```js
[{
  name: 'babelify',
  options: {
    presets: ['es2015']
  }
}]
```

Array of transforms to apply to the bundler. Transforms are represented by an object containing the `name` key and the `options` key.

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

## Disclaimer

This is an experimental project driven by internal requirements.
