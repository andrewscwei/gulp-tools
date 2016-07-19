const gulp = require('gulp');
const media = require('../');
const path = require('path');

media.init(gulp, {
  base: path.join(__dirname, 'app'),
  dest: path.join(__dirname, 'public')
});

gulp.task('default', ['media']);
