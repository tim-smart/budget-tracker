'use strict';

var gulp = require('gulp');
// var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');

// CSS
gulp.task('css', function() {
  return gulp.src('scss/*.scss')
  // .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
  // .pipe(sourcemaps.write())
  .pipe(gulp.dest('../public/css'))
  .pipe(livereload())
  .pipe(minify())
  .pipe(rename(function(path) {
    path.extname = '.min.css';
  }))
  .pipe(gulp.dest('../public/css'));
});
