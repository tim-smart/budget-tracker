'use strict';

var gulp = require('gulp');
var livereload = require('gulp-livereload');
var watch = require('gulp-watch');
var mpath = require('path');
var Server = require('karma').Server;

// Server and livereload
gulp.task('watch', function() {
  livereload.listen();

  // browserify
  require('./javascript.js')(true);

  // css
  watch('scss/**/*', {read: false}, function() {
    gulp.start('css');
  });

  // karma
  new Server({
    configFile: mpath.resolve(mpath.join(__dirname, '..', '..', '/karma.conf.js')),
    singleRun: false,
    autoWatch: true
  }).start();
});
