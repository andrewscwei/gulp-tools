# `rev.js`

Gulp task for performing static asset revisioning by appending content hash to filenames. Original paths in html/js/css files will be automatically replaced with the revisioned path. Option to add a prefix to revisioned paths (i.e. CDN host).

## Usage

```js
import gulp from 'gulp';
import rev from 'gulp-assets-pipeline/tasks/rev';

gulp.task('rev', rev({
  src: 'public',
  ignore: '**/favicon.{ico,png}'
}));
```

```
$ gulp rev
```

## API

### `rev(options[, extendsDefaults])`

#### `options`

Type: `Object`

Options that define the behavior of this task. This object is parsed by `config()` in [`task-helpers.js`](../helpers/task-helpers.md), so you can target specific `NODE_ENV` environments.

##### `options.src`

Type: `string`<br>
Default: `undefined`

Path to the directory that contains files that needs to be revisioned. If unspecified, this task is disabled. By default, the most common file extensions are used.

#### `options.manifestFile`

Type: `string`<br>
Default: `rev-manifest.json`

Name of the generated manifest file.

##### `options.ignore`

Type: `string` or `Array`<br>
Default: `**/favicon.{ico,png}`

Glob pattern(s) matching files to ignore for revisioning.

##### `options.replace`

Type: `string`<br>
Default: `undefined`

Path to the directory that contains files that might have the original file paths of the revisioned files. Only the directory path is needed. This module automatically scans for html/js/css files within the directory. Defaults to the same directory as `options.src`.

##### `options.publicPath`

Type: `string`<br>
Default: `/`

Public path to be prefixed to the revisioned file paths (i.e. CDN host).

#### `extendsDefaults`

Type: `boolean`<br>
Default: `true`

Maps to `useConcat` param in `config()` of [`task-helpers.js`](../helpers/task-helpers.md).
