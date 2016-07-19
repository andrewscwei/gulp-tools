const gulp = require('gulp');
const assets = require('../');
const path = require('path');

assets.init(gulp, {
  base: path.join(__dirname, 'app'),
  dest: path.join(__dirname, 'public')
});

gulp.task('default', ['assets']);
