export default {
  data() {
    return {
      items: []
    }
  },

  computed: {
    itemsById() {
      const hash = {}

      this.items.forEach(function(item) {
        hash[item._id] = item
      })

      return hash
    }
  },

  created() {
    const Coll = this.getCollection()
    const sub = BT[this.$options.collection.toLowerCase() + 'Sub']

    this.$sync('items', function() {
      if (!sub.ready()) {
        return
      }
      return Coll.find()
    })
  },

  methods: {
    getCollection() {
      return BT[this.$options.collection]
    },

    callMethod(name, ...args) {
      const method = `${this.$options.collection}.${name}`
      const sessionId = this.$root.sessionId
      Meteor.call(method, sessionId, ...args)
    },

    create(item) {
      this.$emit('beforeCreate', item)
      this.$emit('beforeSave', item)

      this.callMethod('create', item)

      this.$emit('create', item)

      return item
    },

    find(id) {
      return this.itemsById[id]
    },

    update(attributes) {
      const item = this.find(attributes._id)
      if (!item) {
        return false
      }

      this.$emit('beforeUpdate', item)
      this.$emit('beforeSave', item)

      this.callMethod('update', item._id, attributes)

      this.$emit('update', item)
    },

    remove(item) {
      let id = null
      if (typeof item === 'string') {
        id = item
      } else {
        id = item._id
      }

      this.$emit('beforeRemove', item)

      this.callMethod('remove', id)

      this.$emit('remove', item)
    },

    removeAll() {
      this.callMethod('removeAll')
    }
  }
}
