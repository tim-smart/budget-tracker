import App from 'js/app'

describe('Transactions', function() {

  const app = new App({
    el: document.createElement('div')
  })
  const categories = app.$.categories
  const transactions = app.$.transactions

  afterEach(function() {
    categories.removeAll()
    transactions.removeAll()
  })

  describe('computed.byCategoryId', function() {

    it('returns object with category ids as keys', function() {
      const categoryOne = categories.create({})
      const categoryTwo = categories.create({})
      const transactionOne = transactions.create({ amount: 5, categoryId: categoryOne.id })
      transactions.create({ amount: 2, categoryId: categoryTwo.id })

      const ret = transactions.byCategoryId

      expect(ret[categoryOne.id].length).toEqual(1)
      expect(ret[categoryOne.id][0]).toEqual(transactionOne)
    })

  }),

  describe('total', function() {

    it('returns the total amount', function() {
      transactions.create({ amount: 2 })
      transactions.create({ amount: 3 })
      transactions.create({ amount: 4 })

      expect(transactions.total).toEqual(9)
    })
  })

})
