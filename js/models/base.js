import uuid from 'uuid'
import _assign from 'lodash.assign'

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
        hash[item.id] = item
      })

      return hash
    }
  },

  created() {
    this.fetch()

    window.addEventListener('unload', () => {
      this.save()
    })
  },

  methods: {
    create(item) {
      item.id = uuid.v4()

      this.$emit('beforeCreate', item)
      this.$emit('beforeSave', item)

      item.createdAt = Date.now()
      item.updatedAt = Date.now()
      this.items.push(item)

      this.$emit('create', item)

      return item
    },

    find(id) {
      return this.itemsById[id]
    },

    update(attributes) {
      const item = this.find(attributes.id)
      if (!item) {
        return false
      }

      _assign(item, attributes)

      this.$emit('beforeUpdate', item)
      this.$emit('beforeSave', item)
      item.updatedAt = Date.now()
      this.$emit('update', item)
    },

    remove(item) {
      const index = this.items.indexOf(item)

      this.$emit('beforeRemove', item)

      this.items.splice(index, 1)

      this.$emit('remove', item)
    },

    removeAll() {
      this.$set('items', [])

      this.$emit('removeAll')
    },

    fetch() {
      const name = this.constructor.name.toLowerCase()
      let data = window.localStorage.getItem(name)
      if (!data) {
        return
      }

      data = JSON.parse(data)
      this.$set('items', data)
    },

    save() {
      const name = this.constructor.name.toLowerCase()
      window.localStorage.setItem(name, JSON.stringify(this.$data.items))
    }
  }
}
