'use strict';

var App = require('../../js/app/index.js');

describe('App', function() {
  it('sets #budget-app as the $el', function() {
    expect(App.el).toEqual('#budget-app');
  });
});
