# `views.js`

Gulp task for processing template files with Metalsmith plugins, option to watch source files for changes. Built-in plugins are executed in the following order:

1. [metalsmith-collections](https://www.npmjs.com/package/metalsmith-collections)
2. [metalsmith-related](https://www.npmjs.com/package/metalsmith-related)
3. [metalsmith-tags](https://www.npmjs.com/package/metalsmith-tags)
4. [metalsmith-pagination](https://www.npmjs.com/package/metalsmith-pagination)
5. [metalsmith-markdown](https://www.npmjs.com/package/metalsmith-markdown)
6. [metalsmith-layouts](https://www.npmjs.com/package/metalsmith-layouts)
7. [metalsmith-in-place](https://www.npmjs.com/package/metalsmith-in-place)
8. [metalsmith-permalinks](https://www.npmjs.com/package/metalsmith-permalinks)

This task also has built-in support for [i18n](https://www.npmjs.com/package/i18n), [Prism](http://prismjs.com/) and [MathJax](https://www.mathjax.org/).

## Usage

```js
import _ from 'lodash';
import browserSync from 'browser-sync';
import gulp from 'gulp';
import metalsmith from 'gulp-mpa-builder/tasks/metalsmith';
import moment from 'moment';
import path from 'path';

gulp.task('views', metalsmith({
  src: path.join(__dirname, 'app'),
  dest: path.join(__dirname, 'public'),
  metadata: {
    _: _,
    m: moment
  },
  multilingual: true,
  mathjax: true,
  prism: {
    showLanguage: false,
    lineNumbers: true
  },
  collections: {
    blog: {
      pattern: 'blog/**/*.md',
      sortBy: 'date',
      reverse: true,
      permalink: '/blog/:title/',
      layout: 'post',
      paginate: {
        perPage: 5,
        layout: 'page',
        path: 'blog/:num/',
        first: 'blog/'
      }
    }
  },
  tags: {
    path: 'blog/:tag',
    layout: 'page',
    sortBy: 'date',
    reverse: true,
    perPage: 2,
  },
  watch: {
    tasks: [browserSync.reload]
  }
}));
```

```
$ gulp views
```

## Example

```sh
$ npm run example
```

## API

### `metalsmith(options[, extendsDefaults])`

#### `options`

Type: `Object`

Options that define the behavior of this task. This object is parsed by `config()` in [`gulp-task-helpers`](https://www.npmjs.com/package/gulp-task-helpers), so you can target specific `NODE_ENV` environments.

##### `options.base`

Type: `string`<br>
Default: `undefined`

If specified, this is the base path for the source files to emit into the stream. Patterns defined in `options.src` will be relative to this path.

##### `options.src`

Type: `string``<br>
Default: `undefined`

Path of directory where Metalsmith should read files from, relative to `options.base` if specified.

##### `options.dest`

Type: `string`<br>
Default: `undefined`

Path of destination directory to write files to.

##### `options.ignore`

Type: `Array`<br>
Default: `['layouts', 'includes', '.DS_Store']`

Path(s) relative to `options.src` to ignore.

##### `options.watch`

Type: `Object` or `boolean`

Options that define the file watching behavior. If set to `false`, watching will be disabled regardless of the `--watch` flag.

###### `options.watch.files`

Type: `string` or `string[]`<br>
Default: Patterns computed from `options.base` and `options.src`

Glob pattern(s) that matches the files to be watched. Defaults to the patterns computed from `options.base` and `options.src`.

###### `options.watch.tasks`

Type: `string`, `Function` or `Array`<br>
Default: Current task name

Task(s) or methods to invoke whenever watched files have changed. This array is applied to [`run-sequence`](https://www.npmjs.com/package/run-sequence). Defaults to the current task name.

##### `options.multilingual`

Type: `Object`<br>
Default: `true`

Specifies whether templates should be generated in all supported locales.

##### `options.i18n`

Type: `Object`<br>
Default: `undefined`

Options for [`i18n`](https://www.npmjs.com/package/i18n).

##### `options.metadata`

Type: `Object`<br>
Default: `undefined`

Metadata for all templates.

##### `options.collections`

Type: `Object`<br>
Default: `undefined`

Options for [`metalsmith-collections`](https://www.npmjs.com/package/metalsmith-collections), with two additional keys: `permalink`—defines the permalink pattern for each individual collection, and `paginate`—options for [`metalsmith-pagination`](https://www.npmjs.com/package/metalsmith-pagination) for the current collection.

##### `options.tags`

Type: `Object`<br>
Default: `undefined`

Options for [`metalsmith-tags`](https://www.npmjs.com/package/metalsmith-tags).

##### `options.related`

Type: `Object`<br>
Default:
```
{
  terms: 5,
  max: 5,
  threshold: 0,
  pattern: undefined,
  text: (doc) => (doc.contents || doc.body || doc.markdown || doc.title || ((doc.tags instanceof Array) && doc.tags.join(', ')))
}
```

Options for [`metalsmith-related`](https://www.npmjs.com/package/metalsmith-related).

##### `options.markdown`

Type: `Object`<br>
Default: `undefined`

Options for [`metalsmith-markdown`](https://www.npmjs.com/package/metalsmith-markdown).

##### `options.layouts`

Type: `Object`<br>
Default:
```js
{
  engine: 'pug',
  directory: `${options.src}`/layouts`
}
```

Options for [`metalsmith-layouts`](https://www.npmjs.com/package/metalsmith-layouts). This object is automatically merged with `options.{engine_name}`, where `{engine_name}` is the value for `options.layouts.engine`.

##### `options.inPlace`

Type: `Object`<br>
Default:
```js
{
  engine: 'pug',
  rename: true
}
```

Options for [`metalsmith-in-place`](https://www.npmjs.com/package/metalsmith-in-place). This object is automatically merged with `options.{engine_name}`, where `{engine_name}` is the value for `options.inPlace.engine`.

##### `options.prism`

Type: `Object` or `boolean`<br>
Default: `false`

Custom options for Prism. See [prism-dom](https://www.npmjs.com/package/prism-dom). If `false`, Prism highlighting will be disabled altogether. If `true`, default options will be used.

##### `options.mathjax`

Type: `Object` or `boolean`<br>
Default: `false`

Options for [mathjax-dom](https://www.npmjs.com/package/mathjax-dom). If `false`, Prism highlighting will be disabled altogether. If `true`, default options will be used.

#### `extendsDefaults`

Type: `boolean`<br>
Default: `true`

Maps to `useConcat` param in `config()` of [`gulp-task-helpers`](https://www.npmjs.com/package/gulp-task-helpers).

## Watching for Changes

You can pass a `--watch` or `--w` flag to the Gulp command to enable file watching, like so:

```
$ gulp views --watch
```

By default, files that were emitted as source files will be marked for watching and the task name assigned to this module will be executed whenever a file changes. To override this behavior see `options.watch`.
