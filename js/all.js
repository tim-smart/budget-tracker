const bb = require('backbone')
bb.LocalStorage = require('backbone.localstorage')

const App = require('./app')

window.app = new App({
  el: '#budget-app'
})
