import Vue from 'vue'
import moment from 'moment'
// import numeral from 'numeral'

Vue.filter('dateFromNow', function(value) {
  return moment(value).fromNow()
})

// Vue.filter('numberToCurrency', function(value) {
//   return numeral(value).format('$0,0.00')
// })
