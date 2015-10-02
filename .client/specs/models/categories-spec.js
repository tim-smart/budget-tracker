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
      categories.create({ name: 'Zest thing', quota: 10 })
      const category = categories.create({ name: 'Two', quota: 15 })

      expect(categories.selectOptions[1].text).toEqual('Two')
      expect(categories.selectOptions[1].value).toEqual(category.id)
    })
  })

})
