import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router()
export default router

// Components
import Home from './home'
import TransactionForm from './transaction-form'
import TransactionList from './transaction-list'
import CategoryForm from './category-form'

router.map({
  '/': {
    component: Home
  },

  '/transactions': {
    component: TransactionList
  },

  '/transactions/:id': {
    component: TransactionForm
  },

  '/categories/:slug': {
    name: 'category',
    component: CategoryForm
  }
})
