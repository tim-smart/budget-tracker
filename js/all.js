import Vue from 'vue'
import Router from 'vue-router'

import App from './app'
import Home from './home'

Vue.use(Router)
const router = new Router()

router.map({
  '/': {
    component: Home
  }
})

router.start(App, '#budget-app')
