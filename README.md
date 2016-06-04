# gulp-task-rev [![Circle CI](https://circleci.com/gh/VARIANTE/gulp-task-rev/tree/master.svg?style=svg)](https://circleci.com/gh/VARIANTE/gulp-task-rev/tree/master) [![npm version](https://badge.fury.io/js/gulp-task-rev.svg)](https://badge.fury.io/js/gulp-task-rev)

Gulp task for performing static asset revisioning by appending content hash to filenames. Original paths in html/js/css files will be automatically replaced with the revisioned path. Option to add a prefix to revisioned paths (i.e. CDN host).

## Usage

```js
import gulp from 'gulp';
import rev from 'gulp-task-rev';

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

Options that define the behavior of this task. You can override options for specific `NODE_ENV` environments by putting the same option inside `options.envs.{NODE_ENV}`. For example:

```js
{
  src: undefined, // This is default anyway
  envs: {
    production: {
      src: 'public'
    }
  }
}
```

...would give you the following when `NODE_ENV` is `production`:

```js
{
  src: 'public'
}
```

When `NODE_ENV` is blank, `production` environment is assumed.

##### `options.src`

Type: `string`<br>
Default: `undefined`

Path to the directory that contains files that needs to be revisioned. If unspecified, this task is disabled. By default, the most common file extensions are used.

##### `options.ignore`

Type: `string` or `Array`<br>
Default: `undefined`

Glob pattern(s) matching files to ignore for revisioning.

##### `options.replace`

Type: `string`<br>
Default: `undefined`

Path to the directory that contains files that might have the original file paths of the revisioned files. Only the directory path is needed. This module automatically scans for html/js/css files within the directory. Defaults to the same directory as `options.src`.

##### `options.prefix`

Type: `string`<br>
Default: `undefined`

Prefix to be added to the revisioned file paths (i.e. CDN host).

#### `extendsDefaults`

Type: `boolean`<br>
Default: `false`

This module has a default config provided for you. When you pass in your own config via the `options` parameter, the module resolves your config with the default config by using `lodash`(https://lodash.com/)'s `merge` function, which doesn't concatenate array values. If `extendsDefaults` is set to `true`, array values will be concatenated.

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
