import Vue from 'vue'
import baseMixin from 'js/models/base.js'

export default Vue.extend({
  data() {
    return {
    }
  },

  created() {
    // models
    this.addModel(
      'categories',
      require('js/models/categories.js')
    )
    this.addModel(
      'transactions',
      require('js/models/transactions.js')
    )

    window.app = this
  },

  methods: {
    addModel(name, ctor) {
      this.$[name] = this.$addChild(
        {mixins: [baseMixin]},
        ctor
      )
    }
  },

  components: {
    navbar: require('js/navbar')
  },

  template: require('./template.html')
})
