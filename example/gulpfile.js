
const gulp = require('gulp');
const path = require('path');
const webpack = require('../');

gulp.task('default', webpack({
  context: path.join(__dirname, 'app'),
  entry: {
    main: 'main.js'
  },
  resolve: {
    modules: [
      path.join(__dirname, '../', 'node_modules')
    ]
  },
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: ''
  }
}));