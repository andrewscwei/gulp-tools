const gulp = require(`../`);
const path = require(`path`);

gulp.init({
  base: path.join(__dirname, `app`),
  dest: path.join(__dirname, `public`),
  scripts: {
    entry: {
      application: `./application.js`
    }
  }
});
