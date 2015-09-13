import Vue from 'vue'

export default Vue.extend({
  components: {
    categories: require('js/categories')
  },

  template: require('./template.html')
})
