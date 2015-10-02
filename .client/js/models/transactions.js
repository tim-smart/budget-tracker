import Vue from 'vue'

function transactionsCategoryTotal(transactions, category) {
  return transactions.reduce(function(prev, transaction) {
    if (transaction.categoryId !== category._id) {
      return prev
    }

    return prev + transaction.amount
  }, 0)
}
Vue.filter('transactionsCategoryTotal', transactionsCategoryTotal)



function transactionsTotal(transactions, category) {
  const quota = category.quota || 0
  return +quota - transactions.reduce(function(prev, transaction) {
    return prev + transaction.amount
  }, 0)
}
Vue.filter('transactionsTotal', transactionsTotal)



export default Vue.extend({
  name: 'transactions',
  collection: 'Transactions',

  created() {
    this.$on('beforeSave', function(category) {
      category.amount = category.amount ? +category.amount : 0
    })
  },

  computed: {
    byCategoryId: function() {
      const hash = {}
      const categories = this.$root.$.categories.items

      categories.items.forEach(function(category) {
        hash[category._id] = []
      })

      for (let i = 0, len = this.items.length; i < len; i++) {
        let item = this.items[i]
        if (!hash[item.categoryId]) {
          continue
        }
        hash[item.categoryId].push(item)
      }

      return hash
    },

    total() {
      return this.items.reduce(function(prev, transaction) {
        return prev + (+transaction.amount)
      }, 0)
    },

    totalsByCategoryId() {
      const hash = {}
      const byCategoryId = this.byCategoryId

      this.$root.$.categories.items.forEach(function(category) {
        hash[category._id] = transactionsTotal(byCategoryId[category._id], category)
      })

      return hash
    }
  }
})
