import App from 'js/app'
import CategoryForm from 'js/category-form'

describe('CategoryForm', function() {

  const app = new App({
    el: document.createElement('div')
  })
  const categories = app.$.categories

  let form = null
  let formCreated = null
  let goQueue = []
  beforeEach(function() {
    form = app.$addChild({
      el: document.createElement('div')
    }, CategoryForm)
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
    categories.removeAll()
  })

  describe('created', function() {

    it('loads category from slug parameter', function() {
      const category = categories.create({name: 'Test'})
      form.$route = {params: {slug: 'test'}}
      formCreated()

      expect(form.category.id).toEqual(category.id)
    })

  })

  describe('save', function() {

    it('creates a new category', function() {
      form.category.name = 'New'
      form.category.quota = 50
      form.save()

      expect(categories.bySlug['new'].quota).toEqual(50)
      expect(goQueue[0]).toEqual('/')
    })

    it('updates an existing category', function() {
      const category = categories.create({name: 'Existing', quota: 5})
      form.$route.params.slug = 'existing'
      formCreated()

      form.category.name = 'Changed'
      form.save()

      expect(categories.find(category.id).name).toEqual('Changed')
      expect(goQueue[0]).toEqual('/')
    })

  })

  describe('cancel', function() {

    it('redirects back home', function() {
      form.cancel()
      expect(goQueue[0]).toEqual('/')
    })

  })

  describe('remove', function() {
    it('removes the category and redirects', function() {
      const category = categories.create({name: 'Existing', quota: 5})
      form.$route.params.slug = 'existing'
      formCreated()

      spyOn(window, 'confirm').and.returnValue(true)
      form.remove()

      expect(categories.find(category.id)).toBeUndefined()
      expect(goQueue[0]).toEqual('/')
    })

    it('only redirects if id not present', function() {
      form.remove()
      expect(goQueue[0]).toEqual('/')
    })
  })

})
