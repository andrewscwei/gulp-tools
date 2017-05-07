
const gulp = require('gulp');
const browserify = require('../');

gulp.task('default', browserify({
  src: 'app/*',
  dest: 'public',
  uglify: true,
  sourcemaps: true
}));