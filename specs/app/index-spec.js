'use strict';

import App from 'js/app'
import Categories from 'js/models/categories'

describe('App', function() {

  const app = new App({
    el: document.createElement('div')
  });
  const transactions = app.$.transactions

  afterEach(function() {
    transactions.removeAll()
  })

  describe('child components', function() {

    it('includes categories', function() {
      expect(app.$.categories.constructor).toEqual(Categories)
    })

  })

})
