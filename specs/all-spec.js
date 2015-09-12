'use strict';

var all = require('../js/all.js');

describe('all', function() {
  it('should export a as 123', function() {
    expect(all.a).toEqual(123);
  });
});
