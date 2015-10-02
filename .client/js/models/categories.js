import Vue from 'vue'
import slug from 'slug'

export default Vue.extend({
  name: 'categories',
  collection: 'Categories',

  created() {
    this.$on('beforeSave', function(category) {
      category.slug = slug(category.name || '').toLowerCase()
      category.quota = category.quota ? +category.quota : 0
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

    sorted() {
      return this.items.sort(function(a, b) {
        return a.name.localeCompare(b.name)
      })
    },

    selectOptions() {
      return this.items.map(function(category) {
        return {
          text: category.name,
          value: category._id
        }
      })
    }
  }
})
