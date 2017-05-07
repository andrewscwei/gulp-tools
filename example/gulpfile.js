
const gulp = require('gulp');
const sass = require('../');

gulp.task('default', sass({
  base: 'app',
  src: 'stylesheets/*',
  dest: 'public',
  sourcemaps: true
}));