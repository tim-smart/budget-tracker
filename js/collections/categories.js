
const bb = require('backbone')

const Category = bb.Model.extend({
})

const Categories = bb.Collection.extend({
  model: Category,
  localStorage: new bb.LocalStorage('categories')
})
const categories = new Categories()
categories.fetch()

export default categories
