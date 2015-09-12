import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      categories: []
    }
  },

  created() {
  },

  components: {
    navbar: require('js/navbar')
  },

  template: require('./template.html')
})
