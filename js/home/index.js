import Vue from 'vue'

export default Vue.extend({
  components: {
    categoryList: require('js/category-list')
  },

  template: require('./template.html')
})
