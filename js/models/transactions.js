import Vue from 'vue'

export default Vue.extend({
  name: 'transactions',

  computed: {
    byCategoryId: function() {
      const hash = {}

      this.$root.$.categories.items.forEach(function(category) {
        hash[category.id] = []
      })

      for (let i = 0, len = this.items.length; i < len; i++) {
        let item = this.items[i]
        hash[item.categoryId].push(item)
      }

      return hash
    },

    total() {
      return this.items.reduce(function(prev, transaction) {
        return prev + (+transaction.amount)
      }, 0)
    }
  }
})
