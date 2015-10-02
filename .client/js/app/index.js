import Vue from 'vue'
import baseMixin from 'js/models/base.js'
import fastclick from 'fastclick'
import uuid from 'uuid'

export default Vue.extend({
  data() {
    return {
      sessionId: null
    }
  },

  created() {
    this.$watch('sessionId', function() {
      Session.set('sessionId', this.sessionId)
      localStorage.setItem('sessionId', this.sessionId)
    })

    let sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      sessionId = uuid.v4()
    }
    this.$set('sessionId', sessionId)

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

  ready() {
    fastclick(this.$el)

    this.$el.addEventListener('click', function(event) {
      if (event.target.tagName !== 'A') {
        return
      }

      event.preventDefault()
      location.href = event.target.href
    })
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
