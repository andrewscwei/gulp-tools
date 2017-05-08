const browserSync = require('browser-sync');
const gulp = require('gulp');
const metalsmith = require('../');
const path = require('path');

gulp.task('views', metalsmith({
  src: path.join(__dirname, 'app'),
  dest: path.join(__dirname, 'public'),
  i18n: {
    locales: ['en', 'jp'],
    directory: path.join(__dirname, 'config', 'locales')
  },
  metadata: {
    _: require('lodash'),
    m: require('moment')
  },
  multilingual: true,
  mathjax: true,
  prism: {
    lineNumbers: true,
    showLanguage: true
  },
  related: {
    pattern: 'blog/**/*.md'
  },
  collections: {
    blog: {
      pattern: 'blog/**/*.md',
      sortBy: 'date',
      reverse: true,
      permalink: 'blog/:title/',
      layout: 'post',
      metadata: {
        prism: true,
        mathjax: false
      },
      paginate: {
        perPage: 5,
        layout: 'page',
        path: 'blog/:num/',
        first: 'blog/'
      }
    }
  },
  tags: {
    path: 'blog/:tag',
    layout: 'page',
    sortBy: 'date',
    reverse: true,
    perPage: 2,
  },
  watch: {
    tasks: [browserSync.reload]
  },
  sitemap: {
    hostname: 'http://www.example.com'
  }
}));

gulp.task('default', ['views'], function() {
  browserSync.init({
    server: { baseDir: path.join(__dirname, 'public') },
    open: false,
    notify: false
  });
});
