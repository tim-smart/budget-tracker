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
        return prev + ((+category.quota) || 0)
      }, 0)
    },

    totalQuotaRemaining() {
      return this.totalQuota - this.$root.$.transactions.total
    },

    totalQuotaPercent() {
      return Math.floor(this.totalQuotaRemaining / this.totalQuota * 100)
    },

    withTotals() {
      const transactions = this.$root.$.transactions.byCategoryId

      return this.items.map((category) => {
        const categoryTransactions = transactions[category.id] || []

        category.total = categoryTransactions
        .reduce(function(prev, category) {
          return prev - (+category.amount)
        }, category.quota)

        return category
      })
    },

    totalDeficit() {
      return this.withTotals.reduce(function(prev, category) {
        return prev + (category.total < 0 ? -(category.total) : 0)
      }, 0)
    },

    withRemaining() {
      const totalDeficit = this.totalDeficit
      const withTotals = this.withTotals

      function adjust(key) {
        const quota = withTotals.reduce(function(prev, category) {
          return prev + (category[key] > 0 ? +category.quota : 0)
        }, 0)

        let readjust = false
        withTotals.map(function(category) {
          if (category[key] > 0) {
            const toRemove = Math.round((category.quota / quota) * totalDeficit * 100) / 100
            category.remaining = category[key] - toRemove
          } else {
            category.remaining = 0
          }

          if (category.remove < 0) {
            readjust = true
          }

          return category
        })

        if (readjust) {
          return adjust('remaining')
        }

        return withTotals
      }

      return adjust('total')
    },

    sorted() {
      return this.items.sort(function(a, b) {
        return a.name.localeCompare(b.name)
      })
    },

    selectOptions() {
      return this.sorted.map(function(category) {
        return {
          text: category.name,
          value: category.id
        }
      })
    }
  }
})
