import Vue from 'vue'
import _assign from 'lodash.assign'
import 'blueimp-load-image/js/load-image.all.min'

export default Vue.extend({
  name: 'transaction-form',

  data() {
    return {
      transaction: {
        description: '',
        amount: '',
        categoryId: null,
        image: null
      }
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

  methods: {
    save(event) {
      event.preventDefault()

      const transactions = this.$root.$.transactions
      const attributes = this.transaction

      if (attributes._id) {
        transactions.update(attributes)
      } else {
        transactions.create(attributes)
      }

      this.$route.router.go('/')
    },

    cancel() {
      this.$route.router.go('/')
    },

    onImageChange(event) {
      const self = this
      const input = self.$$.imageInput

      if (!input.files[0]) {
        return
      }

      loadImage.parseMetaData(input.files[0], function(data) {
        let orientation = null
        if (data.exif && data.exif.get) {
          orientation = data.exif.get('Orientation')
        }

        loadImage(
          input.files[0],
          imageLoaded,
          {
            canvas: true,
            maxWidth: 500,
            orientation: orientation
          }
        )
      })

      function imageLoaded(canvas) {
        self.transaction.image = canvas.toDataURL()
      }
    },

    clearImage(event) {
      event.preventDefault()
      this.transaction.image = null
    }
  },

  template: require('./template.html')
})
