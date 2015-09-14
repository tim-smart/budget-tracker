import Vue from 'vue'
import _assign from 'lodash.assign'

export default Vue.extend({
  name: 'transaction-form',

  data() {
    return {
      transaction: {
        description: '',
        amount: 0,
        categoryId: null
      }
    }
  },

  created() {
    if (!this.$route) {
      return;
    }

    const transactions = this.$root.$.transactions
    const transaction = transactions.find(this.$route.params.id)
    const categories = this.$root.$.categories

    if (transaction) {
      _assign(this.transaction, transaction)
    } else if(categories.items.length) {
      this.transaction.categoryId = categories.sorted[0].id
    }
  },

  methods: {
    save() {
      event.preventDefault()

      const transactions = this.$root.$.transactions
      const attributes = this.transaction

      if (attributes.id) {
        transactions.update(attributes)
      } else {
        transactions.create(attributes)
      }

      this.$route.router.go('/')
    },

    cancel() {
      this.$route.router.go('/')
    }
  },

  template: require('./template.html')
})
