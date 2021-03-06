import Vue from 'vue'
import _assign from 'lodash.assign'

export default Vue.extend({
  name: 'category-form',

  data() {
    return {
      category: {
        name: '',
        quota: ''
      }
    }
  },

  created() {
    if (!this.$route) {
      return;
    }

    const categories = this.$root.$.categories
    const category = categories.find(this.$route.params.id)
    if (category) {
      _assign(this.category, category)
    }
  },

  methods: {
    save(event) {
      event.preventDefault()

      const categories = this.$root.$.categories
      const attributes = this.category

      if (attributes._id) {
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

      if (this.category._id) {
        if (
          !confirm(`Do you really want to delete this category?`)
        ) {
          return
        }
        categories.remove(this.category._id)
      }

      this.$route.router.go('/')
    }
  },

  components: {
    transactionList: require('js/transaction-list')
  },

  template: require('./template.html')
})
