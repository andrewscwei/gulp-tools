# gulp-sys-assets [![Circle CI](https://circleci.com/gh/andrewscwei/gulp-sys-assets/tree/master.svg?style=svg)](https://circleci.com/gh/andrewscwei/gulp-sys-assets/tree/master) [![npm version](https://badge.fury.io/js/gulp-sys-assets.svg)](https://badge.fury.io/js/gulp-sys-assets)

An end-to-end Gulp build system for assets. Generates the following Gulp tasks for you:

1. `clean` - Cleans the built files.
2. `images` - Processes images using [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets).
3. `videos` - Processes videos using [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets).
4. `fonts` - Processes fonts using [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets).
5. `documents` - Processes documents using [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets).
6. `extras` - Processes other miscellaneous files such as `robots.txt` and `sitemap.xml` using [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets).
7. `scripts` - Bundles JavaScripts using [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets).
8. `styles`, - Compiles preprocessed stylesheets using [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets).
9. `rev` - Revisions asset files by appending content hash to filenames and auto replaces old paths with fingerprinted paths in affected files. Uses [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets).
10. `serve` - Serves the app with [`browser-sync`](https://www.npmjs.com/package/browser-sync).
11. `default` - Executes the above tasks in sequence.

## Usage

```js
import gulp from 'gulp-sys-assets';

gulp.init({
  src: 'app',
  dest: 'public',
  scripts: {
    entry: {
      application: './application.js'
    }
  }
});
```

```
$ gulp
```

## API

### `init(options[, extendsDefaults])`

#### `options`

Type: `Object`

Options that define the behavior of this task. This object is parsed by `config()` in [`gulp-task-helpers`](https://www.npmjs.com/package/gulp-task-helpers), so you can target specific `NODE_ENV` environments.

##### `options.base` (required)

Type: `string`<br>
Default: `undefined`

Fallback base path for all the subtasks if one does not exist in their individual configs.

##### `options.dest` (required)

Type: `string`<br>
Default: `undefined`

Fallback destination path for all the subtasks if one does not exist in their individual configs.

##### `options.watch`

Type: `Object`<br>
Default:
```js
{
  tasks: [browserSync.reload]
}
```

Fallback watch config for all the subtasks if one does not exist in their individual configs. See the README of any of the sub packages to see what a watch config looks like.

##### `options.images`

Type: `Object`<br>
Default:
```js
{
  base: `${options.base}`,
  src: `images/**/*`,
  dest: `${options.dest}/assets`
}
``` 

Options for `images` task from [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets).

##### `options.videos`

Type: `Object`<br>
Default:
```js
{
  base: `${options.base}`,
  src: `videos/**/*`,
  dest: `${options.dest}/assets`
}
``` 

Options for `videos` task from [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets).

##### `options.fonts`

Type: `Object`<br>
Default:
```js
{
  base: `${options.base}`,
  src: `fonts/**/*`,
  dest: `${options.dest}/assets`
}
``` 

Options for `fonts` task from [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets).

##### `options.documents`

Type: `Object`<br>
Default:
```js
{
  base: `${options.base}`,
  src: `documents/**/*`,
  dest: `${options.dest}/assets`
}
``` 

Options for `documents` task from [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets).

##### `options.extras`

Type: `Object`<br>
Default:
```js
{
  base: `${options.base}`,
  src: `*`,
  dest: `${options.dest}`
}
``` 

Options for `extras` task from [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets).

##### `options.scripts`

Type: `Object`<br>
Default: See [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets)

Options for `scripts` task from [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets).

##### `options.styles`

Type: `Object`<br>
Default: See [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets)

Options for `styles` task from [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets).

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

Options for `rev` task from [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets).

##### `options.clean`

Type: `Array`<br>
Default:
```js
[
  `${options.dest}`
]
```

Path(s) to delete during the `clean` task.

##### `options.serve`

Type: `Object`<br>
Default:
```js
{
  server: {
    baseDir: `${options.dest}`,
  },
  files: false,
  notify: false,
  port: process.env.PORT || 3000,
  logLevel: 'info',
  open: false
}
```

Options for [`browser-sync`](https://www.npmjs.com/package/browser-sync). To serve the app include the `--serve` or `--s` flag when executing the default task.

#### `extendsDefaults`

Type: `boolean`<br>
Default: `true`

Maps to `useConcat` param in `config()` of [`gulp-task-helpers`](https://www.npmjs.com/package/gulp-task-helpers).

## Watching for Changes

You can pass a `--watch` or `--w` flag to the Gulp command to enable file watching, like so:

```
$ gulp --watch
```

By default, files that were emitted as source files will be marked for watching and the task name assigned to associated subtasks will be executed whenever a file changes. To override this behavior use the global `options.watch` or the individual `options.watch` for each subtask.

## Serving the App

You can pass a `--serve` or `--s` flag to the Gulp command to serve the app. When used in conjuction with the `--watch` flag, upon every file change `browserSync.reload` will be called.

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
