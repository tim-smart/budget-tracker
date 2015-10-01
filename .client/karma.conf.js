'use strict';

module.exports = function(config) {
  config.set({

    files: [
      {pattern: 'specs/**/*-spec.js', watched: false, included: true, served: true}
    ],

    frameworks: ['browserify', 'jasmine'],
    browserify: {
      transform: [
        ['babelify', {loose: 'all'}],
        'pkgify',
        'partialify',
        // ['coverageify', {ignores: new RegExp(__dirname)}]
      ],
      debug: true
    },

    browsers: ['PhantomJS'],

    reporters: [
      'dots',
      // 'coverage'
    ],

    preprocessors: {
      'specs/**/*-spec.js': ['browserify']
    },

    coverageReporter: {
      type: 'text',
      dir: 'coverage/'
    },

    singleRun: true,
    autoWatch: false

  });
};
