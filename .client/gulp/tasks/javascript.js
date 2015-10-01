'use strict';

var gulp = require('gulp');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash').assign;
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');

// add custom browserify options here
var customOpts = {
  entries: ['./js/all.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);

function buildBundle(watch) {
  var b = browserify(opts);

  b.transform(require('babelify').configure({
    loose: 'all'
  }));
  b.transform(require('pkgify'));
  b.transform(require('partialify'));
  b.ignore('unicode/category/So')

  if (watch) {
    b = watchify(b);
    b.on('update', bundle(b, true));
    b.on('log', gutil.log);
    b.bundle().on('data', function() {});
  }

  return b;
}
module.exports = buildBundle;

function bundle(b, watch) {
  if (!b) {
    b = buildBundle();
  }

  return function() {
    var ret = b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('all.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('../client/js'));

    if (watch) {
      ret = ret.pipe(livereload());
    }

    b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('all.min.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('../client/js'));

    return ret;
  }
}

gulp.task('javascript', bundle());
