import Vue from 'vue'
import _assign from 'lodash.assign'
import imageReader from '../lib/image-reader.js'
import Cropper from 'cropperjs'

export default Vue.extend({
  name: 'transaction-form',

  data() {
    return {
      transaction: {
        description: '',
        amount: '',
        categoryId: null,
        image: null
      },
      imagePreview: null
    }
  },

  created() {
    if (!this.$route) {
      return;
    }

    const transactions = this.$root.$.transactions
    const transaction = transactions.find(this.$route.params.id)
    const categories = this.$root.$.categories

    if (transaction) {
      _assign(this.transaction, transaction)
    } else if (categories.items.length) {
      this.transaction.categoryId = categories.sorted[0]._id
    }
  },

  ready() {
    const self = this;
  },

  methods: {
    save(event) {
      event.preventDefault()

      // Image crop?
      if (this.imagePreview) {
        this.transaction.image = this.$.cropper.getCroppedCanvas().toDataURL('image/jpg', 0.8)
      }

      const transactions = this.$root.$.transactions
      const attributes = this.transaction

      if (attributes._id) {
        transactions.update(attributes)
      } else {
        transactions.create(attributes)
      }

      history.back()
    },

    cancel() {
      history.back()
    },

    onImageChange(event) {
      const self = this
      const input = self.$$.imageInput

      if (!input.files[0]) {
        return
      }

      imageReader(input.files[0])
      .then(function(data) {
        self.transaction.image = data
        if (self.$.cropper) {
          self.$.cropper.destroy()
        }
        self.imagePreview = data
        self.$nextTick(function() {
          self.$.cropper = new Cropper(self.$$.imagePreview, {
            mouseWheelZoom: false,
            dragCrop: false,
            movable: false,
            autoCropArea: 1
          })
        })
      })
      .catch(function(err) {
        console.error(err)
      })
    },

    clearImage(event) {
      event.preventDefault()
      this.transaction.image = null
      this.imagePreview = null
    }
  },

  template: require('./template.html')
})
