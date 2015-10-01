'use strict'

var gulp = require('gulp');
var mpath = require('path');
var Server = require('karma').Server;

/**
 * Run test once and exit
 */
gulp.task('test', function(done) {
  new Server({
    configFile: mpath.resolve(mpath.join(__dirname, '..', '..', '/karma.conf.js')),
    singleRun: true
  }, done).start();
});
