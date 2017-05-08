# gulp-pipe-metalcontentful [![Circle CI](https://circleci.com/gh/andrewscwei/gulp-pipe-metalcontentful/tree/master.svg?style=svg)](https://circleci.com/gh/andrewscwei/gulp-pipe-metalcontentful/tree/master) [![npm version](https://badge.fury.io/js/gulp-pipe-metalcontentful.svg)](https://badge.fury.io/js/gulp-pipe-metalcontentful)

Gulp pipeline for processing templates content managed by Contentful. This pipeline generates a single task, `views`, which does two things:

1. Fetches and processes entries from the Contentful repo so the resulting data can be made useful to the templates
2. Generates static views using Metalsmith.

## Usage

```js
import gulp from 'gulp';
import metalcontentful from 'gulp-pipe-metalcontentful';

metalcontentful.init(gulp, {
  src: 'app/views',
  dest: 'dest',
  contentful: {
    space: undefined,
    accessToken: undefined,
    host: undefined
  }
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

##### `options.contentful`

Type: `Object`<br>
Default: 
```
{
  space: undefined,
  accessToken: undefined,
  host: undefined
}
```

Details required to access Contentful repo. See [official package](https://www.npmjs.com/package/contentful).

#### `extendsDefaults`

Type: `boolean`<br>
Default: `true`

Maps to `useConcat` param in `config()` of [`gulp-task-helpers`](https://www.npmjs.com/package/gulp-task-helpers).

## Disclaimer

This is an experimental project driven by internal requirements.

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
