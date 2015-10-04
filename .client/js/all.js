import Vue from 'vue'

import router from './router.js'
import './filters.js'

window.router = router

router.start(require('./app'), '#budget-app')
