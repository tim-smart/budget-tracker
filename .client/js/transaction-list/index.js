import Vue from 'vue'

export default Vue.extend({
  name: 'transactions-list',

  props: {
    transactions: { },

    hideTitle: {
      type: Boolean,
      default: false
    },

    hideCategory: {
      type: Boolean,
      default: false
    }
  },

  created() {
  },

  template: require('./template.html')
})
