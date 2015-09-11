'use strict';

var gulp = require('gulp');
var livereload = require('gulp-livereload');
var watch = require('gulp-watch');

// Server and livereload
gulp.task('watch', function() {
  livereload.listen();

  // browserify
  require('./javascript.js')(true);

  // css
  watch('scss/**/*', {read: false}, function() {
    gulp.start('css');
  });

  // HTML
  watch('build/**/*.html', {read: false}).pipe(livereload());
});
