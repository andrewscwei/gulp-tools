# gulp-sys-metalprismic [![Circle CI](https://circleci.com/gh/VARIANTE/gulp-sys-metalprismic/tree/master.svg?style=svg)](https://circleci.com/gh/VARIANTE/gulp-sys-metalprismic/tree/master) [![npm version](https://badge.fury.io/js/gulp-sys-metalprismic.svg)](https://badge.fury.io/js/gulp-sys-metalprismic)

An end-to-end Gulp build system and asset pipeline for a webapp templated by Metalsmith and content-managed by Prismic.io. Generates the following Gulp tasks for you:

1. `clean` - Cleans the built files.
2. `views` - Generates Prismic-Metalsmith templates using [`gulp-pipe-metalprismic`](https://www.npmjs.com/package/gulp-pipe-metalprismic).
3. `images` - Processes images using [`gulp-task-images`](https://www.npmjs.com/package/gulp-task-images).
4. `videos` - Processes videos using [`gulp-task-videos`](https://www.npmjs.com/package/gulp-task-videos).
5. `fonts` - Processes fonts using [`gulp-task-fonts`](https://www.npmjs.com/package/gulp-task-fonts).
6. `documents` - Processes documents using [`gulp-task-documents`](https://www.npmjs.com/package/gulp-task-documents).
7. `extras` - Processes other miscellaneous files such as `robots.txt` and `sitemap.xml` using [`gulp-task-extras`](https://www.npmjs.com/package/gulp-task-extras).
8. `scripts` - Bundles JavaScripts using [`gulp-task-webpack`](https://www.npmjs.com/package/gulp-task-webpack).
9. `styles`, - Compiles preprocessed stylesheets using [`gulp-task-sass`](https://www.npmjs.com/package/gulp-task-sass).
10. `rev` - Revisions asset files by appending content hash to filenames and auto replaces old paths with fingerprinted paths in affected files. Uses [`gulp-task-rev`](https://www.npmjs.com/package/gulp-task-rev).
11. `serve` - Serves the app with [`browser-sync`](https://www.npmjs.com/package/browser-sync).
12. `default` - Executes the above tasks in sequence.

## Usage

```js
import gulp from 'gulp-sys-metalprismic';

gulp.init({
  src: 'app',
  dest: 'public',
  scripts: {
    entry: {
      application: './application.js'
    }
  },
  views: {
    i18n: {
      default: 'en',
      locales: ['en', 'fr'],
      directory: 'config/locales'
    },
    metadata {
      _: require('lodash'),
      moment: require('moment')
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

##### `options.views`

Type: `Object`<br>
Default:
```js
{
  apiEndpoint: process.env.PRISMIC_API_ENDPOINT,
  accessToken: process.env.PRISMIC_ACCESS_TOKEN
}
```

Options for [`gulp-pipe-metalprismic`](https://www.npmjs.com/package/gulp-pipe-metalprismic).

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

Options for [`gulp-task-images`](https://www.npmjs.com/package/gulp-task-images).

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

Options for [`gulp-task-videos`](https://www.npmjs.com/package/gulp-task-videos).

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

Options for [`gulp-task-fonts`](https://www.npmjs.com/package/gulp-task-fonts).

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

Options for [`gulp-task-documents`](https://www.npmjs.com/package/gulp-task-documents).

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

Options for [`gulp-task-extras`](https://www.npmjs.com/package/gulp-task-extras).

##### `options.scripts`

Type: `Object`<br>
Default: See [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets)

Options for [`gulp-task-webpack`](https://www.npmjs.com/package/gulp-task-webpack).

##### `options.styles`

Type: `Object`<br>
Default: See [`gulp-pipe-assets`](https://www.npmjs.com/package/gulp-pipe-assets)

Options for [`gulp-task-sass`](https://www.npmjs.com/package/gulp-task-sass).

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

Options for [`gulp-task-rev`](https://www.npmjs.com/package/gulp-task-rev).

##### `options.clean`

Type: `Array`<br>
Default:
```js
[
  `${options.dest}`, 
  `${options.base}/views/.prismic`
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
