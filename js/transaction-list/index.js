import Vue from 'vue'

export default Vue.extend({
  name: 'transactions-list',

  props: {
    transactions: {
      type: Array
    },

    showTitle: {
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
