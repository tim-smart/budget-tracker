import Vue from 'vue'

export default Vue.extend({
  name: 'transactions',

  computed: {
    byCategoryId: function() {
      const hash = {}

      for (let i = 0, len = this.items.length; i < len; i++) {
        let item = this.items[i]

        if (hash[item.categoryId]) {
          hash[item.categoryId].push(item)
        } else {
          hash[item.categoryId] = [item]
        }
      }

      return hash
    },

    total() {
      return this.items.reduce(function(prev, transaction) {
        return prev + transaction.amount
      }, 0)
    }
  }
})
