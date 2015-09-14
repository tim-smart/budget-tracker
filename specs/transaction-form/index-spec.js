import App from 'js/app'
import TransactionForm from 'js/transaction-form'

describe('TransactionForm', function() {

  const app = new App({
    el: document.createElement('div')
  })
  const transactions = app.$.transactions
  const categories = app.$.categories

  let form = null
  let formCreated = null
  let goQueue = []
  beforeEach(function() {
    form = app.$addChild({
      el: document.createElement('div')
    }, TransactionForm)
    formCreated = function() {
      form.$options.created[0].call(form)
    }

    form.$route = {
      params: {},
      router: {
        go(path) {
          goQueue.push(path)
        }
      }
    }
  })

  afterEach(function() {
    form.$destroy()
    formCreated = null
    goQueue = []
    transactions.removeAll()
    categories.removeAll()
  })

  describe('created', function() {

    it('loads transaction from id parameter', function() {
      const transaction = transactions.create({
        description: 'Test',
        amount: 5
      })
      form.$route = {params: {id: transaction.id}}
      formCreated()

      expect(form.transaction.id).toEqual(transaction.id)
    })

    it('sets categoryId if new', function() {
      const category = categories.create({name: 'Test'})
      formCreated()
      expect(form.transaction.categoryId).toEqual(category.id)
    })

  })

  describe('save', function() {

    it('creates a new transaction', function() {
      form.transaction.description = 'New'
      form.transaction.amount = 50
      form.save()

      expect(transactions.items[0].amount).toEqual(50)
      expect(goQueue[0]).toEqual('/')
    })

    it('updates an existing transaction', function() {
      const transaction = transactions.create({
        description: 'Existing', amount: 5
      })
      form.$route.params.id = transaction.id
      formCreated()

      form.transaction.description = 'Changed'
      form.save()

      expect(
        transactions.find(transaction.id).description
      ).toEqual('Changed')
      expect(goQueue[0]).toEqual('/')
    })

  })

  describe('cancel', function() {

    it('redirects back home', function() {
      form.cancel()
      expect(goQueue[0]).toEqual('/')
    })

  })

})
