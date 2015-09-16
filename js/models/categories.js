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
      const withTotals = this.withTotals

      function adjust(key, totalDeficit) {
        const quota = withTotals.reduce(function(prev, category) {
          return prev + (category[key] > 0 ? +category.quota : 0)
        }, 0)

        let readjust = 0
        withTotals.map(function(category) {
          if (category[key] > 0) {
            const toRemove = (category.quota / quota) * totalDeficit
            category.remaining = Math.round(
              (category[key] - toRemove) * 100
            ) / 100
          } else {
            category.remaining = 0
          }

          if (category.remaining < 0) {
            readjust += -(category.remaining)
          }

          return category
        })

        if (readjust) {
          return adjust('remaining', readjust)
        }

        return withTotals
      }

      return adjust('total', this.totalDeficit)
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
