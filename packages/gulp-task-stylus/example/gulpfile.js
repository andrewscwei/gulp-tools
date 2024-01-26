
const gulp = require(`gulp`);
const stylus = require(`../`);

gulp.task(`default`, stylus({
  base: `app`,
  src: `stylesheets/*`,
  dest: `public`,
  sourcemaps: true
}));