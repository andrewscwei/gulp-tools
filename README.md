# gulp-pipe-metalprismic [![Circle CI](https://circleci.com/gh/andrewscwei/gulp-pipe-metalprismic/tree/master.svg?style=svg)](https://circleci.com/gh/andrewscwei/gulp-pipe-metalprismic/tree/master) [![npm version](https://badge.fury.io/js/gulp-pipe-metalprismic.svg)](https://badge.fury.io/js/gulp-pipe-metalprismic)

Gulp pipeline for processing templates content managed by Prismic.io. This pipeline generates a single task, `views`, which does two things:

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

Options that define the behavior of this task. This object is parsed by `config()` in [`gulp-task-helpers`](https://www.npmjs.com/package/gulp-task-helpers), so you can target specific `NODE_ENV` environments.

This object extends that of the configurables in [`gulp-task-metalsmith`](https://www.npmjs.com/package/gulp-task-metalsmith). The following are the extended properties of the object.

##### `options.apiEndpoint`

Type: `string`<br>
Default: `undefined`

The API endpoint of the Prismic repo.

##### `options.accessToken`

Type: `string`<br>
Default: `undefined`

The access token of the Prismic repo.

#### `extendsDefaults`

Type: `boolean`<br>
Default: `true`

Maps to `useConcat` param in `config()` of [`gulp-task-helpers`](https://www.npmjs.com/package/gulp-task-helpers).

## Disclaimer

This is an experimental project driven by internal requirements.

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
