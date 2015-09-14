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
    save() {
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
    }
  },

  template: require('./template.html')
})
