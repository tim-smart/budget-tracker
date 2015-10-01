import Vue from 'vue'

export default Vue.extend({
  components: {
    categoryList: require('js/category-list')
  },

  methods: {
    reset() {
      if (!confirm('Do you really want to remove all your transactions?')) {
        return
      }

      this.$root.$.transactions.removeAll()
    }
  },

  template: require('./template.html')
})
