import Vue from 'vue'
import _assign from 'lodash.assign'

export default Vue.extend({
  name: 'category-form',

  data() {
    return {
      category: {
        name: '',
        quota: 0
      }
    }
  },

  created() {
    if (!this.$route) {
      return;
    }

    const categories = this.$root.$.categories
    const category = categories.bySlug[this.$route.params.slug]
    if (category) {
      _assign(this.category, category)
    }
  },

  methods: {
    save(event) {
      event.preventDefault()

      const categories = this.$root.$.categories
      const attributes = this.category

      if (attributes.id) {
        categories.update(attributes)
      } else {
        categories.create(attributes)
      }

      this.$route.router.go('/')
    },

    cancel() {
      this.$route.router.go('/')
    },

    remove() {
      const categories = this.$root.$.categories

      if (
        this.category.id
      ) {
        if (
          !confirm(`Do you really want to delete this category?`)
        ) {
          return
        }
        categories.remove(this.category.id)
      }

      this.$route.router.go('/')
    }
  },

  components: {
    transactionList: require('js/transaction-list')
  },

  template: require('./template.html')
})
