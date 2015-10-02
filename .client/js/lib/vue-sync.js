export default function(Vue) {

  Vue.prototype.$unsync = function $unsync(key) {
    if (!self.$$sync || !self.$$sync[key]) {
      return
    }

    self.$$sync[key].stop()
  }

  Vue.prototype.$sync = function $sync(key, fn) {
    const self = this
    self.$unsync(key);
    self.$$sync = self.$$sync || {}

    self.$$sync[key] = Tracker.autorun(function() {
      const val = fn.call(self)
      if (!val) {
        return
      } else if (val.fetch) {
        self.$set(key, val.fetch() || [])
      } else {
        self.$set(key, val || [])
      }
    })
  }

}
