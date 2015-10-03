import Vue from 'vue'
import moment from 'moment'
import slug from 'slug'

Vue.filter('dateFromNow', function(value) {
  return moment(value).fromNow()
})

// Vue.filter('numberToCurrency', function(value) {
//   return numeral(value).format('$0,0.00')
// })

Vue.filter('fileDataUrl', function(file) {
  if (!file || !file.data) {
    return ''
  }

  const blob = new Blob([file.data], {type: file.type})
  return URL.createObjectURL(blob)
})

Vue.filter('slugify', function(value) {
  return slug(value)
})
