'use strict';

var App = require('js/app/index.js');

describe('App', function() {

  const app = new App();

  describe('data', function() {
    it('is an array', function() {
      expect(Array.isArray(app.categories)).toEqual(true)
    })

    describe('transactions', function() {
      it('transactionsCycle only shows last budget cycle', function() {
      })
    })
  })

})
