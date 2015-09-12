const bb = require('backbone')
bb.LocalStorage = require('backbone.localstorage')
require('backbone-validation')

const App = require('./app')

window.app = new App({
  el: '#budget-app'
})
