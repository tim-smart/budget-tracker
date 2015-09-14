import Vue from 'vue'
import App from './app'

import router from './router.js'
import './filters.js'

Vue.config.debug = true

router.start(App, '#budget-app')

window.router = router
