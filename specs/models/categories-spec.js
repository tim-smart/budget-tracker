import App from 'js/app'

describe('Categories', function() {

  const app = new App({
    el: document.createElement('div')
  })
  const transactions = app.$.transactions
  const categories = app.$.categories

  afterEach(function() {
    transactions.removeAll()
    categories.removeAll()
  })

  describe('computed.withTotals', function() {

    it('add .total to each category', function() {
      const category = categories.create({
        name: 'Test',
        quota: 10
      })
      transactions.create({ amount: 5, categoryId: category.id })
      transactions.create({ amount: 2, categoryId: category.id })

      const ret = categories.withTotals[0]

      expect(ret.total).toEqual(3)
    })

  })

  describe('computer.bySlug', function() {

    beforeEach(function() {
      categories.create({ name: 'Test thing', quota: 10 })
      categories.create({ name: 'Two', quota: 10 })
    })

    it('returns an object with slugs as keys', function() {
      expect(categories.bySlug['test-thing']).toEqual(categories.items[0])
      expect(categories.bySlug['two']).toEqual(categories.items[1])
    })

  })

  describe('totalQuota', function() {
    it('returns the sum of the quotas', function() {
      categories.create({ name: 'Test thing', quota: 10 })
      categories.create({ name: 'Two', quota: 15 })

      expect(categories.totalQuota).toEqual(25)
    })
  })

  describe('totalQuotaRemaining', function() {
    it('returns the remaining quota', function() {
      categories.create({name: 'Test', quota: 100})
      transactions.create({ amount: 2 })
      transactions.create({ amount: 3 })
      transactions.create({ amount: 4 })

      expect(categories.totalQuotaRemaining).toEqual(91)
      transactions.create({ amount: 2 })
      expect(categories.totalQuotaRemaining).toEqual(89)
    })
  })

  describe('selectOptions', function() {
    it('returns an array of options for select element', function() {
      const category = categories.create({ name: 'Zest thing', quota: 10 })
      categories.create({ name: 'Two', quota: 15 })

      expect(categories.selectOptions[1].text).toEqual('Zest thing')
      expect(categories.selectOptions[1].value).toEqual(category.id)
    })
  })

  describe('totalDeficit', function() {
    it('returns total of categories that have a negative amount', function() {
      const categoryOne = categories.create({name: 'One', quota: 100})
      const categoryTwo = categories.create({name: 'Two', quota: 100})
      const categoryThree = categories.create({name: 'Three', quota: 100})
      transactions.create({ amount: 200, categoryId: categoryOne.id })
      transactions.create({ amount: 3, categoryId: categoryTwo.id })
      transactions.create({ amount: 110, categoryId: categoryThree.id })

      expect(categories.totalDeficit).toEqual(110)
    })
  })

  describe('withRemaining', function() {
    it('returns categories with remaining attribute with reduced total', function() {
      categories.create({name: 'One', quota: 90})
      const categoryTwo = categories.create({name: 'Two', quota: 75})
      const categoryThree = categories.create({name: 'Three', quota: 230})
      const categoryFour = categories.create({name: 'Four', quota: 70})

      transactions.create({ amount: 200, categoryId: categoryTwo.id })
      transactions.create({ amount: 230, categoryId: categoryThree.id })
      transactions.create({ amount: 21, categoryId: categoryFour.id })

      expect(categories.withRemaining[0].remaining).toEqual(14)
      expect(categories.withRemaining[3].remaining).toEqual(0)
    })
  })

})
