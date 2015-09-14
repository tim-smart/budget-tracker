import Vue from 'vue'
import slug from 'slug'

export default Vue.extend({
  name: 'categories',

  created() {
    this.$on('beforeSave', function(category) {
      category.slug = slug(category.name || '').toLowerCase()
    })
  },

  computed: {
    bySlug() {
      const hash = {}

      this.items.forEach(function(category) {
        if (!category.slug) {
          return
        }

        hash[category.slug] = category
      })

      return hash
    },

    totalQuota() {
      return this.items.reduce(function(prev, category) {
        return prev + (category.quota || 0)
      }, 0)
    },

    totalQuotaRemaining() {
      return this.totalQuota - this.$root.$.transactions.total
    },

    withTotals() {
      const transactions = this.$root.$.transactions.byCategoryId

      return this.items.map((category) => {
        const categoryTransactions = transactions[category.id] || []

        category.total = categoryTransactions
        .reduce(function(prev, category) {
          return prev - category.amount
        }, category.quota)

        return category
      })
    }
  }
})
