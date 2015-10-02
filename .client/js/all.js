import Vue from 'vue'
import Sync from './vue-sync.js'
import App from './app'

import router from './router.js'
import './filters.js'

Vue.config.debug = true

Vue.use(Sync)

window.router = router

document.addEventListener('DOMContentLoaded', function() {
  router.start(App, '#budget-app')
})
