import Vue from 'vue'

export default Vue.extend({
  created() {
    console.log(this.$data)
  },

  template: require('./template.html')
})
