# gulp-contentful-mpa-builder [![Circle CI](https://circleci.com/gh/andrewscwei/gulp-contentful-mpa-builder/tree/master.svg?style=svg)](https://circleci.com/gh/andrewscwei/gulp-contentful-mpa-builder/tree/master) [![npm version](https://badge.fury.io/js/gulp-contentful-mpa-builder.svg)](https://badge.fury.io/js/gulp-contentful-mpa-builder)

An end-to-end Gulp build system and asset pipeline for a webapp templated by Metalsmith and content-managed by Contentful. Generates the following Gulp tasks for you:

1. `clean` - Cleans the built files.
2. `views` - Generates Metalsmith templates.
3. `images` - Processes images.
4. `videos` - Processes videos.
5. `fonts` - Processes fonts.
6. `documents` - Processes documents.
7. `extras` - Processes other miscellaneous files such as `robots.txt` and `sitemap.xml`.
8. `scripts` - Bundles JavaScripts.
9. `styles`, - Compiles Sass stylesheets.
10. `rev` - Revisions asset files by appending content hash to filenames and auto replaces old paths with fingerprinted paths in affected files.
11. `sitemap` - Creates `sitemap.xml` from all generated HTML files, based on [`gulp-sitemap`](https://www.npmjs.com/package/gulp-sitemap).
12. `serve` - Serves the app with [`browser-sync`](https://www.npmjs.com/package/browser-sync).
13. `default` - Executes the above tasks in sequence.

## Usage

```js
import gulp from 'gulp-contentful-mpa-builder';

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
  },
  sitemap: undefined
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

#### `options.apiEndpoint`

Type: string`<br>
Default:
```js
{
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  host: process.env.CONTENTFUL_HOST
}
```

Config object for Contentful.

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
  src: 'views'
}
```

Options for [`metalsmith.js`](./tasks/metalsmith.md).

##### `options.images`

Type: `Object`<br>
Default:
```js
{
  base: `${options.base}`,
  src: `images/**/*`,
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

Options for `images` task (see [`images.js`](./tasks/images.md)).

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

Options for `videos` task (see [`videos.js`](./tasks/videos.md)).

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

Options for `fonts` task (see [`fonts.js`](./tasks/fonts.md)).

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

Options for `documents` task (see [`documents.js`](./tasks/documents.md)).

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

Options for `extras` task (see [`extras.js`](./tasks/extras.md)).

##### `options.scripts`

Type: `Object`<br>
Default:
```js
{
  context: `${options.base}/javascripts`,
  output: {
    path: `${config.dest}/assets/javascripts`,
    publicPath: 'assets/javascripts'
  }
}
```

Options for `scripts` task from [`scripts.js`](./tasks/scripts.md).

##### `options.styles`

Type: `Object`<br>
Default:
```js
{
  src: 'stylesheets/*',
  dest: `${options.dest}/assets`,
  sass: {
    includePaths: [`${options.base}/stylesheets`]
  },
  watch: {
    files: `${options.base}/stylesheets/**/*`
  },
  envs: {
    production: {
      purify: `${options.dest}/**/*`
    }
  }
}
```

Options for `styles` task from [`styles.js`](./tasks/styles.md).

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

Options for `rev` task from [`rev.js`](./tasks/rev.md).

##### `options.sitemap`

Type: `Object`<br>
Default: `undefined`

Options for `sitemap` task based on [`gulp-sitemap`](https://www.npmjs.com/package/gulp-sitemap).

##### `options.clean`

Type: `Array`<br>
Default:
```js
[
  `${options.dest}`,
  `${options.base}/views/.contentful`
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

Maps to `useConcat` param in `config()` of [`task-helpers.js`](./helpers/task-helpers.md).

## Watching for Changes

You can pass a `--watch` or `--w` flag to the Gulp command to enable file watching, like so:

```
$ gulp --watch
```

By default, files that were emitted as source files will be marked for watching and the task name assigned to associated subtasks will be executed whenever a file changes. To override this behavior use the global `options.watch` or the individual `options.watch` for each subtask.

## Serving the App

You can pass a `--serve` or `--s` flag to the Gulp command to serve the app. When used in conjuction with the `--watch` flag, upon every file change `browserSync.reload` will be called.

## Disclaimer

This is an experimental project driven by internal requirements.
