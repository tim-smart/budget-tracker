import Navbar from 'js/navbar'

describe('NavBar', function() {
  const navbar = new Navbar({
    el: document.createElement('div')
  })

  describe('$el', function() {
    it('is a header element', function() {
      expect(navbar.$el.tagName).toEqual('HEADER')
    })
  })
})
