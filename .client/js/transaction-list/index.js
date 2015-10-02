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
    if (!this.transactions) {
      this.transactions = this.$root.$.transactions.items
    }
  },

  template: require('./template.html')
})
