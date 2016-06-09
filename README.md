# gulp-pipe-metalprismic [![Circle CI](https://circleci.com/gh/VARIANTE/gulp-pipe-metalprismic/tree/master.svg?style=svg)](https://circleci.com/gh/VARIANTE/gulp-pipe-metalprismic/tree/master) [![npm version](https://badge.fury.io/js/gulp-pipe-metalprismic.svg)](https://badge.fury.io/js/gulp-pipe-metalprismic)

Gulp pipeline for processing templates content managed by Prismic.io. This pipeline  generates a single task, `views`, which does two things:

1. Fetches and processes documents from the Prismic repo so the resulting data can be made useful to the templates
2. Generates static views using Metalsmith.

## Usage

```js
import gulp from 'gulp';
import metalprismic from 'gulp-pipe-metalprismic';

metalprismic.init(gulp, {
  src: 'app/views',
  dest: 'dest',
  apiEndpoint: process.env.PRISMIC_API_ENDPOINT,
  accessToken: process.env.PRISMIC_ACCESS_TOKEN
});

```
$ gulp views
```

## API

### `init(gulp, options[, extendsDefaults])`

#### `gulp`

Type: `Object`

Gulp instance.

#### `options`

Type: `Object`

Options that define the behavior of this task. You can override options for specific `NODE_ENV` environments by putting the same option inside `options.envs.{NODE_ENV}`. For example:

```js
{
  src: '**/*',
  envs: {
    production: {
      src: 'foo/**/*'
    }
  }
}
```

...would give you the following when `NODE_ENV` is `production`:

```js
{
  src: 'foo/**/*'
}
```

When `NODE_ENV` is blank, `production` environment is assumed.

This object extends that of the configurables in [`gulp-task-metalsmith`](https://www.npmjs.com/package/gulp-task-metalsmith). The following are the extended properties of the object.

##### `options.apiEndpoint`

Type: `string`<br>
Default: `undefined`

The API endpoint of the Prismic repo.

##### `options.accessToken` (required)

Type: `string`<br>
Default: `undefined`

The access token of the Prismic repo.

#### `extendsDefaults`

Type: `boolean`<br>
Default: `true`

This module has a default config provided for you. When you pass in your own config via the `options` parameter, the module resolves your config with the default config by using `lodash`(https://lodash.com/)'s `merge` function, which doesn't concatenate array values. If `extendsDefaults` is set to `true`, array values will be concatenated.

## Watching for Changes

You can pass a `--watch` or `--w` flag to the Gulp command to enable file watching, like so:

```
$ gulp fonts --watch
```

By default, files that were emitted as source files will be marked for watching and the task name assigned to this module will be executed whenever a file changes. To override this behavior use `options.watch`.

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
