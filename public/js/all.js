(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _routerJs = require('./router.js');

var _routerJs2 = _interopRequireDefault(_routerJs);

require('./filters.js');

window.router = _routerJs2['default'];

_routerJs2['default'].start(require('./app'), '#budget-app');

},{"./app":2,"./filters.js":8,"./router.js":17,"vue":136}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _jsModelsBaseJs = require("./../../js/models/base.js");

var _jsModelsBaseJs2 = _interopRequireDefault(_jsModelsBaseJs);

var _fastclick = require('fastclick');

var _fastclick2 = _interopRequireDefault(_fastclick);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

exports['default'] = _vue2['default'].extend({
  data: function data() {
    return {
      sessionId: null
    };
  },

  created: function created() {
    this.$watch('sessionId', function () {
      Session.set('sessionId', this.sessionId);
      localStorage.setItem('sessionId', this.sessionId);
    });

    var sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = _uuid2['default'].v4();
    }
    this.$set('sessionId', sessionId);

    // models
    this.addModel('categories', require("./../../js/models/categories.js"));
    this.addModel('transactions', require("./../../js/models/transactions.js"));

    window.app = this;
  },

  ready: function ready() {
    _fastclick2['default'](this.$el);

    this.$el.addEventListener('click', function (event) {
      if (event.target.tagName !== 'A') {
        return;
      }

      event.preventDefault();
      location.href = event.target.href;
    });
  },

  methods: {
    addModel: function addModel(name, ctor) {
      this.$[name] = this.$addChild({ mixins: [_jsModelsBaseJs2['default']] }, ctor);
    }
  },

  components: {
    navbar: require("./../../js/navbar")
  },

  template: require('./template.html')
});
module.exports = exports['default'];

},{"./../../js/models/base.js":12,"./../../js/models/categories.js":13,"./../../js/models/transactions.js":14,"./../../js/navbar":15,"./template.html":3,"fastclick":26,"uuid":41,"vue":136}],3:[function(require,module,exports){
module.exports = '<div id="budget-app">\n  <navbar></navbar>\n\n  <router-view></router-view>\n</div>\n';
},{}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _lodashAssign = require('lodash.assign');

var _lodashAssign2 = _interopRequireDefault(_lodashAssign);

exports['default'] = _vue2['default'].extend({
  name: 'category-form',

  data: function data() {
    return {
      category: {
        name: '',
        quota: ''
      }
    };
  },

  created: function created() {
    if (!this.$route) {
      return;
    }

    var categories = this.$root.$.categories;
    var category = categories.find(this.$route.params.id);
    if (category) {
      _lodashAssign2['default'](this.category, category);
    }
  },

  methods: {
    save: function save(event) {
      event.preventDefault();

      var categories = this.$root.$.categories;
      var attributes = this.category;

      if (attributes._id) {
        categories.update(attributes);
      } else {
        categories.create(attributes);
      }

      this.$route.router.go('/');
    },

    cancel: function cancel() {
      this.$route.router.go('/');
    },

    remove: function remove() {
      var categories = this.$root.$.categories;

      if (this.category._id) {
        if (!confirm('Do you really want to delete this category?')) {
          return;
        }
        categories.remove(this.category._id);
      }

      this.$route.router.go('/');
    }
  },

  components: {
    transactionList: require("./../../js/transaction-list")
  },

  template: require('./template.html')
});
module.exports = exports['default'];

},{"./../../js/transaction-list":20,"./template.html":5,"lodash.assign":27,"vue":136}],5:[function(require,module,exports){
module.exports = '<form class="container" v-on="submit: save">\n  <div class="form-group row">\n    <label class="col-sm-2 form-control-label">Name</label>\n    <div class="col-sm-10">\n      <input\n        type="text"\n        class="form-control"\n        placeholder="Name"\n        v-model="category.name"\n      />\n    </div>\n  </div>\n  <div class="form-group row">\n    <label class="col-sm-2 form-control-label">Quota</label>\n    <div class="col-sm-10">\n      <input\n        type="number"\n        min="0"\n        step="0.01"\n        class="form-control"\n        placeholder="$0.00"\n        v-model="category.quota"\n      />\n    </div>\n  </div>\n  <div class="form-group row">\n    <div class="col-xs-12">\n      <button type="button" class="btn btn-secondary" v-on="click: cancel">Cancel</button>\n      <button type="button" class="btn btn-danger" v-on="click: remove" v-if="category._id">Remove</button>\n      <button type="submit" class="btn btn-primary">Save</button>\n    </div>\n  </div>\n</form>\n\n<transaction-list\n  v-if="category._id || $root.$.transactions.byCategoryId[category._id]"\n  transactions="{{$root.$.transactions.byCategoryId[category._id]}}"\n  hide-category\n></transaction-list>\n';
},{}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

exports['default'] = _vue2['default'].extend({
  data: function data() {
    return {};
  },

  template: require('./template.html')
});
module.exports = exports['default'];

},{"./template.html":7,"vue":136}],7:[function(require,module,exports){
module.exports = '<div class="form-group">\n  <div class="list-group categories">\n    <a\n      class="list-group-item"\n      type="button"\n      v-repeat="category in $root.$.categories.items | orderBy \'name\'"\n      href="#!/categories/{{category._id}}"\n    >\n      <span\n        class="label label-default label-pill"\n      >{{$root.$.transactions.byCategoryId[category._id].length}}</span>\n      {{category.name}}\n      <div class="pull-right">\n        <span\n          class="label label-pill"\n          v-class="\n            label-success: $root.$.transactions.totalsByCategoryId[category._id] > 0,\n            label-danger: $root.$.transactions.totalsByCategoryId[category._id] <= 0\n          "\n        >{{$root.$.transactions.totalsByCategoryId[category._id] | currency}}</span>\n      </div>\n    </a>\n  </div>\n</div>\n';
},{}],8:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _slug = require('slug');

var _slug2 = _interopRequireDefault(_slug);

_vue2['default'].filter('dateFromNow', function (value) {
  return _moment2['default'](value).fromNow();
});

// Vue.filter('numberToCurrency', function(value) {
//   return numeral(value).format('$0,0.00')
// })

_vue2['default'].filter('fileDataUrl', function (file) {
  if (!file || !file.data) {
    return '';
  }

  var blob = new Blob([file.data], { type: file.type });
  return URL.createObjectURL(blob);
});

_vue2['default'].filter('slugify', function (value) {
  return _slug2['default'](value);
});

},{"moment":38,"slug":39,"vue":136}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

exports['default'] = _vue2['default'].extend({
  components: {
    categoryList: require("./../../js/category-list")
  },

  methods: {
    reset: function reset() {
      if (!confirm('Do you really want to remove all your transactions?')) {
        return;
      }

      this.$root.$.transactions.removeAll();
    }
  },

  template: require('./template.html')
});
module.exports = exports['default'];

},{"./../../js/category-list":6,"./template.html":10,"vue":136}],10:[function(require,module,exports){
module.exports = '<div class="home container">\n  <div class="row">\n    <div class="col-xs-12">\n      <div class="form-group">\n        <strong>\n          Total: {{$root.$.categories.totalQuota | currency}},\n          Remaining: {{$root.$.categories.totalQuotaRemaining | currency}}\n        </strong>\n        <progress\n          class="progress progress-success"\n          v-class="\n            progress-warning: $root.$.categories.totalQuotaPercent <= 25,\n            progress-danger: $root.$.categories.totalQuotaPercent < 10\n          "\n          value="{{$root.$.categories.totalQuotaRemaining}}"\n          max="{{$root.$.categories.totalQuota}}"\n        ></progress>\n      </div>\n\n      <div class="form-group">\n        <a\n          type="button"\n          class="btn btn-success btn-lg btn-block"\n          href="#!/transactions/new"\n        >\n          Add Transaction\n        </a>\n      </div>\n\n      <category-list></category-list>\n    </div>\n  </div>\n\n  <div class="row">\n    <div class="col-xs-12">\n      <div class="form-group">\n        <a type="button" class="btn btn-success btn-lg btn-block" href="#!/categories/new">\n          Add Category\n        </a>\n      </div>\n\n      <div class="form-group">\n        <a type="button" class="btn btn-secondary btn-lg btn-block" v-link="\'/transactions\'">\n          All transactions\n        </a>\n      </div>\n\n      <div class="form-group">\n        <button\n          type="button"\n          class="btn btn-danger btn-lg btn-block"\n          v-on="click: reset"\n        >\n          Reset transactions\n        </button>\n      </div>\n\n      <div class="form-group">\n        <label class="col-sm-2 form-control-label">Share me</label>\n        <div class="col-sm-10">\n          <input class="form-control" type="text" v-model="$root.sessionId" />\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n';
},{}],11:[function(require,module,exports){
'use strict';

exports.__esModule = true;

require('blueimp-load-image/js/load-image.all.min');

exports['default'] = function (file) {
  var maxWidth = arguments.length <= 1 || arguments[1] === undefined ? 800 : arguments[1];

  return new Promise(function (resolve, reject) {
    loadImage.parseMetaData(file, function (data) {
      var orientation = null;
      if (data.exif && data.exif.get) {
        orientation = data.exif.get('Orientation');
      }

      loadImage(file, imageLoaded, {
        canvas: true,
        maxWidth: maxWidth,
        orientation: orientation
      });
    });

    function imageLoaded(canvas) {
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    }
  });
};

module.exports = exports['default'];

},{"blueimp-load-image/js/load-image.all.min":22}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = {
  data: function data() {
    return {
      items: []
    };
  },

  computed: {
    itemsById: function itemsById() {
      var hash = {};

      this.items.forEach(function (item) {
        hash[item._id] = item;
      });

      return hash;
    }
  },

  created: function created() {
    var self = this;
    var Coll = this.getCollection();

    Tracker.autorun(function () {
      self.$set('items', Coll.find().fetch());
    });
  },

  methods: {
    getCollection: function getCollection() {
      return BT[this.$options.collection];
    },

    callMethod: function callMethod(name) {
      var _Meteor;

      var method = this.$options.collection + '.' + name;
      var sessionId = this.$root.sessionId;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      (_Meteor = Meteor).call.apply(_Meteor, [method, sessionId].concat(args));
    },

    create: function create(item) {
      this.$emit('beforeCreate', item);
      this.$emit('beforeSave', item);

      this.callMethod('create', item);

      this.$emit('create', item);

      return item;
    },

    find: function find(id) {
      return this.itemsById[id];
    },

    update: function update(attributes) {
      var item = this.find(attributes._id);
      if (!item) {
        return false;
      }

      this.$emit('beforeUpdate', item);
      this.$emit('beforeSave', item);

      this.callMethod('update', item._id, attributes);

      this.$emit('update', item);
    },

    remove: function remove(item) {
      var id = null;
      if (typeof item === 'string') {
        id = item;
      } else {
        id = item._id;
      }

      this.$emit('beforeRemove', item);

      this.callMethod('remove', id);

      this.$emit('remove', item);
    },

    removeAll: function removeAll() {
      this.callMethod('removeAll');
    }
  }
};
module.exports = exports['default'];

},{}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _slug = require('slug');

var _slug2 = _interopRequireDefault(_slug);

exports['default'] = _vue2['default'].extend({
  name: 'categories',
  collection: 'Categories',

  created: function created() {
    this.$on('beforeSave', function (category) {
      category.slug = _slug2['default'](category.name || '').toLowerCase();
      category.quota = category.quota ? +category.quota : 0;
    });
  },

  computed: {
    bySlug: function bySlug() {
      var hash = {};

      this.items.forEach(function (category) {
        if (!category.slug) {
          return;
        }

        hash[category.slug] = category;
      });

      return hash;
    },

    totalQuota: function totalQuota() {
      return this.items.reduce(function (prev, category) {
        return prev + (+category.quota || 0);
      }, 0);
    },

    totalQuotaRemaining: function totalQuotaRemaining() {
      return this.totalQuota - this.$root.$.transactions.total;
    },

    totalQuotaPercent: function totalQuotaPercent() {
      return Math.floor(this.totalQuotaRemaining / this.totalQuota * 100);
    },

    sorted: function sorted() {
      return this.items.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    },

    selectOptions: function selectOptions() {
      return this.items.map(function (category) {
        return {
          text: category.name,
          value: category._id
        };
      });
    }
  }
});
module.exports = exports['default'];

},{"slug":39,"vue":136}],14:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

function transactionsCategoryTotal(transactions, category) {
  return transactions.reduce(function (prev, transaction) {
    if (transaction.categoryId !== category._id) {
      return prev;
    }

    return prev + transaction.amount;
  }, 0);
}
_vue2['default'].filter('transactionsCategoryTotal', transactionsCategoryTotal);

function transactionsTotal(transactions, category) {
  var quota = category.quota || 0;
  return +quota - transactions.reduce(function (prev, transaction) {
    return prev + transaction.amount;
  }, 0);
}
_vue2['default'].filter('transactionsTotal', transactionsTotal);

exports['default'] = _vue2['default'].extend({
  name: 'transactions',
  collection: 'Transactions',

  created: function created() {
    this.$on('beforeSave', function (category) {
      category.amount = category.amount ? +category.amount : 0;
    });
  },

  computed: {
    byCategoryId: function byCategoryId() {
      var hash = {};
      var categories = this.$root.$.categories.items;

      categories.forEach(function (category) {
        hash[category._id] = [];
      });

      for (var i = 0, len = this.items.length; i < len; i++) {
        var item = this.items[i];
        if (!hash[item.categoryId]) {
          continue;
        }
        hash[item.categoryId].push(item);
      }

      return hash;
    },

    total: function total() {
      return this.items.reduce(function (prev, transaction) {
        return prev + +transaction.amount;
      }, 0);
    },

    totalsByCategoryId: function totalsByCategoryId() {
      var hash = {};
      var byCategoryId = this.byCategoryId;

      this.$root.$.categories.items.forEach(function (category) {
        hash[category._id] = transactionsTotal(byCategoryId[category._id], category);
      });

      return hash;
    }
  }
});
module.exports = exports['default'];

},{"vue":136}],15:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _templateHtml = require('./template.html');

var _templateHtml2 = _interopRequireDefault(_templateHtml);

exports['default'] = _vue2['default'].extend({
  template: _templateHtml2['default']
});
module.exports = exports['default'];

},{"./template.html":16,"vue":136}],16:[function(require,module,exports){
module.exports = '<header class="navbar navbar-fixed-top navbar-dark bg-primary text-center clearfix">\n  <a v-link="\'/\'" class="navbar-toggler pull-left" type="button">\n    &#127968;\n  </a>\n\n  <div class="navbar-nav">\n    <strong class="nav-link active">Cash Money</strong>\n  </div>\n</header>\n';
},{}],17:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vueRouter = require('vue-router');

var _vueRouter2 = _interopRequireDefault(_vueRouter);

// Components

var _home = require('./home');

var _home2 = _interopRequireDefault(_home);

var _transactionForm = require('./transaction-form');

var _transactionForm2 = _interopRequireDefault(_transactionForm);

var _transactionList = require('./transaction-list');

var _transactionList2 = _interopRequireDefault(_transactionList);

var _categoryForm = require('./category-form');

var _categoryForm2 = _interopRequireDefault(_categoryForm);

_vue2['default'].use(_vueRouter2['default']);

var router = new _vueRouter2['default']();
exports['default'] = router;

router.map({
  '/': {
    component: _home2['default']
  },

  '/transactions': {
    component: _transactionList2['default']
  },

  '/transactions/:id': {
    name: 'transaction',
    component: _transactionForm2['default']
  },

  '/categories/:id': {
    name: 'category',
    component: _categoryForm2['default']
  }
});
module.exports = exports['default'];

},{"./category-form":4,"./home":9,"./transaction-form":18,"./transaction-list":20,"vue":136,"vue-router":47}],18:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _lodashAssign = require('lodash.assign');

var _lodashAssign2 = _interopRequireDefault(_lodashAssign);

var _libImageReaderJs = require('../lib/image-reader.js');

var _libImageReaderJs2 = _interopRequireDefault(_libImageReaderJs);

var _cropperjs = require('cropperjs');

var _cropperjs2 = _interopRequireDefault(_cropperjs);

exports['default'] = _vue2['default'].extend({
  name: 'transaction-form',

  data: function data() {
    return {
      transaction: {
        description: '',
        amount: '',
        categoryId: null,
        image: null
      },
      imagePreview: null
    };
  },

  created: function created() {
    if (!this.$route) {
      return;
    }

    var transactions = this.$root.$.transactions;
    var transaction = transactions.find(this.$route.params.id);
    var categories = this.$root.$.categories;

    if (transaction) {
      _lodashAssign2['default'](this.transaction, transaction);
    } else if (categories.items.length) {
      this.transaction.categoryId = categories.sorted[0]._id;
    }
  },

  ready: function ready() {
    var self = this;
  },

  methods: {
    save: function save(event) {
      event.preventDefault();

      // Image crop?
      if (this.imagePreview) {
        this.transaction.image = this.$.cropper.getCroppedCanvas().toDataURL('image/jpg', 0.8);
      }

      var transactions = this.$root.$.transactions;
      var attributes = this.transaction;

      if (attributes._id) {
        transactions.update(attributes);
      } else {
        transactions.create(attributes);
      }

      history.back();
    },

    cancel: function cancel() {
      history.back();
    },

    onImageChange: function onImageChange(event) {
      var self = this;
      var input = self.$$.imageInput;

      if (!input.files[0]) {
        return;
      }

      _libImageReaderJs2['default'](input.files[0]).then(function (data) {
        self.transaction.image = data;
        if (self.$.cropper) {
          self.$.cropper.destroy();
        }
        self.imagePreview = data;
        self.$nextTick(function () {
          self.$.cropper = new _cropperjs2['default'](self.$$.imagePreview, {
            mouseWheelZoom: false,
            dragCrop: false,
            movable: false,
            autoCropArea: 1
          });
        });
      })['catch'](function (err) {
        console.error(err);
      });
    },

    clearImage: function clearImage(event) {
      event.preventDefault();
      this.transaction.image = null;
      this.imagePreview = null;
    }
  },

  template: require('./template.html')
});
module.exports = exports['default'];

},{"../lib/image-reader.js":11,"./template.html":19,"cropperjs":25,"lodash.assign":27,"vue":136}],19:[function(require,module,exports){
module.exports = '<form class="container" v-on="submit: save">\n  <div class="form-group row">\n    <label class="col-sm-2 form-control-label">Category</label>\n    <div class="col-sm-10">\n      <select\n        class="form-control"\n        v-model="transaction.categoryId"\n        options="$root.$.categories.selectOptions | orderBy \'text\'"\n      ></select>\n    </div>\n  </div>\n  <div class="form-group row">\n    <label class="col-sm-2 form-control-label">Description</label>\n    <div class="col-sm-10">\n      <input\n        type="text"\n        class="form-control"\n        placeholder="Description"\n        v-model="transaction.description"\n      />\n    </div>\n  </div>\n  <div class="form-group row">\n    <label class="col-sm-2 form-control-label">Amount</label>\n    <div class="col-sm-10">\n      <input\n        type="number"\n        min="0"\n        step="0.01"\n        class="form-control"\n        placeholder="$0.00"\n        v-model="transaction.amount"\n      />\n    </div>\n  </div>\n  <div class="form-group row">\n    <label class="col-sm-2 form-control-label">Image</label>\n    <div class="col-sm-10">\n      <button\n        type="button"\n        v-on="click: clearImage"\n        class="btn btn-sm btn-danger"\n        v-show="transaction.image"\n      >\n        Clear image\n      </button>\n      <input\n        type="file"\n        class="form-control"\n        accept="image/jpeg"\n        capture="camera"\n        v-el=\'imageInput\'\n        v-on="change: onImageChange"\n      />\n    </div>\n  </div>\n  <div\n    class="form-group row"\n    v-show="imagePreview"\n  >\n    <img\n      class="img-responsive"\n      v-el="imagePreview"\n      v-attr="src: imagePreview"\n    />\n  </div>\n  <div class="form-group row">\n    <div class="col-xs-12">\n      <button type="button" class="btn btn-secondary" v-on="click: cancel">Cancel</button>\n      <button type="submit" class="btn btn-primary">Save</button>\n    </div>\n  </div>\n</form>\n';
},{}],20:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

exports['default'] = _vue2['default'].extend({
  name: 'transactions-list',

  props: {
    transactions: {},

    hideTitle: {
      type: Boolean,
      'default': false
    },

    hideCategory: {
      type: Boolean,
      'default': false
    }
  },

  created: function created() {},

  template: require('./template.html')
});
module.exports = exports['default'];

},{"./template.html":21,"vue":136}],21:[function(require,module,exports){
module.exports = '<div class="container">\n  <div class="row" v-if="!hideTitle">\n    <div class="col-xs-12">\n      <h3>Transactions</h3>\n    </div>\n  </div>\n\n  <div class="row">\n    <div\n      class="col-sm-6"\n      v-repeat="(transactions || $root.$.transactions.items) | orderBy \'createdAt\' -1"\n    >\n      <div class="card">\n        <div class="card-header clearfix">\n          <span class="label label-primary label-pill">{{amount | currency}}</span>\n          <span class="label label-default label-pill" v-if="!hideCategory && categoryId">\n            {{$root.$.categories.find(categoryId).name}}\n          </span>\n          <div class="pull-right">\n            <a\n              type="button"\n              class="btn btn-default btn-sm"\n              v-link="{name: \'transaction\', params: {id: $data._id}}"\n            >&#9998;</a>\n            <button\n              type="button"\n              class="btn btn-danger btn-sm"\n              v-on="click: $root.$.transactions.remove($data)"\n            >&#10006;</button>\n          </div>\n        </div>\n        <div class="card-block">\n          <p class="card-text">\n            {{description}}\n            <small class="text-muted">{{createdAt | dateFromNow}}</small>\n          </p>\n        </div>\n\n        <a\n          v-if="image"\n          v-attr="href: image"\n          class="card-img-bottom"\n          download="{{description | slugify}}.jpg"\n        ><img v-attr="src: image" alt="{{description}}" /></a>\n      </div>\n    </div>\n  </div>\n</div>\n';
},{}],22:[function(require,module,exports){
!function(a){"use strict";var b=function(a,c,d){var e,f,g=document.createElement("img");if(g.onerror=c,g.onload=function(){!f||d&&d.noRevoke||b.revokeObjectURL(f),c&&c(b.scale(g,d))},b.isInstanceOf("Blob",a)||b.isInstanceOf("File",a))e=f=b.createObjectURL(a),g._type=a.type;else{if("string"!=typeof a)return!1;e=a,d&&d.crossOrigin&&(g.crossOrigin=d.crossOrigin)}return e?(g.src=e,g):b.readFile(a,function(a){var b=a.target;b&&b.result?g.src=b.result:c&&c(a)})},c=window.createObjectURL&&window||window.URL&&URL.revokeObjectURL&&URL||window.webkitURL&&webkitURL;b.isInstanceOf=function(a,b){return Object.prototype.toString.call(b)==="[object "+a+"]"},b.transformCoordinates=function(){},b.getTransformedOptions=function(a,b){var c,d,e,f,g=b.aspectRatio;if(!g)return b;c={};for(d in b)b.hasOwnProperty(d)&&(c[d]=b[d]);return c.crop=!0,e=a.naturalWidth||a.width,f=a.naturalHeight||a.height,e/f>g?(c.maxWidth=f*g,c.maxHeight=f):(c.maxWidth=e,c.maxHeight=e/g),c},b.renderImageToCanvas=function(a,b,c,d,e,f,g,h,i,j){return a.getContext("2d").drawImage(b,c,d,e,f,g,h,i,j),a},b.hasCanvasOption=function(a){return a.canvas||a.crop||a.aspectRatio},b.scale=function(a,c){c=c||{};var d,e,f,g,h,i,j,k,l,m=document.createElement("canvas"),n=a.getContext||b.hasCanvasOption(c)&&m.getContext,o=a.naturalWidth||a.width,p=a.naturalHeight||a.height,q=o,r=p,s=function(){var a=Math.max((f||q)/q,(g||r)/r);a>1&&(q*=a,r*=a)},t=function(){var a=Math.min((d||q)/q,(e||r)/r);1>a&&(q*=a,r*=a)};return n&&(c=b.getTransformedOptions(a,c),j=c.left||0,k=c.top||0,c.sourceWidth?(h=c.sourceWidth,void 0!==c.right&&void 0===c.left&&(j=o-h-c.right)):h=o-j-(c.right||0),c.sourceHeight?(i=c.sourceHeight,void 0!==c.bottom&&void 0===c.top&&(k=p-i-c.bottom)):i=p-k-(c.bottom||0),q=h,r=i),d=c.maxWidth,e=c.maxHeight,f=c.minWidth,g=c.minHeight,n&&d&&e&&c.crop?(q=d,r=e,l=h/i-d/e,0>l?(i=e*h/d,void 0===c.top&&void 0===c.bottom&&(k=(p-i)/2)):l>0&&(h=d*i/e,void 0===c.left&&void 0===c.right&&(j=(o-h)/2))):((c.contain||c.cover)&&(f=d=d||f,g=e=e||g),c.cover?(t(),s()):(s(),t())),n?(m.width=q,m.height=r,b.transformCoordinates(m,c),b.renderImageToCanvas(m,a,j,k,h,i,0,0,q,r)):(a.width=q,a.height=r,a)},b.createObjectURL=function(a){return c?c.createObjectURL(a):!1},b.revokeObjectURL=function(a){return c?c.revokeObjectURL(a):!1},b.readFile=function(a,b,c){if(window.FileReader){var d=new FileReader;if(d.onload=d.onerror=b,c=c||"readAsDataURL",d[c])return d[c](a),d}return!1},"function"==typeof define&&define.amd?define(function(){return b}):a.loadImage=b}(window),function(a){"use strict";"function"==typeof define&&define.amd?define(["load-image"],a):a(window.loadImage)}(function(a){"use strict";if(window.navigator&&window.navigator.platform&&/iP(hone|od|ad)/.test(window.navigator.platform)){var b=a.renderImageToCanvas;a.detectSubsampling=function(a){var b,c;return a.width*a.height>1048576?(b=document.createElement("canvas"),b.width=b.height=1,c=b.getContext("2d"),c.drawImage(a,-a.width+1,0),0===c.getImageData(0,0,1,1).data[3]):!1},a.detectVerticalSquash=function(a,b){var c,d,e,f,g,h=a.naturalHeight||a.height,i=document.createElement("canvas"),j=i.getContext("2d");for(b&&(h/=2),i.width=1,i.height=h,j.drawImage(a,0,0),c=j.getImageData(0,0,1,h).data,d=0,e=h,f=h;f>d;)g=c[4*(f-1)+3],0===g?e=f:d=f,f=e+d>>1;return f/h||1},a.renderImageToCanvas=function(c,d,e,f,g,h,i,j,k,l){if("image/jpeg"===d._type){var m,n,o,p,q=c.getContext("2d"),r=document.createElement("canvas"),s=1024,t=r.getContext("2d");if(r.width=s,r.height=s,q.save(),m=a.detectSubsampling(d),m&&(e/=2,f/=2,g/=2,h/=2),n=a.detectVerticalSquash(d,m),m||1!==n){for(f*=n,k=Math.ceil(s*k/g),l=Math.ceil(s*l/h/n),j=0,p=0;h>p;){for(i=0,o=0;g>o;)t.clearRect(0,0,s,s),t.drawImage(d,e,f,g,h,-o,-p,g,h),q.drawImage(r,0,0,s,s,i,j,k,l),o+=s,i+=k;p+=s,j+=l}return q.restore(),c}}return b(c,d,e,f,g,h,i,j,k,l)}}}),function(a){"use strict";"function"==typeof define&&define.amd?define(["load-image"],a):a(window.loadImage)}(function(a){"use strict";var b=a.hasCanvasOption,c=a.transformCoordinates,d=a.getTransformedOptions;a.hasCanvasOption=function(c){return b.call(a,c)||c.orientation},a.transformCoordinates=function(b,d){c.call(a,b,d);var e=b.getContext("2d"),f=b.width,g=b.height,h=d.orientation;if(h&&!(h>8))switch(h>4&&(b.width=g,b.height=f),h){case 2:e.translate(f,0),e.scale(-1,1);break;case 3:e.translate(f,g),e.rotate(Math.PI);break;case 4:e.translate(0,g),e.scale(1,-1);break;case 5:e.rotate(.5*Math.PI),e.scale(1,-1);break;case 6:e.rotate(.5*Math.PI),e.translate(0,-g);break;case 7:e.rotate(.5*Math.PI),e.translate(f,-g),e.scale(-1,1);break;case 8:e.rotate(-.5*Math.PI),e.translate(-f,0)}},a.getTransformedOptions=function(b,c){var e,f,g=d.call(a,b,c),h=g.orientation;if(!h||h>8||1===h)return g;e={};for(f in g)g.hasOwnProperty(f)&&(e[f]=g[f]);switch(g.orientation){case 2:e.left=g.right,e.right=g.left;break;case 3:e.left=g.right,e.top=g.bottom,e.right=g.left,e.bottom=g.top;break;case 4:e.top=g.bottom,e.bottom=g.top;break;case 5:e.left=g.top,e.top=g.left,e.right=g.bottom,e.bottom=g.right;break;case 6:e.left=g.top,e.top=g.right,e.right=g.bottom,e.bottom=g.left;break;case 7:e.left=g.bottom,e.top=g.right,e.right=g.top,e.bottom=g.left;break;case 8:e.left=g.bottom,e.top=g.left,e.right=g.top,e.bottom=g.right}return g.orientation>4&&(e.maxWidth=g.maxHeight,e.maxHeight=g.maxWidth,e.minWidth=g.minHeight,e.minHeight=g.minWidth,e.sourceWidth=g.sourceHeight,e.sourceHeight=g.sourceWidth),e}}),function(a){"use strict";"function"==typeof define&&define.amd?define(["load-image"],a):a(window.loadImage)}(function(a){"use strict";var b=window.Blob&&(Blob.prototype.slice||Blob.prototype.webkitSlice||Blob.prototype.mozSlice);a.blobSlice=b&&function(){var a=this.slice||this.webkitSlice||this.mozSlice;return a.apply(this,arguments)},a.metaDataParsers={jpeg:{65505:[]}},a.parseMetaData=function(b,c,d){d=d||{};var e=this,f=d.maxMetaDataSize||262144,g={},h=!(window.DataView&&b&&b.size>=12&&"image/jpeg"===b.type&&a.blobSlice);(h||!a.readFile(a.blobSlice.call(b,0,f),function(b){if(b.target.error)return console.log(b.target.error),void c(g);var f,h,i,j,k=b.target.result,l=new DataView(k),m=2,n=l.byteLength-4,o=m;if(65496===l.getUint16(0)){for(;n>m&&(f=l.getUint16(m),f>=65504&&65519>=f||65534===f);){if(h=l.getUint16(m+2)+2,m+h>l.byteLength){console.log("Invalid meta data: Invalid segment size.");break}if(i=a.metaDataParsers.jpeg[f])for(j=0;j<i.length;j+=1)i[j].call(e,l,m,h,g,d);m+=h,o=m}!d.disableImageHead&&o>6&&(g.imageHead=k.slice?k.slice(0,o):new Uint8Array(k).subarray(0,o))}else console.log("Invalid JPEG file: Missing JPEG marker.");c(g)},"readAsArrayBuffer"))&&c(g)}}),function(a){"use strict";"function"==typeof define&&define.amd?define(["load-image","load-image-meta"],a):a(window.loadImage)}(function(a){"use strict";a.ExifMap=function(){return this},a.ExifMap.prototype.map={Orientation:274},a.ExifMap.prototype.get=function(a){return this[a]||this[this.map[a]]},a.getExifThumbnail=function(a,b,c){var d,e,f;if(!c||b+c>a.byteLength)return void console.log("Invalid Exif data: Invalid thumbnail data.");for(d=[],e=0;c>e;e+=1)f=a.getUint8(b+e),d.push((16>f?"0":"")+f.toString(16));return"data:image/jpeg,%"+d.join("%")},a.exifTagTypes={1:{getValue:function(a,b){return a.getUint8(b)},size:1},2:{getValue:function(a,b){return String.fromCharCode(a.getUint8(b))},size:1,ascii:!0},3:{getValue:function(a,b,c){return a.getUint16(b,c)},size:2},4:{getValue:function(a,b,c){return a.getUint32(b,c)},size:4},5:{getValue:function(a,b,c){return a.getUint32(b,c)/a.getUint32(b+4,c)},size:8},9:{getValue:function(a,b,c){return a.getInt32(b,c)},size:4},10:{getValue:function(a,b,c){return a.getInt32(b,c)/a.getInt32(b+4,c)},size:8}},a.exifTagTypes[7]=a.exifTagTypes[1],a.getExifValue=function(b,c,d,e,f,g){var h,i,j,k,l,m,n=a.exifTagTypes[e];if(!n)return void console.log("Invalid Exif data: Invalid tag type.");if(h=n.size*f,i=h>4?c+b.getUint32(d+8,g):d+8,i+h>b.byteLength)return void console.log("Invalid Exif data: Invalid data offset.");if(1===f)return n.getValue(b,i,g);for(j=[],k=0;f>k;k+=1)j[k]=n.getValue(b,i+k*n.size,g);if(n.ascii){for(l="",k=0;k<j.length&&(m=j[k],"\x00"!==m);k+=1)l+=m;return l}return j},a.parseExifTag=function(b,c,d,e,f){var g=b.getUint16(d,e);f.exif[g]=a.getExifValue(b,c,d,b.getUint16(d+2,e),b.getUint32(d+4,e),e)},a.parseExifTags=function(a,b,c,d,e){var f,g,h;if(c+6>a.byteLength)return void console.log("Invalid Exif data: Invalid directory offset.");if(f=a.getUint16(c,d),g=c+2+12*f,g+4>a.byteLength)return void console.log("Invalid Exif data: Invalid directory size.");for(h=0;f>h;h+=1)this.parseExifTag(a,b,c+2+12*h,d,e);return a.getUint32(g,d)},a.parseExifData=function(b,c,d,e,f){if(!f.disableExif){var g,h,i,j=c+10;if(1165519206===b.getUint32(c+4)){if(j+8>b.byteLength)return void console.log("Invalid Exif data: Invalid segment size.");if(0!==b.getUint16(c+8))return void console.log("Invalid Exif data: Missing byte alignment offset.");switch(b.getUint16(j)){case 18761:g=!0;break;case 19789:g=!1;break;default:return void console.log("Invalid Exif data: Invalid byte alignment marker.")}if(42!==b.getUint16(j+2,g))return void console.log("Invalid Exif data: Missing TIFF marker.");h=b.getUint32(j+4,g),e.exif=new a.ExifMap,h=a.parseExifTags(b,j,j+h,g,e),h&&!f.disableExifThumbnail&&(i={exif:{}},h=a.parseExifTags(b,j,j+h,g,i),i.exif[513]&&(e.exif.Thumbnail=a.getExifThumbnail(b,j+i.exif[513],i.exif[514]))),e.exif[34665]&&!f.disableExifSub&&a.parseExifTags(b,j,j+e.exif[34665],g,e),e.exif[34853]&&!f.disableExifGps&&a.parseExifTags(b,j,j+e.exif[34853],g,e)}}},a.metaDataParsers.jpeg[65505].push(a.parseExifData)}),function(a){"use strict";"function"==typeof define&&define.amd?define(["load-image","load-image-exif"],a):a(window.loadImage)}(function(a){"use strict";a.ExifMap.prototype.tags={256:"ImageWidth",257:"ImageHeight",34665:"ExifIFDPointer",34853:"GPSInfoIFDPointer",40965:"InteroperabilityIFDPointer",258:"BitsPerSample",259:"Compression",262:"PhotometricInterpretation",274:"Orientation",277:"SamplesPerPixel",284:"PlanarConfiguration",530:"YCbCrSubSampling",531:"YCbCrPositioning",282:"XResolution",283:"YResolution",296:"ResolutionUnit",273:"StripOffsets",278:"RowsPerStrip",279:"StripByteCounts",513:"JPEGInterchangeFormat",514:"JPEGInterchangeFormatLength",301:"TransferFunction",318:"WhitePoint",319:"PrimaryChromaticities",529:"YCbCrCoefficients",532:"ReferenceBlackWhite",306:"DateTime",270:"ImageDescription",271:"Make",272:"Model",305:"Software",315:"Artist",33432:"Copyright",36864:"ExifVersion",40960:"FlashpixVersion",40961:"ColorSpace",40962:"PixelXDimension",40963:"PixelYDimension",42240:"Gamma",37121:"ComponentsConfiguration",37122:"CompressedBitsPerPixel",37500:"MakerNote",37510:"UserComment",40964:"RelatedSoundFile",36867:"DateTimeOriginal",36868:"DateTimeDigitized",37520:"SubSecTime",37521:"SubSecTimeOriginal",37522:"SubSecTimeDigitized",33434:"ExposureTime",33437:"FNumber",34850:"ExposureProgram",34852:"SpectralSensitivity",34855:"PhotographicSensitivity",34856:"OECF",34864:"SensitivityType",34865:"StandardOutputSensitivity",34866:"RecommendedExposureIndex",34867:"ISOSpeed",34868:"ISOSpeedLatitudeyyy",34869:"ISOSpeedLatitudezzz",37377:"ShutterSpeedValue",37378:"ApertureValue",37379:"BrightnessValue",37380:"ExposureBias",37381:"MaxApertureValue",37382:"SubjectDistance",37383:"MeteringMode",37384:"LightSource",37385:"Flash",37396:"SubjectArea",37386:"FocalLength",41483:"FlashEnergy",41484:"SpatialFrequencyResponse",41486:"FocalPlaneXResolution",41487:"FocalPlaneYResolution",41488:"FocalPlaneResolutionUnit",41492:"SubjectLocation",41493:"ExposureIndex",41495:"SensingMethod",41728:"FileSource",41729:"SceneType",41730:"CFAPattern",41985:"CustomRendered",41986:"ExposureMode",41987:"WhiteBalance",41988:"DigitalZoomRatio",41989:"FocalLengthIn35mmFilm",41990:"SceneCaptureType",41991:"GainControl",41992:"Contrast",41993:"Saturation",41994:"Sharpness",41995:"DeviceSettingDescription",41996:"SubjectDistanceRange",42016:"ImageUniqueID",42032:"CameraOwnerName",42033:"BodySerialNumber",42034:"LensSpecification",42035:"LensMake",42036:"LensModel",42037:"LensSerialNumber",0:"GPSVersionID",1:"GPSLatitudeRef",2:"GPSLatitude",3:"GPSLongitudeRef",4:"GPSLongitude",5:"GPSAltitudeRef",6:"GPSAltitude",7:"GPSTimeStamp",8:"GPSSatellites",9:"GPSStatus",10:"GPSMeasureMode",11:"GPSDOP",12:"GPSSpeedRef",13:"GPSSpeed",14:"GPSTrackRef",15:"GPSTrack",16:"GPSImgDirectionRef",17:"GPSImgDirection",18:"GPSMapDatum",19:"GPSDestLatitudeRef",20:"GPSDestLatitude",21:"GPSDestLongitudeRef",22:"GPSDestLongitude",23:"GPSDestBearingRef",24:"GPSDestBearing",25:"GPSDestDistanceRef",26:"GPSDestDistance",27:"GPSProcessingMethod",28:"GPSAreaInformation",29:"GPSDateStamp",30:"GPSDifferential",31:"GPSHPositioningError"},a.ExifMap.prototype.stringValues={ExposureProgram:{0:"Undefined",1:"Manual",2:"Normal program",3:"Aperture priority",4:"Shutter priority",5:"Creative program",6:"Action program",7:"Portrait mode",8:"Landscape mode"},MeteringMode:{0:"Unknown",1:"Average",2:"CenterWeightedAverage",3:"Spot",4:"MultiSpot",5:"Pattern",6:"Partial",255:"Other"},LightSource:{0:"Unknown",1:"Daylight",2:"Fluorescent",3:"Tungsten (incandescent light)",4:"Flash",9:"Fine weather",10:"Cloudy weather",11:"Shade",12:"Daylight fluorescent (D 5700 - 7100K)",13:"Day white fluorescent (N 4600 - 5400K)",14:"Cool white fluorescent (W 3900 - 4500K)",15:"White fluorescent (WW 3200 - 3700K)",17:"Standard light A",18:"Standard light B",19:"Standard light C",20:"D55",21:"D65",22:"D75",23:"D50",24:"ISO studio tungsten",255:"Other"},Flash:{0:"Flash did not fire",1:"Flash fired",5:"Strobe return light not detected",7:"Strobe return light detected",9:"Flash fired, compulsory flash mode",13:"Flash fired, compulsory flash mode, return light not detected",15:"Flash fired, compulsory flash mode, return light detected",16:"Flash did not fire, compulsory flash mode",24:"Flash did not fire, auto mode",25:"Flash fired, auto mode",29:"Flash fired, auto mode, return light not detected",31:"Flash fired, auto mode, return light detected",32:"No flash function",65:"Flash fired, red-eye reduction mode",69:"Flash fired, red-eye reduction mode, return light not detected",71:"Flash fired, red-eye reduction mode, return light detected",73:"Flash fired, compulsory flash mode, red-eye reduction mode",77:"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",79:"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",89:"Flash fired, auto mode, red-eye reduction mode",93:"Flash fired, auto mode, return light not detected, red-eye reduction mode",95:"Flash fired, auto mode, return light detected, red-eye reduction mode"},SensingMethod:{1:"Undefined",2:"One-chip color area sensor",3:"Two-chip color area sensor",4:"Three-chip color area sensor",5:"Color sequential area sensor",7:"Trilinear sensor",8:"Color sequential linear sensor"},SceneCaptureType:{0:"Standard",1:"Landscape",2:"Portrait",3:"Night scene"},SceneType:{1:"Directly photographed"},CustomRendered:{0:"Normal process",1:"Custom process"},WhiteBalance:{0:"Auto white balance",1:"Manual white balance"},GainControl:{0:"None",1:"Low gain up",2:"High gain up",3:"Low gain down",4:"High gain down"},Contrast:{0:"Normal",1:"Soft",2:"Hard"},Saturation:{0:"Normal",1:"Low saturation",2:"High saturation"},Sharpness:{0:"Normal",1:"Soft",2:"Hard"},SubjectDistanceRange:{0:"Unknown",1:"Macro",2:"Close view",3:"Distant view"},FileSource:{3:"DSC"},ComponentsConfiguration:{0:"",1:"Y",2:"Cb",3:"Cr",4:"R",5:"G",6:"B"},Orientation:{1:"top-left",2:"top-right",3:"bottom-right",4:"bottom-left",5:"left-top",6:"right-top",7:"right-bottom",8:"left-bottom"}},a.ExifMap.prototype.getText=function(a){var b=this.get(a);switch(a){case"LightSource":case"Flash":case"MeteringMode":case"ExposureProgram":case"SensingMethod":case"SceneCaptureType":case"SceneType":case"CustomRendered":case"WhiteBalance":case"GainControl":case"Contrast":case"Saturation":case"Sharpness":case"SubjectDistanceRange":case"FileSource":case"Orientation":return this.stringValues[a][b];case"ExifVersion":case"FlashpixVersion":return String.fromCharCode(b[0],b[1],b[2],b[3]);case"ComponentsConfiguration":return this.stringValues[a][b[0]]+this.stringValues[a][b[1]]+this.stringValues[a][b[2]]+this.stringValues[a][b[3]];case"GPSVersionID":return b[0]+"."+b[1]+"."+b[2]+"."+b[3]}return String(b)},function(a){var b,c=a.tags,d=a.map;for(b in c)c.hasOwnProperty(b)&&(d[c[b]]=b)}(a.ExifMap.prototype),a.ExifMap.prototype.getAll=function(){var a,b,c={};for(a in this)this.hasOwnProperty(a)&&(b=this.tags[a],b&&(c[b]=this.getText(b)));return c}});
},{}],23:[function(require,module,exports){

},{}],24:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],25:[function(require,module,exports){
/*!
 * Cropper v0.1.0
 * https://github.com/fengyuanchen/cropperjs
 *
 * Copyright (c) 2015 Fengyuan Chen
 * Released under the MIT license
 *
 * Date: 2015-09-25T09:19:59.321Z
 */

(function (global, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = global.document ? factory(global, true) : function (w) {
      if (!w.document) {
        throw new Error('Cropper requires a window with a document');
      }

      return factory(w);
    };
  } else {
    factory(global);
  }
})(typeof window !== 'undefined' ? window : this, function (window, noGlobal) {

  'use strict';

  // Globals
  var document = window.document;
  var location = window.location;

  // Constants
  var NAMESPACE = 'cropper';

  // Classes
  var CLASS_MODAL = 'cropper-modal';
  var CLASS_HIDE = 'cropper-hide';
  var CLASS_HIDDEN = 'cropper-hidden';
  var CLASS_INVISIBLE = 'cropper-invisible';
  var CLASS_MOVE = 'cropper-move';
  var CLASS_CROP = 'cropper-crop';
  var CLASS_DISABLED = 'cropper-disabled';
  var CLASS_BG = 'cropper-bg';

  // Events
  var EVENT_MOUSE_DOWN = 'mousedown touchstart pointerdown MSPointerDown';
  var EVENT_MOUSE_MOVE = 'mousemove touchmove pointermove MSPointerMove';
  var EVENT_MOUSE_UP = 'mouseup touchend touchcancel pointerup pointercancel MSPointerUp MSPointerCancel';
  var EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll';
  var EVENT_DBLCLICK = 'dblclick';
  var EVENT_RESIZE = 'resize';
  var EVENT_ERROR = 'error';
  var EVENT_LOAD = 'load';

  // RegExps
  var REGEXP_ACTIONS = /^(e|w|s|n|se|sw|ne|nw|all|crop|move|zoom)$/;
  var REGEXP_SPACES = /\s+/;
  var REGEXP_TYPES = /\s([a-zA-Z]+)/;
  var REGEXP_TRIM = /^\s+(.*)\s+^/;

  // Data
  var DATA_PREVIEW = 'preview';
  var DATA_ACTION = 'action';

  // Actions
  var ACTION_EAST = 'e';
  var ACTION_WEST = 'w';
  var ACTION_SOUTH = 's';
  var ACTION_NORTH = 'n';
  var ACTION_SOUTH_EAST = 'se';
  var ACTION_SOUTH_WEST = 'sw';
  var ACTION_NORTH_EAST = 'ne';
  var ACTION_NORTH_WEST = 'nw';
  var ACTION_ALL = 'all';
  var ACTION_CROP = 'crop';
  var ACTION_MOVE = 'move';
  var ACTION_ZOOM = 'zoom';
  var ACTION_NONE = 'none';

  // Supports
  var SUPPORT_CANVAS = !!document.createElement('canvas').getContext;

  // Maths
  var sqrt = Math.sqrt;
  var min = Math.min;
  var max = Math.max;
  var abs = Math.abs;
  var sin = Math.sin;
  var cos = Math.cos;
  var num = parseFloat;

  // Prototype
  var prototype = {
    version: '0.1.0'
  };

  // Utilities
  var EMPTY_OBJECT = {};
  var toString = EMPTY_OBJECT.toString;
  var hasOwnProperty = EMPTY_OBJECT.hasOwnProperty;

  function typeOf(obj) {
    return toString.call(obj).match(REGEXP_TYPES)[1].toLowerCase();
  }

  function isString(str) {
    return typeof str === 'string';
  }

  function isNumber(num) {
    return typeof num === 'number' && !isNaN(num);
  }

  function isUndefined(obj) {
    return typeof obj === 'undefined';
  }

  function isObject(obj) {
    return typeof obj === 'object' && obj !== null;
  }

  function isPlainObject(obj) {
    var constructor;
    var prototype;

    if (!isObject(obj)) {
      return false;
    }

    try {
      constructor = obj.constructor;
      prototype = constructor.prototype;

      return constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
    } catch (e) {
      return false;
    }
  }

  function isFunction(fn) {
    return typeOf(fn) === 'function';
  }

  function isArray(arr) {
    return Array.isArray ? Array.isArray(arr) : typeOf(arr) === 'array';
  }

  function toArray(obj, offset) {
    var args = [];

    // This is necessary for IE8
    if (isNumber(offset)) {
      args.push(offset);
    }

    return args.slice.apply(obj, args);
  }

  function inArray(value, arr) {
    var index = -1;

    each(arr, function (n, i) {
      if (n === value) {
        index = i;
        return false;
      }
    });

    return index;
  }

  function trim(str) {
    if (!isString(str)) {
      str = String(str);
    }

    if (str.trim) {
      str = str.trim();
    } else {
      str = str.replace(REGEXP_TRIM, '$1');
    }

    return str;
  }

  function each(obj, callback) {
    var length;
    var i;

    if (obj && isFunction(callback)) {
      if (isArray(obj) || isNumber(obj.length)/* array-like */) {
        for (i = 0, length = obj.length; i < length; i++) {
          if (callback.call(obj, obj[i], i, obj) === false) {
            break;
          }
        }
      } else if (isObject(obj)) {
        for (i in obj) {
          if (hasOwnProperty.call(obj, i)) {
            if (callback.call(obj, obj[i], i, obj) === false) {
              break;
            }
          }
        }
      }
    }

    return obj;
  }

  function extend(obj) {
    var args = toArray(arguments);

    if (args.length > 1) {
      args.shift();
    }

    each(args, function (arg) {
      each(arg, function (prop, i) {
        obj[i] = prop;
      });
    });

    return obj;
  }

  function proxy(fn, context) {
    var args = toArray(arguments, 2);

    return function () {
      return fn.apply(context, args.concat(toArray(arguments)));
    };
  }

  function parseClass(className) {
    return trim(className).split(REGEXP_SPACES);
  }

  function hasClass(element, value) {
    return element.className.indexOf(value) > -1;
  }

  function addClass(element, value) {
    var classes;

    if (isNumber(element.length)) {
      return each(element, function (elem) {
        addClass(elem, value);
      });
    }

    classes = parseClass(element.className);

    each(parseClass(value), function (n) {
      if (inArray(n, classes) < 0) {
        classes.push(n);
      }
    });

    element.className = classes.join(' ');
  }

  function removeClass(element, value) {
    var classes;

    if (isNumber(element.length)) {
      return each(element, function (elem) {
        removeClass(elem, value);
      });
    }

    classes = parseClass(element.className);

    each(parseClass(value), function (n, i) {
      if ((i = inArray(n, classes)) > -1) {
        classes.splice(i, 1);
      }
    });

    element.className = classes.join(' ');
  }

  function toggleClass(element, value, added) {
    return added ? addClass(element, value) : removeClass(element, value);
  }

  function getData(element, name) {
    if (isObject(element[name])) {
      return element[name];
    } else if (element.dataset) {
      return element.dataset[name];
    } else {
      return element.getAttribute('data-' + name);
    }
  }

  function setData(element, name, data) {
    if (isObject(data) && isUndefined(element[name])) {
      element[name] = data;
    } else if (element.dataset) {
      element.dataset[name] = data;
    } else {
      element.setAttribute('data-' + name, data);
    }
  }

  function removeData(element, name) {
    if (isObject(element[name])) {
      delete element[name];
    } else if (element.dataset) {
      delete element.dataset[name];
    } else {
      element.removeAttribute('data-' + name);
    }
  }

  function addListener(element, type, handler) {
    var types;

    if (!isFunction(handler)) {
      return;
    }

    types = trim(type).split(REGEXP_SPACES);

    if (types.length > 1) {
      return each(types, function (type) {
        addListener(element, type, handler);
      });
    }

    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler);
    }
  }

  function removeListener(element, type, handler) {
    var types;

    if (!isFunction(handler)) {
      return;
    }

    types = trim(type).split(REGEXP_SPACES);

    if (types.length > 1) {
      return each(types, function (type) {
        removeListener(element, type, handler);
      });
    }

    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
      element.detachEvent('on' + type, handler);
    }
  }

  function preventDefault(e) {
    if (e) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    }
  }

  function getEvent(event) {
    var e = event || window.event;
    var doc;

    // Fix target property (IE8)
    if (!e.target) {
      e.target = e.srcElement || document;
    }

    if (!isNumber(e.pageX)) {
      doc = document.documentElement;
      e.pageX = e.clientX + (window.scrollX || doc && doc.scrollLeft || 0) - (doc && doc.clientLeft || 0);
      e.pageY = e.clientY + (window.scrollY || doc && doc.scrollTop || 0) - (doc && doc.clientTop || 0);
    }

    return e;
  }

  function getOffset(element) {
    var doc = document.documentElement;
    var box = element.getBoundingClientRect();

    return {
      left: box.left + (window.scrollX || doc && doc.scrollLeft || 0) - (doc && doc.clientLeft || 0),
      top: box.top  + (window.scrollY || doc && doc.scrollTop || 0)  - (doc && doc.clientTop  || 0)
    };
  }

  function querySelector(element, selector) {
    return element.querySelector(selector);
  }

  function querySelectorAll(element, selector) {
    return element.querySelectorAll(selector);
  }

  function insertBefore(element, elem) {
    element.parentNode.insertBefore(elem, element);
  }

  function appendChild(element, elem) {
    element.appendChild(elem);
  }

  function removeChild(element) {
    element.parentNode.removeChild(element);
  }

  function empty(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function isCrossOriginURL(url) {
    var parts = url.match(/^(https?:)\/\/([^\:\/\?#]+):?(\d*)/i);

    return parts && (
      parts[1] !== location.protocol ||
      parts[2] !== location.hostname ||
      parts[3] !== location.port
    );
  }

  function addTimestamp(url) {
    var timestamp = 'timestamp=' + (new Date()).getTime();

    return (url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp);
  }

  function getImageSize(image, callback) {
    var newImage;

    // Modern browsers
    if (image.naturalWidth) {
      return callback(image.naturalWidth, image.naturalHeight);
    }

    // IE8: Don't use `new Image()` here
    newImage = document.createElement('img');

    newImage.onload = function () {
      callback(this.width, this.height);
    };

    newImage.src = image.src;
  }

  function getTransform(options) {
    var transforms = [];
    var rotate = options.rotate;
    var scaleX = options.scaleX;
    var scaleY = options.scaleY;

    if (isNumber(rotate)) {
      transforms.push('rotate(' + rotate + 'deg)');
    }

    if (isNumber(scaleX) && isNumber(scaleY)) {
      transforms.push('scale(' + scaleX + ',' + scaleY + ')');
    }

    return transforms.length ? transforms.join(' ') : 'none';
  }

  function getRotatedSizes(data, reverse) {
    var deg = abs(data.degree) % 180;
    var arc = (deg > 90 ? (180 - deg) : deg) * Math.PI / 180;
    var sinArc = sin(arc);
    var cosArc = cos(arc);
    var width = data.width;
    var height = data.height;
    var aspectRatio = data.aspectRatio;
    var newWidth;
    var newHeight;

    if (!reverse) {
      newWidth = width * cosArc + height * sinArc;
      newHeight = width * sinArc + height * cosArc;
    } else {
      newWidth = width / (cosArc + sinArc / aspectRatio);
      newHeight = newWidth / aspectRatio;
    }

    return {
      width: newWidth,
      height: newHeight
    };
  }

  function getSourceCanvas(image, data) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var x = 0;
    var y = 0;
    var width = data.naturalWidth;
    var height = data.naturalHeight;
    var rotate = data.rotate;
    var scaleX = data.scaleX;
    var scaleY = data.scaleY;
    var scalable = isNumber(scaleX) && isNumber(scaleY) && (scaleX !== 1 || scaleY !== 1);
    var rotatable = isNumber(rotate) && rotate !== 0;
    var advanced = rotatable || scalable;
    var canvasWidth = width;
    var canvasHeight = height;
    var translateX;
    var translateY;
    var rotated;

    if (scalable) {
      translateX = width / 2;
      translateY = height / 2;
    }

    if (rotatable) {
      rotated = getRotatedSizes({
        width: width,
        height: height,
        degree: rotate
      });

      canvasWidth = rotated.width;
      canvasHeight = rotated.height;
      translateX = rotated.width / 2;
      translateY = rotated.height / 2;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    if (advanced) {
      x = -width / 2;
      y = -height / 2;

      context.save();
      context.translate(translateX, translateY);
    }

    if (rotatable) {
      context.rotate(rotate * Math.PI / 180);
    }

    // Should call `scale` after rotated
    if (scalable) {
      context.scale(scaleX, scaleY);
    }

    context.drawImage(image, x, y, width, height);

    if (advanced) {
      context.restore();
    }

    return canvas;
  }

  function Cropper(element, options) {
    this.element = element;
    this.options = extend({}, Cropper.DEFAULTS, isPlainObject(options) && options);
    this.ready = false;
    this.built = false;
    this.complete = false;
    this.rotated = false;
    this.cropped = false;
    this.disabled = false;
    this.replaced = false;
    this.isImg = false;
    this.originalUrl = '';
    this.canvasData = null;
    this.cropBoxData = null;
    this.previews = null;
    this.init();
  }

  extend(prototype, {
    init: function () {
      var element = this.element;
      var tagName = element.tagName.toLowerCase();
      var url;

      if (getData(element, NAMESPACE)) {
        return;
      }

      setData(element, NAMESPACE, this);

      if (tagName === 'img') {
        this.isImg = true;

        // Should use `fn.attr` here. e.g.: "img/picture.jpg"
        this.originalUrl = url = element.getAttribute('src');

        // Stop when it's a blank image
        if (!url) {
          return;
        }

        // Should use `fn.prop` here. e.g.: "http://example.com/img/picture.jpg"
        url = element.src;
      } else if (tagName === 'canvas' && SUPPORT_CANVAS) {
        url = element.toDataURL();
      }

      this.load(url);
    },

    load: function (url) {
      var options = this.options;
      var element = this.element;
      var crossOrigin;
      var bustCacheUrl;
      var image;
      var start;
      var stop;

      if (!url) {
        return;
      }

      this.url = url;

      if (isFunction(options.build) && options.build.call(element) === false) {
        return;
      }

      if (options.checkImageOrigin && isCrossOriginURL(url)) {
        crossOrigin = 'anonymous';

        if (!element.crossOrigin) {
          bustCacheUrl = addTimestamp(url);
        }
      }

      image = document.createElement('img');

      if (crossOrigin) {
        image.crossOrigin = crossOrigin;
      }

      image.src = bustCacheUrl || url;
      this.image = image;
      this._start = start = proxy(this.start, this);
      this._stop = stop = proxy(this.stop, this);

      if (this.isImg) {
        if (element.complete) {
          this.start();
        } else {
          addListener(element, EVENT_LOAD, start);
        }
      } else {
        addListener(image, EVENT_LOAD, start);
        addListener(image, EVENT_ERROR, stop);
        addClass(image, CLASS_HIDE);
        insertBefore(element, image);
      }
    },

    start: function (event) {
      var image = this.isImg ? this.element : this.image;

      if (event) {
        removeListener(image, EVENT_LOAD, this._start);
        removeListener(image, EVENT_ERROR, this._stop);
      }

      getImageSize(image, proxy(function (naturalWidth, naturalHeight) {
        this.imageData = {
          naturalWidth: naturalWidth,
          naturalHeight: naturalHeight,
          aspectRatio: naturalWidth / naturalHeight
        };

        this.ready = true;
        this.build();
      }, this));
    },

    stop: function () {
      var image = this.image;

      removeListener(image, EVENT_LOAD, this._start);
      removeListener(image, EVENT_ERROR, this._stop);

      removeChild(image);
      this.image = null;
    }
  });

  extend(prototype, {
    build: function () {
      var options = this.options;
      var element = this.element;
      var image = this.image;
      var template;
      var cropper;
      var canvas;
      var dragBox;
      var cropBox;
      var face;

      if (!this.ready) {
        return;
      }

      // Unbuild first when replace
      if (this.built) {
        this.unbuild();
      }

      template = document.createElement('div');
      template.innerHTML = Cropper.TEMPLATE;

      // Create cropper elements
      this.container = element.parentNode;
      this.cropper = cropper = querySelector(template, '.cropper-container');
      this.canvas = canvas = querySelector(cropper, '.cropper-canvas');
      this.dragBox = dragBox = querySelector(cropper, '.cropper-drag-box');
      this.cropBox = cropBox = querySelector(cropper, '.cropper-crop-box');
      this.viewBox = querySelector(cropper, '.cropper-view-box');
      this.face = face = querySelector(cropBox, '.cropper-face');

      appendChild(canvas, image);

      // Hide the original image
      addClass(element, CLASS_HIDDEN);
      insertBefore(element, cropper);

      // Show the image if is hidden
      if (!this.isImg) {
        removeClass(image, CLASS_HIDE);
      }

      this.initPreview();
      this.bind();

      // Format aspect ratio (0 -> NaN)
      options.aspectRatio = num(options.aspectRatio) || NaN;

      if (options.autoCrop) {
        this.cropped = true;

        if (options.modal) {
          addClass(dragBox, CLASS_MODAL);
        }
      } else {
        addClass(cropBox, CLASS_HIDDEN);
      }

      if (!options.guides) {
        addClass(querySelectorAll(cropBox, '.cropper-dashed'), CLASS_HIDDEN);
      }

      if (!options.center) {
        addClass(querySelector(cropBox, '.cropper-center'), CLASS_HIDDEN);
      }

      if (options.background) {
        addClass(cropper, CLASS_BG);
      }

      if (!options.highlight) {
        addClass(face, CLASS_INVISIBLE);
      }

      if (options.cropBoxMovable) {
        addClass(face, CLASS_MOVE);
        setData(face, DATA_ACTION, ACTION_ALL);
      }

      if (!options.cropBoxResizable) {
        addClass(querySelectorAll(cropBox, '.cropper-line'), CLASS_HIDDEN);
        addClass(querySelectorAll(cropBox, '.cropper-point'), CLASS_HIDDEN);
      }

      this.setDragMode(
        options.dragCrop ? ACTION_CROP :
        options.movable ? ACTION_MOVE :
        ACTION_NONE
      );

      this.render();
      this.built = true;
      this.setData(options.data);

      // Call the built asynchronously to keep "image.cropper" is defined
      setTimeout(proxy(function () {
        if (isFunction(options.built)) {
          options.built.call(element);
        }

        if (isFunction(options.crop)) {
          options.crop.call(element, this.getData());
        }

        this.complete = true;
      }, this), 0);
    },

    unbuild: function () {
      if (!this.built) {
        return;
      }

      this.built = false;
      this.initialImageData = null;

      // Clear `initialCanvasData` is necessary when replace
      this.initialCanvasData = null;
      this.initialCropBoxData = null;
      this.containerData = null;
      this.canvasData = null;

      // Clear `cropBoxData` is necessary when replace
      this.cropBoxData = null;
      this.unbind();

      this.resetPreview();
      this.previews = null;

      this.viewBox = null;
      this.cropBox = null;
      this.dragBox = null;
      this.canvas = null;
      this.container = null;

      removeChild(this.cropper);
      this.cropper = null;
    }
  });

  extend(prototype, {
    render: function () {
      this.initContainer();
      this.initCanvas();
      this.initCropBox();

      this.renderCanvas();

      if (this.cropped) {
        this.renderCropBox();
      }
    },

    initContainer: function () {
      var options = this.options;
      var element = this.element;
      var container = this.container;
      var cropper = this.cropper;
      var containerData;

      addClass(cropper, CLASS_HIDDEN);
      removeClass(element, CLASS_HIDDEN);

      this.containerData = containerData = {
        width: max(container.offsetWidth, num(options.minContainerWidth) || 200),
        height: max(container.offsetHeight, num(options.minContainerHeight) || 100)
      };

      cropper.style.cssText = (
        'width:' + containerData.width + 'px;' +
        'height:' + containerData.height + 'px'
      );

      addClass(element, CLASS_HIDDEN);
      removeClass(cropper, CLASS_HIDDEN);
    },

    // Canvas (image wrapper)
    initCanvas: function () {
      var containerData = this.containerData;
      var containerWidth = containerData.width;
      var containerHeight = containerData.height;
      var imageData = this.imageData;
      var aspectRatio = imageData.aspectRatio;
      var canvasData = {
            aspectRatio: aspectRatio,
            width: containerWidth,
            height: containerHeight
          };

      if (containerHeight * aspectRatio > containerWidth) {
        canvasData.height = containerWidth / aspectRatio;
      } else {
        canvasData.width = containerHeight * aspectRatio;
      }

      canvasData.oldLeft = canvasData.left = (containerWidth - canvasData.width) / 2;
      canvasData.oldTop = canvasData.top = (containerHeight - canvasData.height) / 2;

      this.canvasData = canvasData;
      this.limitCanvas(true, true);
      this.initialImageData = extend({}, imageData);
      this.initialCanvasData = extend({}, canvasData);
    },

    limitCanvas: function (size, position) {
      var options = this.options;
      var strict = options.strict;
      var containerData = this.containerData;
      var containerWidth = containerData.width;
      var containerHeight = containerData.height;
      var canvasData = this.canvasData;
      var aspectRatio = canvasData.aspectRatio;
      var cropBoxData = this.cropBoxData;
      var cropped = this.cropped && cropBoxData;
      var initialCanvasData = this.initialCanvasData || canvasData;
      var initialCanvasWidth = initialCanvasData.width;
      var initialCanvasHeight = initialCanvasData.height;
      var minCanvasWidth;
      var minCanvasHeight;

      if (size) {
        minCanvasWidth = num(options.minCanvasWidth) || 0;
        minCanvasHeight = num(options.minCanvasHeight) || 0;

        if (minCanvasWidth) {
          if (strict) {
            minCanvasWidth = max(
              cropped ? cropBoxData.width : initialCanvasWidth,
              minCanvasWidth
            );
          }

          minCanvasHeight = minCanvasWidth / aspectRatio;
        } else if (minCanvasHeight) {
          if (strict) {
            minCanvasHeight = max(
              cropped ? cropBoxData.height : initialCanvasHeight,
              minCanvasHeight
            );
          }

          minCanvasWidth = minCanvasHeight * aspectRatio;
        } else if (strict) {
          if (cropped) {
            minCanvasWidth = cropBoxData.width;
            minCanvasHeight = cropBoxData.height;

            if (minCanvasHeight * aspectRatio > minCanvasWidth) {
              minCanvasWidth = minCanvasHeight * aspectRatio;
            } else {
              minCanvasHeight = minCanvasWidth / aspectRatio;
            }
          } else {
            minCanvasWidth = initialCanvasWidth;
            minCanvasHeight = initialCanvasHeight;
          }
        }

        extend(canvasData, {
          minWidth: minCanvasWidth,
          minHeight: minCanvasHeight,
          maxWidth: Infinity,
          maxHeight: Infinity
        });
      }

      if (position) {
        if (strict) {
          if (cropped) {
            canvasData.minLeft = min(
              cropBoxData.left,
              cropBoxData.left + cropBoxData.width - canvasData.width
            );
            canvasData.minTop = min(
              cropBoxData.top,
              cropBoxData.top + cropBoxData.height - canvasData.height
            );
            canvasData.maxLeft = cropBoxData.left;
            canvasData.maxTop = cropBoxData.top;
          } else {
            canvasData.minLeft = min(0, containerWidth - canvasData.width);
            canvasData.minTop = min(0, containerHeight - canvasData.height);
            canvasData.maxLeft = max(0, containerWidth - canvasData.width);
            canvasData.maxTop = max(0, containerHeight - canvasData.height);
          }
        } else {
          canvasData.minLeft = -canvasData.width;
          canvasData.minTop = -canvasData.height;
          canvasData.maxLeft = containerWidth;
          canvasData.maxTop = containerHeight;
        }
      }
    },

    renderCanvas: function (changed) {
      var options = this.options;
      var canvasData = this.canvasData;
      var imageData = this.imageData;
      var aspectRatio;
      var rotated;

      if (this.rotated) {
        this.rotated = false;

        // Computes rotated sizes with image sizes
        rotated = getRotatedSizes({
          width: imageData.width,
          height: imageData.height,
          degree: imageData.rotate
        });

        aspectRatio = rotated.width / rotated.height;

        if (aspectRatio !== canvasData.aspectRatio) {
          canvasData.left -= (rotated.width - canvasData.width) / 2;
          canvasData.top -= (rotated.height - canvasData.height) / 2;
          canvasData.width = rotated.width;
          canvasData.height = rotated.height;
          canvasData.aspectRatio = aspectRatio;
          this.limitCanvas(true, false);
        }
      }

      if (canvasData.width > canvasData.maxWidth || canvasData.width < canvasData.minWidth) {
        canvasData.left = canvasData.oldLeft;
      }

      if (canvasData.height > canvasData.maxHeight || canvasData.height < canvasData.minHeight) {
        canvasData.top = canvasData.oldTop;
      }

      canvasData.width = min(
        max(canvasData.width, canvasData.minWidth),
        canvasData.maxWidth
      );
      canvasData.height = min(
        max(canvasData.height, canvasData.minHeight),
        canvasData.maxHeight
      );

      this.limitCanvas(false, true);

      canvasData.oldLeft = canvasData.left = min(
        max(canvasData.left, canvasData.minLeft),
        canvasData.maxLeft
      );
      canvasData.oldTop = canvasData.top = min(
        max(canvasData.top, canvasData.minTop),
        canvasData.maxTop
      );

      this.canvas.style.cssText = (
        'width:' + canvasData.width + 'px;' +
        'height:' + canvasData.height + 'px;' +
        'left:' + canvasData.left + 'px;' +
        'top:' + canvasData.top + 'px;'
      );

      this.renderImage();

      if (this.cropped && options.strict) {
        this.limitCropBox(true, true);
      }

      if (changed) {
        this.output();
      }
    },

    renderImage: function (changed) {
      var canvasData = this.canvasData;
      var imageData = this.imageData;
      var reversed;

      if (imageData.rotate) {
        reversed = getRotatedSizes({
          width: canvasData.width,
          height: canvasData.height,
          degree: imageData.rotate,
          aspectRatio: imageData.aspectRatio
        }, true);
      }

      extend(imageData, reversed ? {
        width: reversed.width,
        height: reversed.height,
        left: (canvasData.width - reversed.width) / 2,
        top: (canvasData.height - reversed.height) / 2
      } : {
        width: canvasData.width,
        height: canvasData.height,
        left: 0,
        top: 0
      });

      this.image.style.cssText = (
        'width:' + imageData.width + 'px;' +
        'height:' + imageData.height + 'px;' +
        'margin-left:' + imageData.left + 'px;' +
        'margin-top:' + imageData.top + 'px;' +
        'transform:' + getTransform(imageData)
      );

      if (changed) {
        this.output();
      }
    },

    initCropBox: function () {
      var options = this.options;
      var aspectRatio = options.aspectRatio;
      var autoCropArea = num(options.autoCropArea) || 0.8;
      var canvasData = this.canvasData;
      var cropBoxData = {
            width: canvasData.width,
            height: canvasData.height
          };

      if (aspectRatio) {
        if (canvasData.height * aspectRatio > canvasData.width) {
          cropBoxData.height = cropBoxData.width / aspectRatio;
        } else {
          cropBoxData.width = cropBoxData.height * aspectRatio;
        }
      }

      this.cropBoxData = cropBoxData;
      this.limitCropBox(true, true);

      // Initialize auto crop area
      cropBoxData.width = min(
        max(cropBoxData.width, cropBoxData.minWidth),
        cropBoxData.maxWidth
      );
      cropBoxData.height = min(
        max(cropBoxData.height, cropBoxData.minHeight),
        cropBoxData.maxHeight
      );

      // The width/height of auto crop area must large than "minWidth/Height"
      cropBoxData.width = max(
        cropBoxData.minWidth,
        cropBoxData.width * autoCropArea
      );
      cropBoxData.height = max(
        cropBoxData.minHeight,
        cropBoxData.height * autoCropArea
      );
      cropBoxData.oldLeft = cropBoxData.left = canvasData.left + (canvasData.width - cropBoxData.width) / 2;
      cropBoxData.oldTop = cropBoxData.top = canvasData.top + (canvasData.height - cropBoxData.height) / 2;

      this.initialCropBoxData = extend({}, cropBoxData);
    },

    limitCropBox: function (size, position) {
      var options = this.options;
      var strict = options.strict;
      var containerData = this.containerData;
      var containerWidth = containerData.width;
      var containerHeight = containerData.height;
      var canvasData = this.canvasData;
      var cropBoxData = this.cropBoxData;
      var aspectRatio = options.aspectRatio;
      var minCropBoxWidth;
      var minCropBoxHeight;

      if (size) {
        minCropBoxWidth = num(options.minCropBoxWidth) || 0;
        minCropBoxHeight = num(options.minCropBoxHeight) || 0;

        // The "min/maxCropBoxWidth/Height" must less than container width/height
        cropBoxData.minWidth = min(containerWidth, minCropBoxWidth);
        cropBoxData.minHeight = min(containerHeight, minCropBoxHeight);
        cropBoxData.maxWidth = min(
          containerWidth,
          strict ? canvasData.width : containerWidth
        );
        cropBoxData.maxHeight = min(
          containerHeight,
          strict ? canvasData.height : containerHeight
        );

        if (aspectRatio) {

          // Compare crop box size with container first
          if (cropBoxData.maxHeight * aspectRatio > cropBoxData.maxWidth) {
            cropBoxData.minHeight = cropBoxData.minWidth / aspectRatio;
            cropBoxData.maxHeight = cropBoxData.maxWidth / aspectRatio;
          } else {
            cropBoxData.minWidth = cropBoxData.minHeight * aspectRatio;
            cropBoxData.maxWidth = cropBoxData.maxHeight * aspectRatio;
          }
        }

        // The "minWidth/Height" must be less than "maxWidth/Height"
        cropBoxData.minWidth = min(cropBoxData.maxWidth, cropBoxData.minWidth);
        cropBoxData.minHeight = min(cropBoxData.maxHeight, cropBoxData.minHeight);
      }

      if (position) {
        if (strict) {
          cropBoxData.minLeft = max(0, canvasData.left);
          cropBoxData.minTop = max(0, canvasData.top);
          cropBoxData.maxLeft = min(containerWidth, canvasData.left + canvasData.width) - cropBoxData.width;
          cropBoxData.maxTop = min(containerHeight, canvasData.top + canvasData.height) - cropBoxData.height;
        } else {
          cropBoxData.minLeft = 0;
          cropBoxData.minTop = 0;
          cropBoxData.maxLeft = containerWidth - cropBoxData.width;
          cropBoxData.maxTop = containerHeight - cropBoxData.height;
        }
      }
    },

    renderCropBox: function () {
      var options = this.options;
      var containerData = this.containerData;
      var containerWidth = containerData.width;
      var containerHeight = containerData.height;
      var cropBoxData = this.cropBoxData;

      if (cropBoxData.width > cropBoxData.maxWidth || cropBoxData.width < cropBoxData.minWidth) {
        cropBoxData.left = cropBoxData.oldLeft;
      }

      if (cropBoxData.height > cropBoxData.maxHeight || cropBoxData.height < cropBoxData.minHeight) {
        cropBoxData.top = cropBoxData.oldTop;
      }

      cropBoxData.width = min(
        max(cropBoxData.width, cropBoxData.minWidth),
        cropBoxData.maxWidth
      );
      cropBoxData.height = min(
        max(cropBoxData.height, cropBoxData.minHeight),
        cropBoxData.maxHeight
      );

      this.limitCropBox(false, true);

      cropBoxData.oldLeft = cropBoxData.left = min(
        max(cropBoxData.left, cropBoxData.minLeft),
        cropBoxData.maxLeft
      );
      cropBoxData.oldTop = cropBoxData.top = min(
        max(cropBoxData.top, cropBoxData.minTop),
        cropBoxData.maxTop
      );

      if (options.movable && options.cropBoxDataMovable) {

        // Turn to move the canvas when the crop box is equal to the container
        setData(this.face, DATA_ACTION, (cropBoxData.width === containerWidth && cropBoxData.height === containerHeight) ? ACTION_MOVE : ACTION_ALL);
      }

      this.cropBox.style.cssText = (
        'width:' + cropBoxData.width + 'px;' +
        'height:' + cropBoxData.height + 'px;' +
        'left:' + cropBoxData.left + 'px;' +
        'top:' + cropBoxData.top + 'px;'
      );

      if (this.cropped && options.strict) {
        this.limitCanvas(true, true);
      }

      if (!this.disabled) {
        this.output();
      }
    },

    output: function () {
      var options = this.options;

      this.preview();

      if (this.complete && isFunction(options.crop)) {
        options.crop.call(this.element, this.getData());
      }
    }
  });

  extend(prototype, {
    initPreview: function () {
      var preview = this.options.preview;
      var url = this.url;
      var image = document.createElement('img');
      var previews;

      image.src = url;
      appendChild(this.viewBox, image);

      if (!preview) {
        return;
      }

      this.previews = previews = querySelectorAll(document, preview);
      each(previews, function (element) {
        var image = document.createElement('img');

        // Save the original size for recover
        setData(element, DATA_PREVIEW, {
          width: element.offsetWidth,
          height: element.offsetHeight,
          html: element.innerHTML
        });

        image.src = url;

        /**
         * Override img element styles
         * Add `display:block` to avoid margin top issue
         * Add `height:auto` to override `height` attribute on IE8
         * (Occur only when margin-top <= -height)
         */
        image.style.cssText = (
          'display:block;width:100%;height:auto;' +
          'min-width:0!important;min-height:0!important;' +
          'max-width:none!important;max-height:none!important;' +
          'image-orientation:0deg!important"'
        );

        empty(element);
        appendChild(element, image);
      });
    },

    resetPreview: function () {
      each(this.previews, function (element) {
        element.innerHTML = getData(element, DATA_PREVIEW).html;
        removeData(element, DATA_PREVIEW);
      });
    },

    preview: function () {
      var imageData = this.imageData;
      var canvasData = this.canvasData;
      var cropBoxData = this.cropBoxData;
      var cropBoxWidth = cropBoxData.width;
      var cropBoxHeight = cropBoxData.height;
      var width = imageData.width;
      var height = imageData.height;
      var left = cropBoxData.left - canvasData.left - imageData.left;
      var top = cropBoxData.top - canvasData.top - imageData.top;

      if (!this.cropped || this.disabled) {
        return;
      }

      querySelector(this.viewBox, 'img').style.cssText = (
        'width:' + width + 'px;' +
        'height:' + height + 'px;' +
        'margin-left:' + -left + 'px;' +
        'margin-top:' + -top + 'px;' +
        'transform:' + getTransform(imageData)
      );

      each(this.previews, function (element) {
        var data = getData(element, DATA_PREVIEW);
        var originalWidth = data.width;
        var originalHeight = data.height;
        var newWidth = originalWidth;
        var newHeight = originalHeight;
        var ratio = 1;
        var elementStyle = element.style;
        var imageStyle = querySelector(element, 'img').style;

        if (cropBoxWidth) {
          ratio = originalWidth / cropBoxWidth;
          newHeight = cropBoxHeight * ratio;
        }

        if (cropBoxHeight && newHeight > originalHeight) {
          ratio = originalHeight / cropBoxHeight;
          newWidth = cropBoxWidth * ratio;
          newHeight = originalHeight;
        }

        elementStyle.width = newWidth + 'px';
        elementStyle.height = newHeight + 'px';
        imageStyle.width = width * ratio + 'px';
        imageStyle.height = height * ratio + 'px';
        imageStyle.marginLeft = -left * ratio + 'px';
        imageStyle.marginTop = -top * ratio + 'px';
        imageStyle.transform = getTransform(imageData);
      });
    }
  });

  extend(prototype, {
    bind: function () {
      var options = this.options;
      var cropper = this.cropper;

      addListener(cropper, EVENT_MOUSE_DOWN, proxy(this.cropStart, this));

      if (options.zoomable && options.mouseWheelZoom) {
        addListener(cropper, EVENT_WHEEL, proxy(this.wheel, this));
      }

      if (options.doubleClickToggle) {
        addListener(cropper, EVENT_DBLCLICK, proxy(this.dblclick, this));
      }

      addListener(document, EVENT_MOUSE_MOVE, (this._cropMove = proxy(this.cropMove, this)));
      addListener(document, EVENT_MOUSE_UP, (this._cropEnd = proxy(this.cropEnd, this)));

      if (options.responsive) {
        addListener(window, EVENT_RESIZE, (this._resize = proxy(this.resize, this)));
      }
    },

    unbind: function () {
      var options = this.options;
      var cropper = this.cropper;

      removeListener(cropper, EVENT_MOUSE_DOWN, this.cropStart);

      if (options.zoomable && options.mouseWheelZoom) {
        removeListener(cropper, EVENT_WHEEL, this.wheel);
      }

      if (options.doubleClickToggle) {
        removeListener(cropper, EVENT_DBLCLICK, this.dblclick);
      }

      removeListener(document, EVENT_MOUSE_MOVE, this._cropMove);
      removeListener(document, EVENT_MOUSE_UP, this._cropEnd);

      if (options.responsive) {
        removeListener(window, EVENT_RESIZE, this._resize);
      }
    }
  });

  extend(prototype, {
    resize: function () {
      var container = this.container;
      var containerData = this.containerData;
      var canvasData;
      var cropBoxData;
      var ratio;

      // Check `container` is necessary for IE8
      if (this.disabled || !containerData) {
        return;
      }

      ratio = container.offsetWidth / containerData.width;

      // Resize when width changed or height changed
      if (ratio !== 1 || container.offsetHeight !== containerData.height) {
        canvasData = this.getCanvasData();
        cropBoxData = this.getCropBoxData();

        this.render();
        this.setCanvasData(each(canvasData, function (n, i) {
          canvasData[i] = n * ratio;
        }));
        this.setCropBoxData(each(cropBoxData, function (n, i) {
          cropBoxData[i] = n * ratio;
        }));
      }
    },

    dblclick: function () {
      if (this.disabled) {
        return;
      }

      this.setDragMode(hasClass(this.dragBox, CLASS_CROP) ? ACTION_MOVE : ACTION_CROP);
    },

    wheel: function (event) {
      var e = getEvent(event);
      var ratio = num(this.options.wheelZoomRatio) || 0.1;
      var delta = 1;

      if (this.disabled) {
        return;
      }

      preventDefault(e);

      if (e.deltaY) {
        delta = e.deltaY > 0 ? 1 : -1;
      } else if (e.wheelDelta) {
        delta = -e.wheelDelta / 120;
      } else if (e.detail) {
        delta = e.detail > 0 ? 1 : -1;
      }

      this.zoom(-delta * ratio, e);
    },

    cropStart: function (event) {
      var options = this.options;
      var e = getEvent(event);
      var touches = e.touches;
      var touchesLength;
      var touch;
      var action;

      if (this.disabled) {
        return;
      }

      if (touches) {
        touchesLength = touches.length;

        if (touchesLength > 1) {
          if (options.zoomable && options.touchDragZoom && touchesLength === 2) {
            touch = touches[1];
            this.startX2 = touch.pageX;
            this.startY2 = touch.pageY;
            action = ACTION_ZOOM;
          } else {
            return;
          }
        }

        touch = touches[0];
      }

      action = action || getData(e.target, DATA_ACTION);

      if (REGEXP_ACTIONS.test(action)) {
        if (isFunction(options.cropstart) && options.cropstart.call(this.element, {
          originalEvent: e,
          action: action
        }) === false) {
          return;
        }

        preventDefault(e);

        this.action = action;
        this.cropping = false;

        this.startX = touch ? touch.pageX : e.pageX;
        this.startY = touch ? touch.pageY : e.pageY;

        if (action === ACTION_CROP) {
          this.cropping = true;
          addClass(this.dragBox, CLASS_MODAL);
        }
      }
    },

    cropMove: function (event) {
      var options = this.options;
      var e = getEvent(event);
      var touches = e.touches;
      var action = this.action;
      var touchesLength;
      var touch;

      if (this.disabled) {
        return;
      }

      if (touches) {
        touchesLength = touches.length;

        if (touchesLength > 1) {
          if (options.zoomable && options.touchDragZoom && touchesLength === 2) {
            touch = touches[1];
            this.endX2 = touch.pageX;
            this.endY2 = touch.pageY;
          } else {
            return;
          }
        }

        touch = touches[0];
      }

      if (action) {
        if (isFunction(options.cropmove) && options.cropmove.call(this.element, {
          originalEvent: e,
          action: action
        }) === false) {
          return;
        }

        preventDefault(e);

        this.endX = touch ? touch.pageX : e.pageX;
        this.endY = touch ? touch.pageY : e.pageY;

        this.change(e.shiftKey, action === ACTION_ZOOM ? e : null);
      }
    },

    cropEnd: function (event) {
      var options = this.options;
      var e = getEvent(event);
      var action = this.action;

      if (this.disabled) {
        return;
      }

      if (action) {
        preventDefault(e);

        if (this.cropping) {
          this.cropping = false;
          toggleClass(this.dragBox, CLASS_MODAL, this.cropped && options.modal);
        }

        this.action = '';

        if (isFunction(options.cropend)) {
          options.cropend.call(this.element, {
            originalEvent: e,
            action: action
          });
        }
      }
    }
  });

  extend(prototype, {
    change: function (shiftKey, originalEvent) {
      var options = this.options;
      var aspectRatio = options.aspectRatio;
      var action = this.action;
      var containerData = this.containerData;
      var canvasData = this.canvasData;
      var cropBoxData = this.cropBoxData;
      var width = cropBoxData.width;
      var height = cropBoxData.height;
      var left = cropBoxData.left;
      var top = cropBoxData.top;
      var right = left + width;
      var bottom = top + height;
      var minLeft = 0;
      var minTop = 0;
      var maxWidth = containerData.width;
      var maxHeight = containerData.height;
      var renderable = true;
      var offset;
      var range;

      // Locking aspect ratio in "free mode" by holding shift key
      if (!aspectRatio && shiftKey) {
        aspectRatio = width && height ? width / height : 1;
      }

      if (options.strict) {
        minLeft = cropBoxData.minLeft;
        minTop = cropBoxData.minTop;
        maxWidth = minLeft + min(containerData.width, canvasData.width);
        maxHeight = minTop + min(containerData.height, canvasData.height);
      }

      range = {
        x: this.endX - this.startX,
        y: this.endY - this.startY
      };

      if (aspectRatio) {
        range.X = range.y * aspectRatio;
        range.Y = range.x / aspectRatio;
      }

      switch (action) {
        // Move crop box
        case ACTION_ALL:
          left += range.x;
          top += range.y;
          break;

        // Resize crop box
        case ACTION_EAST:
          if (range.x >= 0 && (right >= maxWidth || aspectRatio &&
            (top <= minTop || bottom >= maxHeight))) {

            renderable = false;
            break;
          }

          width += range.x;

          if (aspectRatio) {
            height = width / aspectRatio;
            top -= range.Y / 2;
          }

          if (width < 0) {
            action = ACTION_WEST;
            width = 0;
          }

          break;

        case ACTION_NORTH:
          if (range.y <= 0 && (top <= minTop || aspectRatio &&
            (left <= minLeft || right >= maxWidth))) {

            renderable = false;
            break;
          }

          height -= range.y;
          top += range.y;

          if (aspectRatio) {
            width = height * aspectRatio;
            left += range.X / 2;
          }

          if (height < 0) {
            action = ACTION_SOUTH;
            height = 0;
          }

          break;

        case ACTION_WEST:
          if (range.x <= 0 && (left <= minLeft || aspectRatio &&
            (top <= minTop || bottom >= maxHeight))) {

            renderable = false;
            break;
          }

          width -= range.x;
          left += range.x;

          if (aspectRatio) {
            height = width / aspectRatio;
            top += range.Y / 2;
          }

          if (width < 0) {
            action = ACTION_EAST;
            width = 0;
          }

          break;

        case ACTION_SOUTH:
          if (range.y >= 0 && (bottom >= maxHeight || aspectRatio &&
            (left <= minLeft || right >= maxWidth))) {

            renderable = false;
            break;
          }

          height += range.y;

          if (aspectRatio) {
            width = height * aspectRatio;
            left -= range.X / 2;
          }

          if (height < 0) {
            action = ACTION_NORTH;
            height = 0;
          }

          break;

        case ACTION_NORTH_EAST:
          if (aspectRatio) {
            if (range.y <= 0 && (top <= minTop || right >= maxWidth)) {
              renderable = false;
              break;
            }

            height -= range.y;
            top += range.y;
            width = height * aspectRatio;
          } else {
            if (range.x >= 0) {
              if (right < maxWidth) {
                width += range.x;
              } else if (range.y <= 0 && top <= minTop) {
                renderable = false;
              }
            } else {
              width += range.x;
            }

            if (range.y <= 0) {
              if (top > minTop) {
                height -= range.y;
                top += range.y;
              }
            } else {
              height -= range.y;
              top += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_SOUTH_WEST;
            height = 0;
            width = 0;
          } else if (width < 0) {
            action = ACTION_NORTH_WEST;
            width = 0;
          } else if (height < 0) {
            action = ACTION_SOUTH_EAST;
            height = 0;
          }

          break;

        case ACTION_NORTH_WEST:
          if (aspectRatio) {
            if (range.y <= 0 && (top <= minTop || left <= minLeft)) {
              renderable = false;
              break;
            }

            height -= range.y;
            top += range.y;
            width = height * aspectRatio;
            left += range.X;
          } else {
            if (range.x <= 0) {
              if (left > minLeft) {
                width -= range.x;
                left += range.x;
              } else if (range.y <= 0 && top <= minTop) {
                renderable = false;
              }
            } else {
              width -= range.x;
              left += range.x;
            }

            if (range.y <= 0) {
              if (top > minTop) {
                height -= range.y;
                top += range.y;
              }
            } else {
              height -= range.y;
              top += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_SOUTH_EAST;
            height = 0;
            width = 0;
          } else if (width < 0) {
            action = ACTION_NORTH_EAST;
            width = 0;
          } else if (height < 0) {
            action = ACTION_SOUTH_WEST;
            height = 0;
          }

          break;

        case ACTION_SOUTH_WEST:
          if (aspectRatio) {
            if (range.x <= 0 && (left <= minLeft || bottom >= maxHeight)) {
              renderable = false;
              break;
            }

            width -= range.x;
            left += range.x;
            height = width / aspectRatio;
          } else {
            if (range.x <= 0) {
              if (left > minLeft) {
                width -= range.x;
                left += range.x;
              } else if (range.y >= 0 && bottom >= maxHeight) {
                renderable = false;
              }
            } else {
              width -= range.x;
              left += range.x;
            }

            if (range.y >= 0) {
              if (bottom < maxHeight) {
                height += range.y;
              }
            } else {
              height += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_NORTH_EAST;
            height = 0;
            width = 0;
          } else if (width < 0) {
            action = ACTION_SOUTH_EAST;
            width = 0;
          } else if (height < 0) {
            action = ACTION_NORTH_WEST;
            height = 0;
          }

          break;

        case ACTION_SOUTH_EAST:
          if (aspectRatio) {
            if (range.x >= 0 && (right >= maxWidth || bottom >= maxHeight)) {
              renderable = false;
              break;
            }

            width += range.x;
            height = width / aspectRatio;
          } else {
            if (range.x >= 0) {
              if (right < maxWidth) {
                width += range.x;
              } else if (range.y >= 0 && bottom >= maxHeight) {
                renderable = false;
              }
            } else {
              width += range.x;
            }

            if (range.y >= 0) {
              if (bottom < maxHeight) {
                height += range.y;
              }
            } else {
              height += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_NORTH_WEST;
            height = 0;
            width = 0;
          } else if (width < 0) {
            action = ACTION_SOUTH_WEST;
            width = 0;
          } else if (height < 0) {
            action = ACTION_NORTH_EAST;
            height = 0;
          }

          break;

        // Move canvas
        case ACTION_MOVE:
          this.move(range.x, range.y);
          renderable = false;
          break;

        // Zoom canvas
        case ACTION_ZOOM:
          this.zoom((function (x1, y1, x2, y2) {
            var z1 = sqrt(x1 * x1 + y1 * y1);
            var z2 = sqrt(x2 * x2 + y2 * y2);

            return (z2 - z1) / z1;
          })(
            abs(this.startX - this.startX2),
            abs(this.startY - this.startY2),
            abs(this.endX - this.endX2),
            abs(this.endY - this.endY2)
          ), originalEvent);
          this.startX2 = this.endX2;
          this.startY2 = this.endY2;
          renderable = false;
          break;

        // Create crop box
        case ACTION_CROP:
          if (range.x && range.y) {
            offset = getOffset(this.cropper);
            left = this.startX - offset.left;
            top = this.startY - offset.top;
            width = cropBoxData.minWidth;
            height = cropBoxData.minHeight;

            if (range.x > 0) {
              if (range.y > 0) {
                action = ACTION_SOUTH_EAST;
              } else {
                action = ACTION_NORTH_EAST;
                top -= height;
              }
            } else {
              if (range.y > 0) {
                action = ACTION_SOUTH_WEST;
                left -= width;
              } else {
                action = ACTION_NORTH_WEST;
                left -= width;
                top -= height;
              }
            }

            // Show the crop box if is hidden
            if (!this.cropped) {
              this.cropped = true;
              removeClass(this.cropBox, CLASS_HIDDEN);
            }
          }

          break;

        // No default
      }

      if (renderable) {
        cropBoxData.width = width;
        cropBoxData.height = height;
        cropBoxData.left = left;
        cropBoxData.top = top;
        this.action = action;

        this.renderCropBox();
      }

      // Override
      this.startX = this.endX;
      this.startY = this.endY;
    }
  });

  extend(prototype, {

    // Show the crop box manually
    crop: function () {
      if (this.built && !this.disabled) {
        if (!this.cropped) {
          this.cropped = true;
          this.limitCropBox(true, true);

          if (this.options.modal) {
            addClass(this.dragBox, CLASS_MODAL);
          }

          removeClass(this.cropBox, CLASS_HIDDEN);
        }

        this.setCropBoxData(this.initialCropBoxData);
      }

      return this;
    },

    // Reset the image and crop box to their initial states
    reset: function () {
      if (this.built && !this.disabled) {
        this.imageData = extend({}, this.initialImageData);
        this.canvasData = extend({}, this.initialCanvasData);

        // Required for strict mode
        this.cropBoxData = extend({}, this.initialCropBoxData);

        this.renderCanvas();

        if (this.cropped) {
          this.renderCropBox();
        }
      }

      return this;
    },

    // Clear the crop box
    clear: function () {
      if (this.cropped && !this.disabled) {
        extend(this.cropBoxData, {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        });

        this.cropped = false;
        this.renderCropBox();

        this.limitCanvas();

        // Render canvas after crop box rendered
        this.renderCanvas();

        removeClass(this.dragBox, CLASS_MODAL);
        addClass(this.cropBox, CLASS_HIDDEN);
      }

      return this;
    },

    /**
     * Replace the image's src and rebuild the cropper
     *
     * @param {String} url
     */
    replace: function (url) {
      if (!this.disabled && url) {
        if (this.isImg) {
          this.replaced = true;
          this.element.src = url;
        }

        // Clear previous data
        this.options.data = null;
        this.load(url);
      }

      return this;
    },

    // Enable (unfreeze) the cropper
    enable: function () {
      if (this.built) {
        this.disabled = false;
        removeClass(this.cropper, CLASS_DISABLED);
      }

      return this;
    },

    // Disable (freeze) the cropper
    disable: function () {
      if (this.built) {
        this.disabled = true;
        addClass(this.cropper, CLASS_DISABLED);
      }

      return this;
    },

    // Destroy the cropper and remove the instance from the image
    destroy: function () {
      var element = this.element;
      var image = this.image;

      if (this.ready) {
        if (this.isImg && this.replaced) {
          element.asrc = this.originalUrl;
        }

        this.unbuild();
        removeClass(element, CLASS_HIDDEN);
      } else {
        if (this.isImg) {
          element.off(EVENT_LOAD, this.start);
        } else if (image) {
          removeChild(image);
        }
      }

      removeData(element, NAMESPACE);

      return this;
    },

    /**
     * Move the canvas
     *
     * @param {Number} offsetX
     * @param {Number} offsetY (optional)
     */
    move: function (offsetX, offsetY) {
      var canvasData = this.canvasData;

      // If "offsetY" is not present, its default value is "offsetX"
      if (isUndefined(offsetY)) {
        offsetY = offsetX;
      }

      offsetX = num(offsetX);
      offsetY = num(offsetY);

      if (this.built && !this.disabled && this.options.movable) {
        canvasData.left += isNumber(offsetX) ? offsetX : 0;
        canvasData.top += isNumber(offsetY) ? offsetY : 0;
        this.renderCanvas(true);
      }

      return this;
    },

    /**
     * Zoom the canvas
     *
     * @param {Number} ratio
     * @param {Event} _originalEvent (private)
     */
    zoom: function (ratio, _originalEvent) {
      var options = this.options;
      var canvasData = this.canvasData;
      var width;
      var height;

      ratio = num(ratio);

      if (ratio && this.built && !this.disabled && options.zoomable) {
        if (isFunction(options.zoom) && options.zoom.call(this.element, {
          originalEvent: _originalEvent,
          ratio: ratio
        }) === false) {
          return this;
        }

        if (ratio < 0) {
          ratio =  1 / (1 - ratio);
        } else {
          ratio = 1 + ratio;
        }

        width = canvasData.width * ratio;
        height = canvasData.height * ratio;
        canvasData.left -= (width - canvasData.width) / 2;
        canvasData.top -= (height - canvasData.height) / 2;
        canvasData.width = width;
        canvasData.height = height;
        this.renderCanvas(true);
        this.setDragMode(ACTION_MOVE);
      }

      return this;
    },

    /**
     * Rotate the canvas
     * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#rotate()
     *
     * @param {Number} degree
     */
    rotate: function (degree) {
      var imageData = this.imageData;
      var rotate = imageData.rotate || 0;

      degree = num(degree) || 0;

      if (this.built && !this.disabled && this.options.rotatable) {
        imageData.rotate = (rotate + degree) % 360;
        this.rotated = true;
        this.renderCanvas(true);
      }

      return this;
    },

    /**
     * Scale the image
     * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#scale()
     *
     * @param {Number} scaleX
     * @param {Number} scaleY (optional)
     */
    scale: function (scaleX, scaleY) {
      var imageData = this.imageData;

      // If "scaleY" is not present, its default value is "scaleX"
      if (isUndefined(scaleY)) {
        scaleY = scaleX;
      }

      scaleX = num(scaleX);
      scaleY = num(scaleY);

      if (this.built && !this.disabled && this.options.scalable) {
        imageData.scaleX = isNumber(scaleX) ? scaleX : 1;
        imageData.scaleY = isNumber(scaleY) ? scaleY : 1;
        this.renderImage(true);
      }

      return this;
    },

    /**
     * Get the cropped area position and size data (base on the original image)
     *
     * @param {Boolean} rounded (optional)
     * @return {Object} data
     */
    getData: function (rounded) {
      var options = this.options;
      var imageData = this.imageData;
      var canvasData = this.canvasData;
      var cropBoxData = this.cropBoxData;
      var ratio;
      var data;

      if (this.built && this.cropped) {
        data = {
          x: cropBoxData.left - canvasData.left,
          y: cropBoxData.top - canvasData.top,
          width: cropBoxData.width,
          height: cropBoxData.height
        };

        ratio = imageData.width / imageData.naturalWidth;

        each(data, function (n, i) {
          n = n / ratio;
          data[i] = rounded ? Math.round(n) : n;
        });

      } else {
        data = {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        };
      }

      if (options.rotatable) {
        data.rotate = imageData.rotate || 0;
      }

      if (options.scalable) {
        data.scaleX = imageData.scaleX || 1;
        data.scaleY = imageData.scaleY || 1;
      }

      return data;
    },

    /**
     * Set the cropped area position and size with new data
     *
     * @param {Object} data
     */
    setData: function (data) {
      var options = this.options;
      var imageData = this.imageData;
      var canvasData = this.canvasData;
      var cropBoxData = {};
      var rotated;
      var scaled;
      var ratio;

      if (isFunction(data)) {
        data = data.call(this.element);
      }

      if (this.built && !this.disabled && isPlainObject(data)) {
        if (options.rotatable) {
          if (isNumber(data.rotate) && data.rotate !== imageData.rotate) {
            imageData.rotate = data.rotate;
            this.rotated = rotated = true;
          }
        }

        if (options.scalable) {
          if (isNumber(data.scaleX) && data.scaleX !== imageData.scaleX) {
            imageData.scaleX = data.scaleX;
            scaled = true;
          }

          if (isNumber(data.scaleY) && data.scaleY !== imageData.scaleY) {
            imageData.scaleY = data.scaleY;
            scaled = true;
          }
        }

        if (rotated) {
          this.renderCanvas();
        } else if (scaled) {
          this.renderImage();
        }

        ratio = imageData.width / imageData.naturalWidth;

        if (isNumber(data.x)) {
          cropBoxData.left = data.x * ratio + canvasData.left;
        }

        if (isNumber(data.y)) {
          cropBoxData.top = data.y * ratio + canvasData.top;
        }

        if (isNumber(data.width)) {
          cropBoxData.width = data.width * ratio;
        }

        if (isNumber(data.height)) {
          cropBoxData.height = data.height * ratio;
        }

        this.setCropBoxData(cropBoxData);
      }

      return this;
    },

    /**
     * Get the container size data
     *
     * @return {Object} data
     */
    getContainerData: function () {
      return this.built ? this.containerData : {};
    },

    /**
     * Get the image position and size data
     *
     * @return {Object} data
     */
    getImageData: function () {
      return this.ready ? this.imageData : {};
    },

    /**
     * Get the canvas position and size data
     *
     * @return {Object} data
     */
    getCanvasData: function () {
      var canvasData = this.canvasData;
      var data;

      if (this.built) {
        data = {
          left: canvasData.left,
          top: canvasData.top,
          width: canvasData.width,
          height: canvasData.height
        };
      }

      return data || {};
    },

    /**
     * Set the canvas position and size with new data
     *
     * @param {Object} data
     */
    setCanvasData: function (data) {
      var canvasData = this.canvasData;
      var aspectRatio = canvasData.aspectRatio;

      if (isFunction(data)) {
        data = data.call(this.element);
      }

      if (this.built && !this.disabled && isPlainObject(data)) {
        if (isNumber(data.left)) {
          canvasData.left = data.left;
        }

        if (isNumber(data.top)) {
          canvasData.top = data.top;
        }

        if (isNumber(data.width)) {
          canvasData.width = data.width;
          canvasData.height = data.width / aspectRatio;
        } else if (isNumber(data.height)) {
          canvasData.height = data.height;
          canvasData.width = data.height * aspectRatio;
        }

        this.renderCanvas(true);
      }

      return this;
    },

    /**
     * Get the crop box position and size data
     *
     * @return {Object} data
     */
    getCropBoxData: function () {
      var cropBoxData = this.cropBoxData;
      var data;

      if (this.built && this.cropped) {
        data = {
          left: cropBoxData.left,
          top: cropBoxData.top,
          width: cropBoxData.width,
          height: cropBoxData.height
        };
      }

      return data || {};
    },

    /**
     * Set the crop box position and size with new data
     *
     * @param {Object} data
     */
    setCropBoxData: function (data) {
      var cropBoxData = this.cropBoxData;
      var aspectRatio = this.options.aspectRatio;
      var widthChanged;
      var heightChanged;

      if (isFunction(data)) {
        data = data.call(this.element);
      }

      if (this.built && this.cropped && !this.disabled && isPlainObject(data)) {

        if (isNumber(data.left)) {
          cropBoxData.left = data.left;
        }

        if (isNumber(data.top)) {
          cropBoxData.top = data.top;
        }

        if (isNumber(data.width) && data.width !== cropBoxData.width) {
          widthChanged = true;
          cropBoxData.width = data.width;
        }

        if (isNumber(data.height) && data.height !== cropBoxData.height) {
          heightChanged = true;
          cropBoxData.height = data.height;
        }

        if (aspectRatio) {
          if (widthChanged) {
            cropBoxData.height = cropBoxData.width / aspectRatio;
          } else if (heightChanged) {
            cropBoxData.width = cropBoxData.height * aspectRatio;
          }
        }

        this.renderCropBox();
      }

      return this;
    },

    /**
     * Get a canvas drawn the cropped image
     *
     * @param {Object} options (optional)
     * @return {HTMLCanvasElement} canvas
     */
    getCroppedCanvas: function (options) {
      var originalWidth;
      var originalHeight;
      var canvasWidth;
      var canvasHeight;
      var scaledWidth;
      var scaledHeight;
      var scaledRatio;
      var aspectRatio;
      var canvas;
      var context;
      var data;

      if (!this.built || !this.cropped || !SUPPORT_CANVAS) {
        return;
      }

      if (!isPlainObject(options)) {
        options = {};
      }

      data = this.getData();
      originalWidth = data.width;
      originalHeight = data.height;
      aspectRatio = originalWidth / originalHeight;

      if (isPlainObject(options)) {
        scaledWidth = options.width;
        scaledHeight = options.height;

        if (scaledWidth) {
          scaledHeight = scaledWidth / aspectRatio;
          scaledRatio = scaledWidth / originalWidth;
        } else if (scaledHeight) {
          scaledWidth = scaledHeight * aspectRatio;
          scaledRatio = scaledHeight / originalHeight;
        }
      }

      canvasWidth = scaledWidth || originalWidth;
      canvasHeight = scaledHeight || originalHeight;

      canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      context = canvas.getContext('2d');

      if (options.fillColor) {
        context.fillStyle = options.fillColor;
        context.fillRect(0, 0, canvasWidth, canvasHeight);
      }

      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
      context.drawImage.apply(context, (function () {
        var source = getSourceCanvas(this.image, this.imageData);
        var sourceWidth = source.width;
        var sourceHeight = source.height;
        var args = [source];

        // Source canvas
        var srcX = data.x;
        var srcY = data.y;
        var srcWidth;
        var srcHeight;

        // Destination canvas
        var dstX;
        var dstY;
        var dstWidth;
        var dstHeight;

        if (srcX <= -originalWidth || srcX > sourceWidth) {
          srcX = srcWidth = dstX = dstWidth = 0;
        } else if (srcX <= 0) {
          dstX = -srcX;
          srcX = 0;
          srcWidth = dstWidth = min(sourceWidth, originalWidth + srcX);
        } else if (srcX <= sourceWidth) {
          dstX = 0;
          srcWidth = dstWidth = min(originalWidth, sourceWidth - srcX);
        }

        if (srcWidth <= 0 || srcY <= -originalHeight || srcY > sourceHeight) {
          srcY = srcHeight = dstY = dstHeight = 0;
        } else if (srcY <= 0) {
          dstY = -srcY;
          srcY = 0;
          srcHeight = dstHeight = min(sourceHeight, originalHeight + srcY);
        } else if (srcY <= sourceHeight) {
          dstY = 0;
          srcHeight = dstHeight = min(originalHeight, sourceHeight - srcY);
        }

        args.push(srcX, srcY, srcWidth, srcHeight);

        // Scale destination sizes
        if (scaledRatio) {
          dstX *= scaledRatio;
          dstY *= scaledRatio;
          dstWidth *= scaledRatio;
          dstHeight *= scaledRatio;
        }

        // Avoid "IndexSizeError" in IE and Firefox
        if (dstWidth > 0 && dstHeight > 0) {
          args.push(dstX, dstY, dstWidth, dstHeight);
        }

        return args;
      }).call(this));

      return canvas;
    },

    /**
     * Change the aspect ratio of the crop box
     *
     * @param {Number} aspectRatio
     */
    setAspectRatio: function (aspectRatio) {
      var options = this.options;

      if (!this.disabled && !isUndefined(aspectRatio)) {

        // 0 -> NaN
        options.aspectRatio = num(aspectRatio) || NaN;

        if (this.built) {
          this.initCropBox();

          if (this.cropped) {
            this.renderCropBox();
          }
        }
      }

      return this;
    },

    /**
     * Change the drag mode
     *
     * @param {String} mode (optional)
     */
    setDragMode: function (mode) {
      var options = this.options;
      var dragBox = this.dragBox;
      var face = this.face;
      var croppable;
      var movable;

      if (this.ready && !this.disabled) {
        croppable = options.dragCrop && mode === ACTION_CROP;
        movable = options.movable && mode === ACTION_MOVE;
        mode = (croppable || movable) ? mode : ACTION_NONE;

        setData(dragBox, DATA_ACTION, mode);
        toggleClass(dragBox, CLASS_CROP, croppable);
        toggleClass(dragBox, CLASS_MOVE, movable);

        if (!options.cropBoxMovable) {

          // Sync drag mode to crop box when it is not movable
          setData(face, DATA_ACTION, mode);
          toggleClass(face, CLASS_CROP, croppable);
          toggleClass(face, CLASS_MOVE, movable);
        }
      }

      return this;
    }
  });

  extend(Cropper.prototype, prototype);

  Cropper.DEFAULTS = {

    // Define the aspect ratio of the crop box
    aspectRatio: NaN,

    // An object with the previous cropping result data
    data: null,

    // A selector for adding extra containers to preview
    preview: '',

    // Strict mode, the image cannot zoom out less than the container
    strict: true,

    // Rebuild when resize the window
    responsive: true,

    // Check if the target image is cross origin
    checkImageOrigin: true,

    // Show the black modal
    modal: true,

    // Show the dashed lines for guiding
    guides: true,

    // Show the center indicator for guiding
    center: true,

    // Show the white modal to highlight the crop box
    highlight: true,

    // Show the grid background
    background: true,

    // Enable to crop the image automatically when initialize
    autoCrop: true,

    // Define the percentage of automatic cropping area when initializes
    autoCropArea: 0.8,

    // Enable to create new crop box by dragging over the image
    dragCrop: true,

    // Enable to move the image
    movable: true,

    // Enable to rotate the image
    rotatable: true,

    // Enable to scale the image
    scalable: true,

    // Enable to zoom the image
    zoomable: true,

    // Enable to zoom the image by wheeling mouse
    mouseWheelZoom: true,

    // Define zoom ratio when zoom the image by wheeling mouse
    wheelZoomRatio: 0.1,

    // Enable to zoom the image by dragging touch
    touchDragZoom: true,

    // Enable to move the crop box
    cropBoxMovable: true,

    // Enable to resize the crop box
    cropBoxResizable: true,

    // Toggle drag mode between "crop" and "move" when double click on the cropper
    doubleClickToggle: true,

    // Size limitation
    minCanvasWidth: 0,
    minCanvasHeight: 0,
    minCropBoxWidth: 0,
    minCropBoxHeight: 0,
    minContainerWidth: 200,
    minContainerHeight: 100,

    // Shortcuts of events
    build: null,
    built: null,
    cropstart: null,
    cropmove: null,
    cropend: null,
    crop: null,
    zoom: null
  };

  Cropper.TEMPLATE = (
    '<div class="cropper-container">' +
      '<div class="cropper-canvas"></div>' +
      '<div class="cropper-drag-box"></div>' +
      '<div class="cropper-crop-box">' +
        '<span class="cropper-view-box"></span>' +
        '<span class="cropper-dashed dashed-h"></span>' +
        '<span class="cropper-dashed dashed-v"></span>' +
        '<span class="cropper-center"></span>' +
        '<span class="cropper-face"></span>' +
        '<span class="cropper-line line-e" data-action="e"></span>' +
        '<span class="cropper-line line-n" data-action="n"></span>' +
        '<span class="cropper-line line-w" data-action="w"></span>' +
        '<span class="cropper-line line-s" data-action="s"></span>' +
        '<span class="cropper-point point-e" data-action="e"></span>' +
        '<span class="cropper-point point-n" data-action="n"></span>' +
        '<span class="cropper-point point-w" data-action="w"></span>' +
        '<span class="cropper-point point-s" data-action="s"></span>' +
        '<span class="cropper-point point-ne" data-action="ne"></span>' +
        '<span class="cropper-point point-nw" data-action="nw"></span>' +
        '<span class="cropper-point point-sw" data-action="sw"></span>' +
        '<span class="cropper-point point-se" data-action="se"></span>' +
      '</div>' +
    '</div>'
  );

  var _Cropper = window.Cropper;

  Cropper.noConflict = function () {
    window.Cropper = _Cropper;
    return Cropper;
  };

  Cropper.setDefaults = function (options) {
    extend(Cropper.DEFAULTS, options);
  };

  if (typeof define === 'function' && define.amd) {
    define('cropper', [], function () {
      return Cropper;
    });
  }

  if (typeof noGlobal === 'undefined') {
    window.Cropper = Cropper;
  }

  return Cropper;

});

},{}],26:[function(require,module,exports){
;(function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};


	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function() {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}
}());

},{}],27:[function(require,module,exports){
/**
 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseAssign = require('lodash._baseassign'),
    createAssigner = require('lodash._createassigner'),
    keys = require('lodash.keys');

/**
 * A specialized version of `_.assign` for customizing assigned values without
 * support for argument juggling, multiple sources, and `this` binding `customizer`
 * functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 */
function assignWith(object, source, customizer) {
  var index = -1,
      props = keys(source),
      length = props.length;

  while (++index < length) {
    var key = props[index],
        value = object[key],
        result = customizer(value, source[key], key, object, source);

    if ((result === result ? (result !== value) : (value === value)) ||
        (value === undefined && !(key in object))) {
      object[key] = result;
    }
  }
  return object;
}

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object. Subsequent sources overwrite property assignments of previous sources.
 * If `customizer` is provided it is invoked to produce the assigned values.
 * The `customizer` is bound to `thisArg` and invoked with five arguments:
 * (objectValue, sourceValue, key, object, source).
 *
 * **Note:** This method mutates `object` and is based on
 * [`Object.assign`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign).
 *
 * @static
 * @memberOf _
 * @alias extend
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
 * // => { 'user': 'fred', 'age': 40 }
 *
 * // using a customizer callback
 * var defaults = _.partialRight(_.assign, function(value, other) {
 *   return _.isUndefined(value) ? other : value;
 * });
 *
 * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
 * // => { 'user': 'barney', 'age': 36 }
 */
var assign = createAssigner(function(object, source, customizer) {
  return customizer
    ? assignWith(object, source, customizer)
    : baseAssign(object, source);
});

module.exports = assign;

},{"lodash._baseassign":28,"lodash._createassigner":30,"lodash.keys":34}],28:[function(require,module,exports){
/**
 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseCopy = require('lodash._basecopy'),
    keys = require('lodash.keys');

/**
 * The base implementation of `_.assign` without support for argument juggling,
 * multiple sources, and `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return source == null
    ? object
    : baseCopy(source, keys(source), object);
}

module.exports = baseAssign;

},{"lodash._basecopy":29,"lodash.keys":34}],29:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property names to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @returns {Object} Returns `object`.
 */
function baseCopy(source, props, object) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    object[key] = source[key];
  }
  return object;
}

module.exports = baseCopy;

},{}],30:[function(require,module,exports){
/**
 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var bindCallback = require('lodash._bindcallback'),
    isIterateeCall = require('lodash._isiterateecall'),
    restParam = require('lodash.restparam');

/**
 * Creates a function that assigns properties of source object(s) to a given
 * destination object.
 *
 * **Note:** This function is used to create `_.assign`, `_.defaults`, and `_.merge`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return restParam(function(object, sources) {
    var index = -1,
        length = object == null ? 0 : sources.length,
        customizer = length > 2 ? sources[length - 2] : undefined,
        guard = length > 2 ? sources[2] : undefined,
        thisArg = length > 1 ? sources[length - 1] : undefined;

    if (typeof customizer == 'function') {
      customizer = bindCallback(customizer, thisArg, 5);
      length -= 2;
    } else {
      customizer = typeof thisArg == 'function' ? thisArg : undefined;
      length -= (customizer ? 1 : 0);
    }
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"lodash._bindcallback":31,"lodash._isiterateecall":32,"lodash.restparam":33}],31:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (thisArg === undefined) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = bindCallback;

},{}],32:[function(require,module,exports){
/**
 * lodash 3.0.9 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isIterateeCall;

},{}],33:[function(require,module,exports){
/**
 * lodash 3.6.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.restParam(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function restParam(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        rest = Array(length);

    while (++index < length) {
      rest[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, args[0], rest);
      case 2: return func.call(this, args[0], args[1], rest);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = rest;
    return func.apply(this, otherArgs);
  };
}

module.exports = restParam;

},{}],34:[function(require,module,exports){
/**
 * lodash 3.1.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var getNative = require('lodash._getnative'),
    isArguments = require('lodash.isarguments'),
    isArray = require('lodash.isarray');

/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = getNative(Object, 'keys');

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = !!length && isLength(length) &&
    (isArray(object) || isArguments(object));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  var Ctor = object == null ? undefined : object.constructor;
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isArrayLike(object))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || isArguments(object)) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keys;

},{"lodash._getnative":35,"lodash.isarguments":36,"lodash.isarray":37}],35:[function(require,module,exports){
/**
 * lodash 3.9.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = getNative;

},{}],36:[function(require,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) &&
    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
}

module.exports = isArguments;

},{}],37:[function(require,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var arrayTag = '[object Array]',
    funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isArray;

},{}],38:[function(require,module,exports){
//! moment.js
//! version : 2.10.6
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = getParsingFlags(from);
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {
    }

    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && typeof module !== 'undefined' &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (typeof values === 'undefined') {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, values) {
        if (values !== null) {
            values.abbr = name;
            locales[name] = locales[name] || new Locale();
            locales[name].set(values);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function get_set__set (mom, unit, value) {
        return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

    var regexes = {};

    function isFunction (sth) {
        // https://github.com/moment/moment/issues/2325
        return typeof sth === 'function' &&
            Object.prototype.toString.call(sth) === '[object Function]';
    }


    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  matchWord);
    addRegexToken('MMMM', matchWord);

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m) {
        return this._months[m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m) {
        return this._monthsShort[m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (firstTime) {
                warn(msg + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
        ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
        ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d{2}/],
        ['YYYY-DDD', /\d{4}-\d{3}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
        ['HH:mm', /(T| )\d\d:\d\d/],
        ['HH', /(T| )\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = from_string__isoRegex.exec(string);

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    config._f = isoDates[i][0];
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    // match[6] should be 'T' or space
                    config._f += (match[6] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (string.match(matchOffset)) {
                config._f += 'Z';
            }
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var week1Jan = 6 + firstDayOfWeek - firstDayOfWeekOfYear, janX = createUTCDate(year, 0, 1 + week1Jan), d = janX.getUTCDay(), dayOfYear;
        if (d < firstDayOfWeek) {
            d += 7;
        }

        weekday = weekday != null ? 1 * weekday : firstDayOfWeek;

        dayOfYear = 1 + week1Jan + 7 * (week - 1) - d + weekday;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
        }
        return [now.getFullYear(), now.getMonth(), now.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             return other < this ? this : other;
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            return other > this ? this : other;
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchOffset);
    addRegexToken('ZZ', matchOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(string) {
        var matches = ((string || '').match(matchOffset) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(input);
            }
            if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (typeof this._isDSTShifted !== 'undefined') {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return !this._isUTC;
    }

    function isUtcOffset () {
        return this._isUTC;
    }

    function isUtc () {
        return this._isUTC && this._offset === 0;
    }

    var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = create__isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                d : parseIso(match[4], sign),
                h : parseIso(match[5], sign),
                m : parseIso(match[6], sign),
                s : parseIso(match[7], sign),
                w : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
        return this.format(formats && formats[format] || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this > +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return inputMs < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this < +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return +this.clone().endOf(units) < inputMs;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var inputMs;
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this === +input;
        } else {
            inputMs = +local__createLocal(input);
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function diff (input, units, asFloat) {
        var that = cloneWithOffset(input, this),
            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
            delta, output;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if ('function' === typeof Date.prototype.toISOString) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function weeksInYear(year, dow, doy) {
        return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    // MOMENTS

    function getSetWeekYear (input) {
        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getSetISOWeekYear (input) {
        var year = weekOfYear(this, 1, 4).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    addFormatToken('Q', 0, 0, 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config) {
        var weekday = config._locale.weekdaysParse(input);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m) {
        return this._weekdays[m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName) {
        var i, mom, regex;

        this._weekdaysParse = this._weekdaysParse || [];

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            if (!this._weekdaysParse[i]) {
                mom = local__createLocal([2000, 1]).day(i);
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, function () {
        return this.hours() % 12 || 12;
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add          = add_subtract__add;
    momentPrototype__proto.calendar     = moment_calendar__calendar;
    momentPrototype__proto.clone        = clone;
    momentPrototype__proto.diff         = diff;
    momentPrototype__proto.endOf        = endOf;
    momentPrototype__proto.format       = format;
    momentPrototype__proto.from         = from;
    momentPrototype__proto.fromNow      = fromNow;
    momentPrototype__proto.to           = to;
    momentPrototype__proto.toNow        = toNow;
    momentPrototype__proto.get          = getSet;
    momentPrototype__proto.invalidAt    = invalidAt;
    momentPrototype__proto.isAfter      = isAfter;
    momentPrototype__proto.isBefore     = isBefore;
    momentPrototype__proto.isBetween    = isBetween;
    momentPrototype__proto.isSame       = isSame;
    momentPrototype__proto.isValid      = moment_valid__isValid;
    momentPrototype__proto.lang         = lang;
    momentPrototype__proto.locale       = locale;
    momentPrototype__proto.localeData   = localeData;
    momentPrototype__proto.max          = prototypeMax;
    momentPrototype__proto.min          = prototypeMin;
    momentPrototype__proto.parsingFlags = parsingFlags;
    momentPrototype__proto.set          = getSet;
    momentPrototype__proto.startOf      = startOf;
    momentPrototype__proto.subtract     = add_subtract__subtract;
    momentPrototype__proto.toArray      = toArray;
    momentPrototype__proto.toObject     = toObject;
    momentPrototype__proto.toDate       = toDate;
    momentPrototype__proto.toISOString  = moment_format__toISOString;
    momentPrototype__proto.toJSON       = moment_format__toISOString;
    momentPrototype__proto.toString     = toString;
    momentPrototype__proto.unix         = unix;
    momentPrototype__proto.valueOf      = to_type__valueOf;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return typeof output === 'function' ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (typeof output === 'function') ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (typeof prop === 'function') {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months       =        localeMonths;
    prototype__proto._months      = defaultLocaleMonths;
    prototype__proto.monthsShort  =        localeMonthsShort;
    prototype__proto._monthsShort = defaultLocaleMonthsShort;
    prototype__proto.monthsParse  =        localeMonthsParse;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes === 1          && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   === 1          && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    === 1          && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  === 1          && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   === 1          && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.10.6';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
},{}],39:[function(require,module,exports){
(function (root) {
// lazy require symbols table
var _symbols, removelist;
function symbols(code) {
    if (_symbols) return _symbols[code];
    _symbols = require('unicode/category/So');
    removelist = ['sign','cross','of','symbol','staff','hand','black','white']
        .map(function (word) {return new RegExp(word, 'gi')});
    return _symbols[code];
}

function slug(string, opts) {
    string = string.toString();
    if ('string' === typeof opts)
        opts = {replacement:opts};
    opts = opts || {};
    opts.mode = opts.mode || slug.defaults.mode;
    var defaults = slug.defaults.modes[opts.mode];
    var keys = ['replacement','multicharmap','charmap','remove','lower'];
    for (var key, i = 0, l = keys.length; i < l; i++) { key = keys[i];
        opts[key] = (key in opts) ? opts[key] : defaults[key];
    }
    if ('undefined' === typeof opts.symbols)
        opts.symbols = defaults.symbols;

    var lengths = [];
    for (var key in opts.multicharmap) {
        if (!opts.multicharmap.hasOwnProperty(key))
            continue;

        var len = key.length;
        if (lengths.indexOf(len) === -1)
            lengths.push(len);
    }

    var code, unicode, result = "";
    for (var char, i = 0, l = string.length; i < l; i++) { char = string[i];
        if (!lengths.some(function (len) {
            var str = string.substr(i, len);
            if (opts.multicharmap[str]) {
                i += len - 1;
                char = opts.multicharmap[str];
                return true;
            } else return false;
        })) {
            if (opts.charmap[char]) {
                char = opts.charmap[char];
                code = char.charCodeAt(0);
            } else {
                code = string.charCodeAt(i);
            }
            if (opts.symbols && (unicode = symbols(code))) {
                char = unicode.name.toLowerCase();
                for(var j = 0, rl = removelist.length; j < rl; j++) {
                    char = char.replace(removelist[j], '');
                }
                char = char.replace(/^\s+|\s+$/g, '');
            }
        }
        char = char.replace(/[^\w\s\-\.\_~]/g, ''); // allowed
        if (opts.remove) char = char.replace(opts.remove, ''); // add flavour
        result += char;
    }
    result = result.replace(/^\s+|\s+$/g, ''); // trim leading/trailing spaces
    result = result.replace(/[-\s]+/g, opts.replacement); // convert spaces
    result = result.replace(opts.replacement+"$",''); // remove trailing separator
    if (opts.lower)
      result = result.toLowerCase();
    return result;
};

slug.defaults = {
    mode: 'pretty',
};

slug.multicharmap = slug.defaults.multicharmap = {
    '<3': 'love', '&&': 'and', '||': 'or', 'w/': 'with',
};

// https://code.djangoproject.com/browser/django/trunk/django/contrib/admin/media/js/urlify.js
slug.charmap  = slug.defaults.charmap = {
    // latin
    'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE',
    'Ç': 'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I',
    'Î': 'I', 'Ï': 'I', 'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O',
    'Õ': 'O', 'Ö': 'O', 'Ő': 'O', 'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U',
    'Ü': 'U', 'Ű': 'U', 'Ý': 'Y', 'Þ': 'TH', 'ß': 'ss', 'à':'a', 'á':'a',
    'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c', 'è': 'e',
    'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
    'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
    'ő': 'o', 'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ű': 'u',
    'ý': 'y', 'þ': 'th', 'ÿ': 'y', 'ẞ': 'SS',
    // greek
    'α':'a', 'β':'b', 'γ':'g', 'δ':'d', 'ε':'e', 'ζ':'z', 'η':'h', 'θ':'8',
    'ι':'i', 'κ':'k', 'λ':'l', 'μ':'m', 'ν':'n', 'ξ':'3', 'ο':'o', 'π':'p',
    'ρ':'r', 'σ':'s', 'τ':'t', 'υ':'y', 'φ':'f', 'χ':'x', 'ψ':'ps', 'ω':'w',
    'ά':'a', 'έ':'e', 'ί':'i', 'ό':'o', 'ύ':'y', 'ή':'h', 'ώ':'w', 'ς':'s',
    'ϊ':'i', 'ΰ':'y', 'ϋ':'y', 'ΐ':'i',
    'Α':'A', 'Β':'B', 'Γ':'G', 'Δ':'D', 'Ε':'E', 'Ζ':'Z', 'Η':'H', 'Θ':'8',
    'Ι':'I', 'Κ':'K', 'Λ':'L', 'Μ':'M', 'Ν':'N', 'Ξ':'3', 'Ο':'O', 'Π':'P',
    'Ρ':'R', 'Σ':'S', 'Τ':'T', 'Υ':'Y', 'Φ':'F', 'Χ':'X', 'Ψ':'PS', 'Ω':'W',
    'Ά':'A', 'Έ':'E', 'Ί':'I', 'Ό':'O', 'Ύ':'Y', 'Ή':'H', 'Ώ':'W', 'Ϊ':'I',
    'Ϋ':'Y',
    // turkish
    'ş':'s', 'Ş':'S', 'ı':'i', 'İ':'I',
    'ğ':'g', 'Ğ':'G',
    // russian
    'а':'a', 'б':'b', 'в':'v', 'г':'g', 'д':'d', 'е':'e', 'ё':'yo', 'ж':'zh',
    'з':'z', 'и':'i', 'й':'j', 'к':'k', 'л':'l', 'м':'m', 'н':'n', 'о':'o',
    'п':'p', 'р':'r', 'с':'s', 'т':'t', 'у':'u', 'ф':'f', 'х':'h', 'ц':'c',
    'ч':'ch', 'ш':'sh', 'щ':'sh', 'ъ':'u', 'ы':'y', 'ь':'', 'э':'e', 'ю':'yu',
    'я':'ya',
    'А':'A', 'Б':'B', 'В':'V', 'Г':'G', 'Д':'D', 'Е':'E', 'Ё':'Yo', 'Ж':'Zh',
    'З':'Z', 'И':'I', 'Й':'J', 'К':'K', 'Л':'L', 'М':'M', 'Н':'N', 'О':'O',
    'П':'P', 'Р':'R', 'С':'S', 'Т':'T', 'У':'U', 'Ф':'F', 'Х':'H', 'Ц':'C',
    'Ч':'Ch', 'Ш':'Sh', 'Щ':'Sh', 'Ъ':'U', 'Ы':'Y', 'Ь':'', 'Э':'E', 'Ю':'Yu',
    'Я':'Ya',
    // ukranian
    'Є':'Ye', 'І':'I', 'Ї':'Yi', 'Ґ':'G', 'є':'ye', 'і':'i', 'ї':'yi', 'ґ':'g',
    // czech
    'č':'c', 'ď':'d', 'ě':'e', 'ň': 'n', 'ř':'r', 'š':'s', 'ť':'t', 'ů':'u',
    'ž':'z', 'Č':'C', 'Ď':'D', 'Ě':'E', 'Ň': 'N', 'Ř':'R', 'Š':'S', 'Ť':'T',
    'Ů':'U', 'Ž':'Z',
    // polish
    'ą':'a', 'ć':'c', 'ę':'e', 'ł':'l', 'ń':'n', 'ś':'s', 'ź':'z',
    'ż':'z', 'Ą':'A', 'Ć':'C', 'Ę':'E', 'Ł':'L', 'Ń':'N', 'Ś':'S',
    'Ź':'Z', 'Ż':'Z',
    // latvian
    'ā':'a', 'ē':'e', 'ģ':'g', 'ī':'i', 'ķ':'k', 'ļ':'l', 'ņ':'n',
    'ū':'u', 'Ā':'A', 'Ē':'E', 'Ģ':'G', 'Ī':'I',
    'Ķ':'K', 'Ļ':'L', 'Ņ':'N', 'Ū':'U',
    // lithuanian
    'ė':'e', 'į':'i', 'ų':'u', 'Ė': 'E', 'Į': 'I', 'Ų':'U',
    // romanian
    'ț':'t', 'Ț':'T', 'ţ':'t', 'Ţ':'T', 'ș':'s', 'Ș':'S', 'ă':'a', 'Ă':'A',
    // vietnamese
    'Ạ': 'A', 'Ả': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A',
    'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ẹ': 'E', 'Ẻ': 'E',
    'Ẽ': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ị': 'I',
    'Ỉ': 'I', 'Ĩ': 'I', 'Ọ': 'O', 'Ỏ': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O',
    'Ổ': 'O', 'Ỗ': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O',
    'Ỡ': 'O', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U',
    'Ự': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ỳ': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
    'Đ': 'D', 'ạ': 'a', 'ả': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a',
    'ẫ': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ẹ': 'e',
    'ẻ': 'e', 'ẽ': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
    'ị': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ọ': 'o', 'ỏ': 'o', 'ồ': 'o', 'ố': 'o',
    'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o',
    'ở': 'o', 'ỡ': 'o', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u',
    'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u', 'ỳ': 'y', 'ỵ': 'y', 'ỷ': 'y',
    'ỹ': 'y', 'đ': 'd',
    // currency
    '€': 'euro', '₢': 'cruzeiro', '₣': 'french franc', '£': 'pound',
    '₤': 'lira', '₥': 'mill', '₦': 'naira', '₧': 'peseta', '₨': 'rupee',
    '₩': 'won', '₪': 'new shequel', '₫': 'dong', '₭': 'kip', '₮': 'tugrik',
    '₯': 'drachma', '₰': 'penny', '₱': 'peso', '₲': 'guarani', '₳': 'austral',
    '₴': 'hryvnia', '₵': 'cedi', '¢': 'cent', '¥': 'yen', '元': 'yuan',
    '円': 'yen', '﷼': 'rial', '₠': 'ecu', '¤': 'currency', '฿': 'baht',
    "$": 'dollar', '₹': 'indian rupee',
    // symbols
    '©':'(c)', 'œ': 'oe', 'Œ': 'OE', '∑': 'sum', '®': '(r)', '†': '+',
    '“': '"', '”': '"', '‘': "'", '’': "'", '∂': 'd', 'ƒ': 'f', '™': 'tm',
    '℠': 'sm', '…': '...', '˚': 'o', 'º': 'o', 'ª': 'a', '•': '*',
    '∆': 'delta', '∞': 'infinity', '♥': 'love', '&': 'and', '|': 'or',
    '<': 'less', '>': 'greater',
};

slug.defaults.modes = {
    rfc3986: {
        replacement: '-',
        symbols: true,
        remove: null,
        lower: true,
        charmap: slug.defaults.charmap,
        multicharmap: slug.defaults.multicharmap,
    },
    pretty: {
        replacement: '-',
        symbols: true,
        remove: /[.]/g,
        lower: false,
        charmap: slug.defaults.charmap,
        multicharmap: slug.defaults.multicharmap,
    },
};

// Be compatible with different module systems

if (typeof define !== 'undefined' && define.amd) { // AMD
    // dont load symbols table in the browser
    for (var key in slug.defaults.modes) {
        if (!slug.defaults.modes.hasOwnProperty(key))
            continue;

        slug.defaults.modes[key].symbols = false;
    }
    define([], function () {return slug});
} else if (typeof module !== 'undefined' && module.exports) { // CommonJS
    symbols(); // preload symbols table
    module.exports = slug;
} else { // Script tag
    // dont load symbols table in the browser
    for (var key in slug.defaults.modes) {
        if (!slug.defaults.modes.hasOwnProperty(key))
            continue;

        slug.defaults.modes[key].symbols = false;
    }
    root.slug = slug;
}

}(this));

},{"unicode/category/So":23}],40:[function(require,module,exports){
(function (global){

var rng;

if (global.crypto && crypto.getRandomValues) {
  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
  // Moderately fast, high quality
  var _rnds8 = new Uint8Array(16);
  rng = function whatwgRNG() {
    crypto.getRandomValues(_rnds8);
    return _rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var  _rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return _rnds;
  };
}

module.exports = rng;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],41:[function(require,module,exports){
//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

// Unique ID creation requires a high quality random # generator.  We feature
// detect to determine the best RNG source, normalizing to a function that
// returns 128-bits of randomness, since that's what's usually required
var _rng = require('./rng');

// Maps for number <-> hex string conversion
var _byteToHex = [];
var _hexToByte = {};
for (var i = 0; i < 256; i++) {
  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
  _hexToByte[_byteToHex[i]] = i;
}

// **`parse()` - Parse a UUID into it's component bytes**
function parse(s, buf, offset) {
  var i = (buf && offset) || 0, ii = 0;

  buf = buf || [];
  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
    if (ii < 16) { // Don't overflow!
      buf[i + ii++] = _hexToByte[oct];
    }
  });

  // Zero out remaining bytes if string was short
  while (ii < 16) {
    buf[i + ii++] = 0;
  }

  return buf;
}

// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
function unparse(buf, offset) {
  var i = offset || 0, bth = _byteToHex;
  return  bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = _rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; n++) {
    b[i + n] = node[n];
  }

  return buf ? buf : unparse(b);
}

// **`v4()` - Generate random UUID**

// See https://github.com/broofa/node-uuid for API details
function v4(options, buf, offset) {
  // Deprecated - 'format' argument, as supported in v1.2
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || _rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ii++) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || unparse(rnds);
}

// Export public API
var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;
uuid.parse = parse;
uuid.unparse = unparse;

module.exports = uuid;

},{"./rng":40}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _util = require('../util');

var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

// install v-link, which provides navigation support for
// HTML5 history mode

exports['default'] = function (Vue) {

  var _ = Vue.util;

  Vue.directive('link', {

    bind: function bind() {
      var _this = this;

      var vm = this.vm;
      /* istanbul ignore if */
      if (!vm.$route) {
        (0, _util.warn)('v-link can only be used inside a ' + 'router-enabled app.');
        return;
      }
      var router = vm.$route.router;
      this.handler = function (e) {
        // don't redirect with control keys
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        // don't redirect when preventDefault called
        if (e.defaultPrevented) return;
        // don't redirect on right click
        if (e.button !== 0) return;

        if (_this.el.tagName === 'A' || e.target === _this.el) {
          // v-link on <a v-link="'path'">
          e.preventDefault();
          if (_this.destination != null) {
            router.go(_this.destination, _this.replace === true);
          }
        } else {
          // v-link delegate on <div v-link>
          var el = e.target;
          while (el && el.tagName !== 'A' && el !== _this.el) {
            el = el.parentNode;
          }
          if (!el || el.tagName !== 'A' || !el.href) return;
          if (sameOrigin(el)) {
            e.preventDefault();
            router.go(el.pathname);
          }
        }
      };
      this.el.addEventListener('click', this.handler);
      // manage active link class
      this.unwatch = vm.$watch('$route.path', _.bind(this.updateClasses, this));
    },

    update: function update(path) {
      var router = this.vm.$route.router;
      this.replace = typeof path === 'object' ? path.replace : false;
      path = router._normalizePath(path);
      this.destination = path;
      this.activeRE = path ? new RegExp('^' + path.replace(regexEscapeRE, '\\$&') + '\\b') : null;
      this.updateClasses(this.vm.$route.path);
      var isAbsolute = path.charAt(0) === '/';
      // do not format non-hash relative paths
      var href = router.mode === 'hash' || isAbsolute ? router.history.formatPath(path) : path;
      if (this.el.tagName === 'A') {
        if (href) {
          this.el.href = href;
        } else {
          this.el.removeAttribute('href');
        }
      }
    },

    updateClasses: function updateClasses(path) {
      var el = this.el;
      var dest = this.destination;
      var router = this.vm.$route.router;
      var activeClass = router._linkActiveClass;
      var exactClass = activeClass + '-exact';
      if (this.activeRE && this.activeRE.test(path) && path !== '/') {
        _.addClass(el, activeClass);
      } else {
        _.removeClass(el, activeClass);
      }
      if (path === dest) {
        _.addClass(el, exactClass);
      } else {
        _.removeClass(el, exactClass);
      }
    },

    unbind: function unbind() {
      this.el.removeEventListener('click', this.handler);
      this.unwatch && this.unwatch();
    }
  });

  function sameOrigin(link) {
    return link.protocol === location.protocol && link.hostname === location.hostname && link.port === location.port;
  }
};

module.exports = exports['default'];
},{"../util":54}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _util = require('../util');

var _pipeline = require('../pipeline');

exports['default'] = function (Vue) {

  var _ = Vue.util;
  var componentDef =
  // 0.12
  Vue.directive('_component') ||
  // 1.0
  Vue.internalDirectives.component;
  // <router-view> extends the internal component directive
  var viewDef = _.extend({}, componentDef);

  // with some overrides
  _.extend(viewDef, {

    _isRouterView: true,

    bind: function bind() {
      var route = this.vm.$route;
      /* istanbul ignore if */
      if (!route) {
        (0, _util.warn)('<router-view> can only be used inside a ' + 'router-enabled app.');
        return;
      }
      // force dynamic directive so v-component doesn't
      // attempt to build right now
      this._isDynamicLiteral = true;
      // finally, init by delegating to v-component
      componentDef.bind.call(this);

      // does not support keep-alive.
      /* istanbul ignore if */
      if (this.keepAlive) {
        this.keepAlive = false;
        (0, _util.warn)('<router-view> does not support keep-alive.');
      }
      /* istanbul ignore if */
      if (this.waitForEvent) {
        this.waitForEvent = null;
        (0, _util.warn)('<router-view> does not support wait-for. Use ' + 'the acitvate route hook instead.');
      }

      // all we need to do here is registering this view
      // in the router. actual component switching will be
      // managed by the pipeline.
      var router = this.router = route.router;
      router._views.unshift(this);

      // note the views are in reverse order.
      var parentView = router._views[1];
      if (parentView) {
        // register self as a child of the parent view,
        // instead of activating now. This is so that the
        // child's activate hook is called after the
        // parent's has resolved.
        parentView.childView = this;
      }

      // handle late-rendered view
      // two possibilities:
      // 1. root view rendered after transition has been
      //    validated;
      // 2. child view rendered after parent view has been
      //    activated.
      var transition = route.router._currentTransition;
      if (!parentView && transition.done || parentView && parentView.activated) {
        var depth = parentView ? parentView.depth + 1 : 0;
        (0, _pipeline.activate)(this, transition, depth);
      }
    },

    unbind: function unbind() {
      this.router._views.$remove(this);
      componentDef.unbind.call(this);
    }
  });

  Vue.elementDirective('router-view', viewDef);
};

module.exports = exports['default'];
},{"../pipeline":49,"../util":54}],44:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _util = require('../util');

var AbstractHistory = (function () {
  function AbstractHistory(_ref) {
    var onChange = _ref.onChange;

    _classCallCheck(this, AbstractHistory);

    this.onChange = onChange;
    this.currentPath = '/';
  }

  _createClass(AbstractHistory, [{
    key: 'start',
    value: function start() {
      this.onChange('/');
    }
  }, {
    key: 'stop',
    value: function stop() {
      // noop
    }
  }, {
    key: 'go',
    value: function go(path) {
      path = this.currentPath = this.formatPath(path);
      this.onChange(path);
    }
  }, {
    key: 'formatPath',
    value: function formatPath(path) {
      return path.charAt(0) === '/' ? path : (0, _util.resolvePath)(this.currentPath, path);
    }
  }]);

  return AbstractHistory;
})();

exports['default'] = AbstractHistory;
module.exports = exports['default'];
},{"../util":54,"babel-runtime/helpers/class-call-check":57,"babel-runtime/helpers/create-class":58}],45:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _util = require('../util');

var HashHistory = (function () {
  function HashHistory(_ref) {
    var hashbang = _ref.hashbang;
    var onChange = _ref.onChange;

    _classCallCheck(this, HashHistory);

    this.hashbang = hashbang;
    this.onChange = onChange;
  }

  _createClass(HashHistory, [{
    key: 'start',
    value: function start() {
      var self = this;
      this.listener = function () {
        var path = location.hash;
        var formattedPath = self.formatPath(path, true);
        if (formattedPath !== path) {
          location.replace(formattedPath);
          return;
        }
        var pathToMatch = decodeURI(path.replace(/^#!?/, '') + location.search);
        self.onChange(pathToMatch);
      };
      window.addEventListener('hashchange', this.listener);
      this.listener();
    }
  }, {
    key: 'stop',
    value: function stop() {
      window.removeEventListener('hashchange', this.listener);
    }
  }, {
    key: 'go',
    value: function go(path, replace) {
      path = this.formatPath(path);
      if (replace) {
        location.replace(path);
      } else {
        location.hash = path;
      }
    }
  }, {
    key: 'formatPath',
    value: function formatPath(path, expectAbsolute) {
      path = path.replace(/^#!?/, '');
      var isAbsoloute = path.charAt(0) === '/';
      if (expectAbsolute && !isAbsoloute) {
        path = '/' + path;
      }
      var prefix = '#' + (this.hashbang ? '!' : '');
      return isAbsoloute || expectAbsolute ? prefix + path : prefix + (0, _util.resolvePath)(location.hash.replace(/^#!?/, ''), path);
    }
  }]);

  return HashHistory;
})();

exports['default'] = HashHistory;
module.exports = exports['default'];
},{"../util":54,"babel-runtime/helpers/class-call-check":57,"babel-runtime/helpers/create-class":58}],46:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _util = require('../util');

var hashRE = /#.*$/;

var HTML5History = (function () {
  function HTML5History(_ref) {
    var root = _ref.root;
    var onChange = _ref.onChange;

    _classCallCheck(this, HTML5History);

    if (root) {
      // make sure there's the starting slash
      if (root.charAt(0) !== '/') {
        root = '/' + root;
      }
      // remove trailing slash
      this.root = root.replace(/\/$/, '');
      this.rootRE = new RegExp('^\\' + this.root);
    } else {
      this.root = null;
    }
    this.onChange = onChange;
    // check base tag
    var baseEl = document.querySelector('base');
    this.base = baseEl && baseEl.getAttribute('href');
  }

  _createClass(HTML5History, [{
    key: 'start',
    value: function start() {
      var _this = this;

      this.listener = function (e) {
        var url = decodeURI(location.pathname + location.search);
        if (_this.root) {
          url = url.replace(_this.rootRE, '');
        }
        _this.onChange(url, e && e.state, location.hash);
      };
      window.addEventListener('popstate', this.listener);
      this.listener();
    }
  }, {
    key: 'stop',
    value: function stop() {
      window.removeEventListener('popstate', this.listener);
    }
  }, {
    key: 'go',
    value: function go(path, replace) {
      var root = this.root;
      var url = this.formatPath(path, root);
      if (replace) {
        history.replaceState({}, '', url);
      } else {
        // record scroll position by replacing current state
        history.replaceState({
          pos: {
            x: window.pageXOffset,
            y: window.pageYOffset
          }
        }, '');
        // then push new state
        history.pushState({}, '', url);
      }
      var hashMatch = path.match(hashRE);
      var hash = hashMatch && hashMatch[0];
      path = url
      // strip hash so it doesn't mess up params
      .replace(hashRE, '')
      // remove root before matching
      .replace(this.rootRE, '');
      this.onChange(path, null, hash);
    }
  }, {
    key: 'formatPath',
    value: function formatPath(path) {
      return path.charAt(0) === '/'
      // absolute path
      ? this.root ? this.root + '/' + path.replace(/^\//, '') : path : (0, _util.resolvePath)(this.base || location.pathname, path);
    }
  }]);

  return HTML5History;
})();

exports['default'] = HTML5History;
module.exports = exports['default'];
},{"../util":54,"babel-runtime/helpers/class-call-check":57,"babel-runtime/helpers/create-class":58}],47:[function(require,module,exports){
'use strict';

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _routeRecognizer = require('route-recognizer');

var _routeRecognizer2 = _interopRequireDefault(_routeRecognizer);

var _routerApi = require('./router/api');

var _routerApi2 = _interopRequireDefault(_routerApi);

var _routerInternal = require('./router/internal');

var _routerInternal2 = _interopRequireDefault(_routerInternal);

var _directivesView = require('./directives/view');

var _directivesView2 = _interopRequireDefault(_directivesView);

var _directivesLink = require('./directives/link');

var _directivesLink2 = _interopRequireDefault(_directivesLink);

var _override = require('./override');

var _override2 = _interopRequireDefault(_override);

var _historyAbstract = require('./history/abstract');

var _historyAbstract2 = _interopRequireDefault(_historyAbstract);

var _historyHash = require('./history/hash');

var _historyHash2 = _interopRequireDefault(_historyHash);

var _historyHtml5 = require('./history/html5');

var _historyHtml52 = _interopRequireDefault(_historyHtml5);

var historyBackends = {
  abstract: _historyAbstract2['default'],
  hash: _historyHash2['default'],
  html5: _historyHtml52['default']
};

/**
 * Router constructor
 *
 * @param {Object} [options]
 */

var Router = function Router() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$hashbang = _ref.hashbang;
  var hashbang = _ref$hashbang === undefined ? true : _ref$hashbang;
  var _ref$abstract = _ref.abstract;
  var abstract = _ref$abstract === undefined ? false : _ref$abstract;
  var _ref$history = _ref.history;
  var history = _ref$history === undefined ? false : _ref$history;
  var _ref$saveScrollPosition = _ref.saveScrollPosition;
  var saveScrollPosition = _ref$saveScrollPosition === undefined ? false : _ref$saveScrollPosition;
  var _ref$transitionOnLoad = _ref.transitionOnLoad;
  var transitionOnLoad = _ref$transitionOnLoad === undefined ? false : _ref$transitionOnLoad;
  var _ref$suppressTransitionError = _ref.suppressTransitionError;
  var suppressTransitionError = _ref$suppressTransitionError === undefined ? false : _ref$suppressTransitionError;
  var _ref$root = _ref.root;
  var root = _ref$root === undefined ? null : _ref$root;
  var _ref$linkActiveClass = _ref.linkActiveClass;
  var linkActiveClass = _ref$linkActiveClass === undefined ? 'v-link-active' : _ref$linkActiveClass;

  _classCallCheck(this, Router);

  /* istanbul ignore if */
  if (!Router.installed) {
    throw new Error('Please install the Router with Vue.use() before ' + 'creating an instance.');
  }

  // Vue instances
  this.app = null;
  this._views = [];
  this._children = [];

  // route recognizer
  this._recognizer = new _routeRecognizer2['default']();
  this._guardRecognizer = new _routeRecognizer2['default']();

  // state
  this._started = false;
  this._currentRoute = {};
  this._currentTransition = null;
  this._previousTransition = null;
  this._notFoundHandler = null;
  this._beforeEachHooks = [];
  this._afterEachHooks = [];

  // feature detection
  this._hasPushState = typeof window !== 'undefined' && window.history && window.history.pushState;

  // trigger transition on initial render?
  this._rendered = false;
  this._transitionOnLoad = transitionOnLoad;

  // history mode
  this._abstract = abstract;
  this._hashbang = hashbang;
  this._history = this._hasPushState && history;

  // other options
  this._saveScrollPosition = saveScrollPosition;
  this._linkActiveClass = linkActiveClass;
  this._suppress = suppressTransitionError;

  // create history object
  var inBrowser = _util2['default'].Vue.util.inBrowser;
  this.mode = !inBrowser || this._abstract ? 'abstract' : this._history ? 'html5' : 'hash';

  var History = historyBackends[this.mode];
  var self = this;
  this.history = new History({
    root: root,
    hashbang: this._hashbang,
    onChange: function onChange(path, state, anchor) {
      self._match(path, state, anchor);
    }
  });
};

exports['default'] = Router;

Router.installed = false;

/**
 * Installation interface.
 * Install the necessary directives.
 */

Router.install = function (Vue) {
  /* istanbul ignore if */
  if (Router.installed) {
    (0, _util.warn)('already installed.');
    return;
  }
  (0, _routerApi2['default'])(Vue, Router);
  (0, _routerInternal2['default'])(Vue, Router);
  (0, _directivesView2['default'])(Vue);
  (0, _directivesLink2['default'])(Vue);
  (0, _override2['default'])(Vue);
  _util2['default'].Vue = Vue;
  // 1.0 only: enable route mixins
  var strats = Vue.config.optionMergeStrategies;
  if (strats) {
    // use the same merge strategy as methods (object hash)
    strats.route = strats.methods;
  }
  Router.installed = true;
};

// auto install
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Router);
}
module.exports = exports['default'];
},{"./directives/link":42,"./directives/view":43,"./history/abstract":44,"./history/hash":45,"./history/html5":46,"./override":48,"./router/api":51,"./router/internal":52,"./util":54,"babel-runtime/helpers/class-call-check":57,"babel-runtime/helpers/interop-require-default":59,"route-recognizer":71}],48:[function(require,module,exports){
// overriding Vue's $addChild method, so that every child
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (Vue) {

  var addChild = Vue.prototype.$addChild;

  Vue.prototype.$addChild = function (opts, Ctor) {

    var route = this.$route;
    var router = route && route.router;

    // inject meta
    if (router) {
      opts = opts || {};
      var meta = opts._meta = opts._meta || {};
      meta.$route = route;
      if (opts._isRouterView) {
        meta.$loadingRouteData = meta.$loadingRouteData || false;
      }
    }

    var child = addChild.call(this, opts, Ctor);

    if (router) {
      // keep track of all children created so we can
      // update the routes
      router._children.push(child);
      child.$on('hook:beforeDestroy', function () {
        router._children.$remove(child);
      });
    }

    return child;
  };
};

module.exports = exports['default'];
// instance inherits the route data
},{}],49:[function(require,module,exports){
'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.canReuse = canReuse;
exports.canDeactivate = canDeactivate;
exports.canActivate = canActivate;
exports.deactivate = deactivate;
exports.activate = activate;
exports.reuse = reuse;

var _util = require('./util');

/**
 * Determine the reusability of an existing router view.
 *
 * @param {Directive} view
 * @param {Object} handler
 * @param {Transition} transition
 */

function canReuse(view, handler, transition) {
  var component = view.childVM;
  if (!component || !handler) {
    return false;
  }
  // important: check view.Component here because it may
  // have been changed in activate hook
  if (view.Component !== handler.component) {
    return false;
  }
  var canReuseFn = (0, _util.getRouteConfig)(component, 'canReuse');
  return typeof canReuseFn === 'boolean' ? canReuseFn : canReuseFn ? canReuseFn.call(component, {
    to: transition.to,
    from: transition.from
  }) : true; // defaults to true
}

/**
 * Check if a component can deactivate.
 *
 * @param {Directive} view
 * @param {Transition} transition
 * @param {Function} next
 */

function canDeactivate(view, transition, next) {
  var fromComponent = view.childVM;
  var hook = (0, _util.getRouteConfig)(fromComponent, 'canDeactivate');
  if (!hook) {
    next();
  } else {
    transition.callHook(hook, fromComponent, next, {
      expectBoolean: true
    });
  }
}

/**
 * Check if a component can activate.
 *
 * @param {Object} handler
 * @param {Transition} transition
 * @param {Function} next
 */

function canActivate(handler, transition, next) {
  (0, _util.resolveAsyncComponent)(handler, function (Component) {
    // have to check due to async-ness
    if (transition.aborted) {
      return;
    }
    // determine if this component can be activated
    var hook = (0, _util.getRouteConfig)(Component, 'canActivate');
    if (!hook) {
      next();
    } else {
      transition.callHook(hook, null, next, {
        expectBoolean: true
      });
    }
  });
}

/**
 * Call deactivate hooks for existing router-views.
 *
 * @param {Directive} view
 * @param {Transition} transition
 * @param {Function} next
 */

function deactivate(view, transition, next) {
  var component = view.childVM;
  var hook = (0, _util.getRouteConfig)(component, 'deactivate');
  if (!hook) {
    next();
  } else {
    transition.callHook(hook, component, next);
  }
}

/**
 * Activate / switch component for a router-view.
 *
 * @param {Directive} view
 * @param {Transition} transition
 * @param {Number} depth
 * @param {Function} [cb]
 */

function activate(view, transition, depth, cb) {
  var handler = transition.activateQueue[depth];
  if (!handler) {
    // fix 1.0.0-alpha.3 compat
    if (view._bound) {
      view.setComponent(null);
    }
    cb && cb();
    return;
  }

  var Component = view.Component = handler.component;
  var activateHook = (0, _util.getRouteConfig)(Component, 'activate');
  var dataHook = (0, _util.getRouteConfig)(Component, 'data');
  var waitForData = (0, _util.getRouteConfig)(Component, 'waitForData');

  view.depth = depth;
  view.activated = false;

  // unbuild current component. this step also destroys
  // and removes all nested child views.
  view.unbuild(true);
  // build the new component. this will also create the
  // direct child view of the current one. it will register
  // itself as view.childView.
  var component = view.build({
    _meta: {
      $loadingRouteData: !!(dataHook && !waitForData)
    }
  });

  // cleanup the component in case the transition is aborted
  // before the component is ever inserted.
  var cleanup = function cleanup() {
    component.$destroy();
  };

  // actually insert the component and trigger transition
  var insert = function insert() {
    var router = transition.router;
    if (router._rendered || router._transitionOnLoad) {
      view.transition(component);
    } else {
      // no transition on first render, manual transition
      if (view.setCurrent) {
        // 0.12 compat
        view.setCurrent(component);
      } else {
        // 1.0
        view.childVM = component;
      }
      component.$before(view.anchor, null, false);
    }
    cb && cb();
  };

  // called after activation hook is resolved
  var afterActivate = function afterActivate() {
    view.activated = true;
    // activate the child view
    if (view.childView) {
      exports.activate(view.childView, transition, depth + 1);
    }
    if (dataHook && waitForData) {
      // wait until data loaded to insert
      loadData(component, transition, dataHook, insert, cleanup);
    } else {
      // load data and insert at the same time
      if (dataHook) {
        loadData(component, transition, dataHook);
      }
      insert();
    }
  };

  if (activateHook) {
    transition.callHook(activateHook, component, afterActivate, {
      cleanup: cleanup
    });
  } else {
    afterActivate();
  }
}

/**
 * Reuse a view, just reload data if necessary.
 *
 * @param {Directive} view
 * @param {Transition} transition
 */

function reuse(view, transition) {
  var component = view.childVM;
  var dataHook = (0, _util.getRouteConfig)(component, 'data');
  if (dataHook) {
    loadData(component, transition, dataHook);
  }
}

/**
 * Asynchronously load and apply data to component.
 *
 * @param {Vue} component
 * @param {Transition} transition
 * @param {Function} hook
 * @param {Function} cb
 * @param {Function} cleanup
 */

function loadData(component, transition, hook, cb, cleanup) {
  component.$loadingRouteData = true;
  transition.callHook(hook, component, function (data, onError) {
    var promises = [];
    _Object$keys(data).forEach(function (key) {
      var val = data[key];
      if ((0, _util.isPromise)(val)) {
        promises.push(val.then(function (resolvedVal) {
          component.$set(key, resolvedVal);
        }));
      } else {
        component.$set(key, val);
      }
    });
    if (!promises.length) {
      component.$loadingRouteData = false;
    } else {
      promises[0].constructor.all(promises).then(function (_) {
        component.$loadingRouteData = false;
      }, onError);
    }
    cb && cb(data);
  }, {
    cleanup: cleanup,
    expectData: true
  });
}
},{"./util":54,"babel-runtime/core-js/object/keys":56}],50:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});
var internalKeysRE = /^(component|subRoutes)$/;

/**
 * Route Context Object
 *
 * @param {String} path
 * @param {Router} router
 */

var Route = function Route(path, router) {
  var _this = this;

  _classCallCheck(this, Route);

  var matched = router._recognizer.recognize(path);
  if (matched) {
    // copy all custom fields from route configs
    [].forEach.call(matched, function (match) {
      for (var key in match.handler) {
        if (!internalKeysRE.test(key)) {
          _this[key] = match.handler[key];
        }
      }
    });
    // set query and params
    this.query = matched.queryParams;
    this.params = [].reduce.call(matched, function (prev, cur) {
      if (cur.params) {
        for (var key in cur.params) {
          prev[key] = cur.params[key];
        }
      }
      return prev;
    }, {});
  }
  // expose path and router
  this.path = path;
  this.router = router;
  // for internal use
  this._matched = matched || router._notFoundHandler;
};

exports["default"] = Route;
module.exports = exports["default"];
},{"babel-runtime/helpers/class-call-check":57}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _util = require('../util');

exports['default'] = function (Vue, Router) {

  /**
   * Register a map of top-level paths.
   *
   * @param {Object} map
   */

  Router.prototype.map = function (map) {
    for (var route in map) {
      this.on(route, map[route]);
    }
  };

  /**
   * Register a single root-level path
   *
   * @param {String} rootPath
   * @param {Object} handler
   *                 - {String} component
   *                 - {Object} [subRoutes]
   *                 - {Boolean} [forceRefresh]
   *                 - {Function} [before]
   *                 - {Function} [after]
   */

  Router.prototype.on = function (rootPath, handler) {
    if (rootPath === '*') {
      this._notFound(handler);
    } else {
      this._addRoute(rootPath, handler, []);
    }
  };

  /**
   * Set redirects.
   *
   * @param {Object} map
   */

  Router.prototype.redirect = function (map) {
    for (var path in map) {
      this._addRedirect(path, map[path]);
    }
  };

  /**
   * Set aliases.
   *
   * @param {Object} map
   */

  Router.prototype.alias = function (map) {
    for (var path in map) {
      this._addAlias(path, map[path]);
    }
  };

  /**
   * Set global before hook.
   *
   * @param {Function} fn
   */

  Router.prototype.beforeEach = function (fn) {
    this._beforeEachHooks.push(fn);
  };

  /**
   * Set global after hook.
   *
   * @param {Function} fn
   */

  Router.prototype.afterEach = function (fn) {
    this._afterEachHooks.push(fn);
  };

  /**
   * Navigate to a given path.
   * The path can be an object describing a named path in
   * the format of { name: '...', params: {}, query: {}}
   * The path is assumed to be already decoded, and will
   * be resolved against root (if provided)
   *
   * @param {String|Object} path
   * @param {Boolean} [replace]
   */

  Router.prototype.go = function (path, replace) {
    path = this._normalizePath(path);
    this.history.go(path, replace);
  };

  /**
   * Short hand for replacing current path
   *
   * @param {String} path
   */

  Router.prototype.replace = function (path) {
    this.go(path, true);
  };

  /**
   * Start the router.
   *
   * @param {VueConstructor} App
   * @param {String|Element} container
   */

  Router.prototype.start = function (App, container) {
    /* istanbul ignore if */
    if (this._started) {
      (0, _util.warn)('already started.');
      return;
    }
    this._started = true;
    if (!this.app) {
      /* istanbul ignore if */
      if (!App || !container) {
        throw new Error('Must start vue-router with a component and a ' + 'root container.');
      }
      this._appContainer = container;
      this._appConstructor = typeof App === 'function' ? App : Vue.extend(App);
    }
    this.history.start();
  };

  /**
   * Stop listening to route changes.
   */

  Router.prototype.stop = function () {
    this.history.stop();
    this._started = false;
  };
};

module.exports = exports['default'];
},{"../util":54}],52:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _util = require('../util');

var _route = require('../route');

var _route2 = _interopRequireDefault(_route);

var _transition = require('../transition');

var _transition2 = _interopRequireDefault(_transition);

exports['default'] = function (Vue, Router) {

  var _ = Vue.util;

  /**
   * Add a route containing a list of segments to the internal
   * route recognizer. Will be called recursively to add all
   * possible sub-routes.
   *
   * @param {String} path
   * @param {Object} handler
   * @param {Array} segments
   */

  Router.prototype._addRoute = function (path, handler, segments) {
    guardComponent(handler);
    segments.push({
      path: path,
      handler: handler
    });
    this._recognizer.add(segments, {
      as: handler.name
    });
    // add sub routes
    if (handler.subRoutes) {
      for (var subPath in handler.subRoutes) {
        // recursively walk all sub routes
        this._addRoute(subPath, handler.subRoutes[subPath],
        // pass a copy in recursion to avoid mutating
        // across branches
        segments.slice());
      }
    }
  };

  /**
   * Set the notFound route handler.
   *
   * @param {Object} handler
   */

  Router.prototype._notFound = function (handler) {
    guardComponent(handler);
    this._notFoundHandler = [{ handler: handler }];
  };

  /**
   * Add a redirect record.
   *
   * @param {String} path
   * @param {String} redirectPath
   */

  Router.prototype._addRedirect = function (path, redirectPath) {
    this._addGuard(path, redirectPath, this.replace);
  };

  /**
   * Add an alias record.
   *
   * @param {String} path
   * @param {String} aliasPath
   */

  Router.prototype._addAlias = function (path, aliasPath) {
    this._addGuard(path, aliasPath, this._match);
  };

  /**
   * Add a path guard.
   *
   * @param {String} path
   * @param {String} mappedPath
   * @param {Function} handler
   */

  Router.prototype._addGuard = function (path, mappedPath, _handler) {
    var _this = this;

    this._guardRecognizer.add([{
      path: path,
      handler: function handler(match, query) {
        var realPath = (0, _util.mapParams)(mappedPath, match.params, query);
        _handler.call(_this, realPath);
      }
    }]);
  };

  /**
   * Check if a path matches any redirect records.
   *
   * @param {String} path
   * @return {Boolean} - if true, will skip normal match.
   */

  Router.prototype._checkGuard = function (path) {
    var matched = this._guardRecognizer.recognize(path);
    if (matched) {
      matched[0].handler(matched[0], matched.queryParams);
      return true;
    }
  };

  /**
   * Match a URL path and set the route context on vm,
   * triggering view updates.
   *
   * @param {String} path
   * @param {Object} [state]
   * @param {String} [anchor]
   */

  Router.prototype._match = function (path, state, anchor) {
    var _this2 = this;

    if (this._checkGuard(path)) {
      return;
    }

    var prevRoute = this._currentRoute;
    var prevTransition = this._currentTransition;

    // do nothing if going to the same route.
    // the route only changes when a transition successfully
    // reaches activation; we don't need to do anything
    // if an ongoing transition is aborted during validation
    // phase.
    if (prevTransition && path === prevRoute.path) {
      return;
    }

    // construct new route and transition context
    var route = new _route2['default'](path, this);
    var transition = new _transition2['default'](this, route, prevRoute);
    this._prevTransition = prevTransition;
    this._currentTransition = transition;

    if (!this.app) {
      // initial render
      this.app = new this._appConstructor({
        el: this._appContainer,
        _meta: {
          $route: route
        }
      });
    }

    // check global before hook
    var beforeHooks = this._beforeEachHooks;
    var startTransition = function startTransition() {
      transition.start(function () {
        _this2._postTransition(route, state, anchor);
      });
    };

    if (beforeHooks.length) {
      transition.runQueue(beforeHooks, function (hook, _, next) {
        if (transition === _this2._currentTransition) {
          transition.callHook(hook, null, next, true);
        }
      }, startTransition);
    } else {
      startTransition();
    }

    // HACK:
    // set rendered to true after the transition start, so
    // that components that are acitvated synchronously know
    // whether it is the initial render.
    this._rendered = true;
  };

  /**
   * Set current to the new transition.
   * This is called by the transition object when the
   * validation of a route has succeeded.
   *
   * @param {RouteTransition} transition
   */

  Router.prototype._onTransitionValidated = function (transition) {
    // now that this one is validated, we can abort
    // the previous transition.
    var prevTransition = this._prevTransition;
    if (prevTransition) {
      prevTransition.aborted = true;
    }
    // set current route
    var route = this._currentRoute = transition.to;
    // update route context for all children
    if (this.app.$route !== route) {
      this.app.$route = route;
      this._children.forEach(function (child) {
        child.$route = route;
      });
    }
    // call global after hook
    if (this._afterEachHooks.length) {
      this._afterEachHooks.forEach(function (hook) {
        return hook.call(null, {
          to: transition.to,
          from: transition.from
        });
      });
    }
    this._currentTransition.done = true;
  };

  /**
   * Handle stuff after the transition.
   *
   * @param {Route} route
   * @param {Object} [state]
   * @param {String} [anchor]
   */

  Router.prototype._postTransition = function (route, state, anchor) {
    // handle scroll positions
    // saved scroll positions take priority
    // then we check if the path has an anchor
    var pos = state && state.pos;
    if (pos && this._saveScrollPosition) {
      Vue.nextTick(function () {
        window.scrollTo(pos.x, pos.y);
      });
    } else if (anchor) {
      Vue.nextTick(function () {
        var el = document.getElementById(anchor.slice(1));
        if (el) {
          window.scrollTo(window.scrollX, el.offsetTop);
        }
      });
    }
  };

  /**
   * Normalize named route object / string paths into
   * a string.
   *
   * @param {Object|String|Number} path
   * @return {String}
   */

  Router.prototype._normalizePath = function (path) {
    if (typeof path === 'object') {
      if (path.name) {
        var params = path.params || {};
        if (path.query) {
          params.queryParams = path.query;
        }
        return this._recognizer.generate(path.name, params);
      } else if (path.path) {
        return path.path;
      } else {
        return '';
      }
    } else {
      return path + '';
    }
  };

  /**
   * Allow directly passing components to a route
   * definition.
   *
   * @param {Object} handler
   */

  function guardComponent(handler) {
    var comp = handler.component;
    if (_.isPlainObject(comp)) {
      comp = handler.component = Vue.extend(comp);
    }
    /* istanbul ignore if */
    if (typeof comp !== 'function') {
      handler.component = null;
      (0, _util.warn)('invalid component for route "' + handler.path + '"');
    }
  }
};

module.exports = exports['default'];
},{"../route":50,"../transition":53,"../util":54,"babel-runtime/helpers/interop-require-default":59}],53:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _util = require('./util');

var _pipeline = require('./pipeline');

/**
 * A RouteTransition object manages the pipeline of a
 * router-view switching process. This is also the object
 * passed into user route hooks.
 *
 * @param {Router} router
 * @param {Route} to
 * @param {Route} from
 */

var RouteTransition = (function () {
  function RouteTransition(router, to, from) {
    _classCallCheck(this, RouteTransition);

    this.router = router;
    this.to = to;
    this.from = from;
    this.next = null;
    this.aborted = false;
    this.done = false;

    // start by determine the queues

    // the deactivate queue is an array of router-view
    // directive instances that need to be deactivated,
    // deepest first.
    this.deactivateQueue = router._views;

    // check the default handler of the deepest match
    var matched = to._matched ? Array.prototype.slice.call(to._matched) : [];

    // the activate queue is an array of route handlers
    // that need to be activated
    this.activateQueue = matched.map(function (match) {
      return match.handler;
    });
  }

  /**
   * Abort current transition and return to previous location.
   */

  _createClass(RouteTransition, [{
    key: 'abort',
    value: function abort() {
      if (!this.aborted) {
        this.aborted = true;
        // if the root path throws an error during validation
        // on initial load, it gets caught in an infinite loop.
        var abortingOnLoad = !this.from.path && this.to.path === '/';
        if (!abortingOnLoad) {
          this.router.replace(this.from.path || '/');
        }
      }
    }

    /**
     * Abort current transition and redirect to a new location.
     *
     * @param {String} path
     */

  }, {
    key: 'redirect',
    value: function redirect(path) {
      if (!this.aborted) {
        this.aborted = true;
        if (typeof path === 'string') {
          path = (0, _util.mapParams)(path, this.to.params, this.to.query);
        } else {
          path.params = this.to.params;
          path.query = this.to.query;
        }
        this.router.replace(path);
      }
    }

    /**
     * A router view transition's pipeline can be described as
     * follows, assuming we are transitioning from an existing
     * <router-view> chain [Component A, Component B] to a new
     * chain [Component A, Component C]:
     *
     *  A    A
     *  | => |
     *  B    C
     *
     * 1. Reusablity phase:
     *   -> canReuse(A, A)
     *   -> canReuse(B, C)
     *   -> determine new queues:
     *      - deactivation: [B]
     *      - activation: [C]
     *
     * 2. Validation phase:
     *   -> canDeactivate(B)
     *   -> canActivate(C)
     *
     * 3. Activation phase:
     *   -> deactivate(B)
     *   -> activate(C)
     *
     * Each of these steps can be asynchronous, and any
     * step can potentially abort the transition.
     *
     * @param {Function} cb
     */

  }, {
    key: 'start',
    value: function start(cb) {
      var transition = this;
      var daq = this.deactivateQueue;
      var aq = this.activateQueue;
      var rdaq = daq.slice().reverse();
      var reuseQueue = undefined;

      // 1. Reusability phase
      var i = undefined;
      for (i = 0; i < rdaq.length; i++) {
        if (!(0, _pipeline.canReuse)(rdaq[i], aq[i], transition)) {
          break;
        }
      }
      if (i > 0) {
        reuseQueue = rdaq.slice(0, i);
        daq = rdaq.slice(i).reverse();
        aq = aq.slice(i);
      }

      // 2. Validation phase
      transition.runQueue(daq, _pipeline.canDeactivate, function () {
        transition.runQueue(aq, _pipeline.canActivate, function () {
          transition.runQueue(daq, _pipeline.deactivate, function () {
            // 3. Activation phase

            // Update router current route
            transition.router._onTransitionValidated(transition);

            // trigger reuse for all reused views
            reuseQueue && reuseQueue.forEach(function (view) {
              (0, _pipeline.reuse)(view, transition);
            });

            // the root of the chain that needs to be replaced
            // is the top-most non-reusable view.
            if (daq.length) {
              var view = daq[daq.length - 1];
              var depth = reuseQueue ? reuseQueue.length : 0;
              (0, _pipeline.activate)(view, transition, depth, cb);
            } else {
              cb();
            }
          });
        });
      });
    }

    /**
     * Asynchronously and sequentially apply a function to a
     * queue.
     *
     * @param {Array} queue
     * @param {Function} fn
     * @param {Function} cb
     */

  }, {
    key: 'runQueue',
    value: function runQueue(queue, fn, cb) {
      var transition = this;
      step(0);
      function step(index) {
        if (index >= queue.length) {
          cb();
        } else {
          fn(queue[index], transition, function () {
            step(index + 1);
          });
        }
      }
    }

    /**
     * Call a user provided route transition hook and handle
     * the response (e.g. if the user returns a promise).
     *
     * @param {Function} hook
     * @param {*} [context]
     * @param {Function} [cb]
     * @param {Object} [options]
     *                 - {Boolean} expectBoolean
     *                 - {Boolean} expectData
     *                 - {Function} cleanup
     */

  }, {
    key: 'callHook',
    value: function callHook(hook, context, cb) {
      var _ref = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

      var _ref$expectBoolean = _ref.expectBoolean;
      var expectBoolean = _ref$expectBoolean === undefined ? false : _ref$expectBoolean;
      var _ref$expectData = _ref.expectData;
      var expectData = _ref$expectData === undefined ? false : _ref$expectData;
      var cleanup = _ref.cleanup;

      var transition = this;
      var nextCalled = false;

      // abort the transition
      var abort = function abort(back) {
        cleanup && cleanup();
        transition.abort(back);
      };

      // handle errors
      var onError = function onError(err) {
        // cleanup indicates an after-activation hook,
        // so instead of aborting we just let the transition
        // finish.
        cleanup ? next() : abort();
        if (err && !transition.router._suppress) {
          (0, _util.warn)('Uncaught error during transition: ');
          throw err instanceof Error ? err : new Error(err);
        }
      };

      // advance the transition to the next step
      var next = function next(data) {
        if (nextCalled) {
          (0, _util.warn)('transition.next() should be called only once.');
          return;
        }
        nextCalled = true;
        if (!cb || transition.aborted) {
          return;
        }
        cb(data, onError);
      };

      // expose a clone of the transition object, so that each
      // hook gets a clean copy and prevent the user from
      // messing with the internals.
      var exposed = {
        to: transition.to,
        from: transition.from,
        abort: abort,
        next: next,
        redirect: function redirect() {
          transition.redirect.apply(transition, arguments);
        }
      };

      // actually call the hook
      var res = undefined;
      try {
        res = hook.call(context, exposed);
      } catch (err) {
        return onError(err);
      }

      // handle boolean/promise return values
      var resIsPromise = (0, _util.isPromise)(res);
      if (expectBoolean) {
        if (typeof res === 'boolean') {
          res ? next() : abort();
        } else if (resIsPromise) {
          res.then(function (ok) {
            ok ? next() : abort();
          }, onError);
        }
      } else if (resIsPromise) {
        res.then(next, onError);
      } else if (expectData && isPlainOjbect(res)) {
        next(res);
      }
    }
  }]);

  return RouteTransition;
})();

exports['default'] = RouteTransition;

function isPlainOjbect(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}
module.exports = exports['default'];
},{"./pipeline":49,"./util":54,"babel-runtime/helpers/class-call-check":57,"babel-runtime/helpers/create-class":58}],54:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.warn = warn;
exports.resolvePath = resolvePath;
exports.isPromise = isPromise;
exports.getRouteConfig = getRouteConfig;
exports.resolveAsyncComponent = resolveAsyncComponent;
exports.mapParams = mapParams;

var _routeRecognizer = require('route-recognizer');

var _routeRecognizer2 = _interopRequireDefault(_routeRecognizer);

var genQuery = _routeRecognizer2['default'].prototype.generateQueryString;

// export default for holding the Vue reference
var _exports = {};
exports['default'] = _exports;

/**
 * Warn stuff.
 *
 * @param {String} msg
 * @param {Error} [err]
 */

function warn(msg, err) {
  /* istanbul ignore next */
  if (window.console) {
    console.warn('[vue-router] ' + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}

/**
 * Resolve a relative path.
 *
 * @param {String} base
 * @param {String} relative
 * @return {String}
 */

function resolvePath(base, relative) {
  var query = base.match(/(\?.*)$/);
  if (query) {
    query = query[1];
    base = base.slice(0, -query.length);
  }
  // a query!
  if (relative.charAt(0) === '?') {
    return base + relative;
  }
  var stack = base.split('/');
  // remove trailing segment
  stack.pop();
  // resolve relative path
  var segments = relative.split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '.') {
      continue;
    } else if (segment === '..') {
      stack.pop();
    } else {
      stack.push(segment);
    }
  }
  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }
  return stack.join('/');
}

/**
 * Forgiving check for a promise
 *
 * @param {Object} p
 * @return {Boolean}
 */

function isPromise(p) {
  return p && typeof p.then === 'function';
}

/**
 * Retrive a route config field from a component instance
 * OR a component contructor.
 *
 * @param {Function|Vue} component
 * @param {String} name
 * @return {*}
 */

function getRouteConfig(component, name) {
  var options = component && (component.$options || component.options);
  return options && options.route && options.route[name];
}

/**
 * Resolve an async component factory. Have to do a dirty
 * mock here because of Vue core's internal API depends on
 * an ID check.
 *
 * @param {Object} handler
 * @param {Function} cb
 */

var resolver = undefined;

function resolveAsyncComponent(handler, cb) {
  if (!resolver) {
    resolver = {
      resolve: _exports.Vue.prototype._resolveComponent,
      $options: {
        components: {
          _: handler.component
        }
      }
    };
  } else {
    resolver.$options.components._ = handler.component;
  }
  resolver.resolve('_', function (Component) {
    handler.component = Component;
    cb(Component);
  });
}

/**
 * Map the dynamic segments in a path to params.
 *
 * @param {String} path
 * @param {Object} params
 * @param {Object} query
 */

function mapParams(path, params, query) {
  for (var key in params) {
    path = replaceParam(path, params, key);
  }
  if (query) {
    path += genQuery(query);
  }
  return path;
}

/**
 * Replace a param segment with real value in a matched
 * path.
 *
 * @param {String} path
 * @param {Object} params
 * @param {String} key
 * @return {String}
 */

function replaceParam(path, params, key) {
  var regex = new RegExp(':' + key + '(\\/|$)');
  var value = params[key];
  return path.replace(regex, function (m) {
    return m.charAt(m.length - 1) === '/' ? value + '/' : value;
  });
}
},{"babel-runtime/helpers/interop-require-default":59,"route-recognizer":71}],55:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":60}],56:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":61}],57:[function(require,module,exports){
"use strict";

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],58:[function(require,module,exports){
"use strict";

var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];

exports["default"] = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;

      _Object$defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/object/define-property":55}],59:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
};

exports.__esModule = true;
},{}],60:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":67}],61:[function(require,module,exports){
require('../../modules/es6.object.keys');
module.exports = require('../../modules/$.core').Object.keys;
},{"../../modules/$.core":62,"../../modules/es6.object.keys":70}],62:[function(require,module,exports){
var core = module.exports = {version: '1.2.1'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],63:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , PROTOTYPE = 'prototype';
var ctx = function(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
};
var $def = function(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] : (global[name] || {})[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    if(isGlobal && typeof target[key] != 'function')exp = source[key];
    // bind timers to global for call from export context
    else if(type & $def.B && own)exp = ctx(out, global);
    // wrap global constructors for prevent change them in library
    else if(type & $def.W && target[key] == out)!function(C){
      exp = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      exp[PROTOTYPE] = C[PROTOTYPE];
    }(out);
    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export
    exports[key] = exp;
    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
module.exports = $def;
},{"./$.core":62,"./$.global":66}],64:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],65:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],66:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var UNDEFINED = 'undefined';
var global = module.exports = typeof window != UNDEFINED && window.Math == Math
  ? window : typeof self != UNDEFINED && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],67:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],68:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
module.exports = function(KEY, exec){
  var $def = require('./$.def')
    , fn   = (require('./$.core').Object || {})[KEY] || Object[KEY]
    , exp  = {};
  exp[KEY] = exec(fn);
  $def($def.S + $def.F * require('./$.fails')(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":62,"./$.def":63,"./$.fails":65}],69:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":64}],70:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./$.object-sap":68,"./$.to-object":69}],71:[function(require,module,exports){
(function() {
    "use strict";
    function $$route$recognizer$dsl$$Target(path, matcher, delegate) {
      this.path = path;
      this.matcher = matcher;
      this.delegate = delegate;
    }

    $$route$recognizer$dsl$$Target.prototype = {
      to: function(target, callback) {
        var delegate = this.delegate;

        if (delegate && delegate.willAddRoute) {
          target = delegate.willAddRoute(this.matcher.target, target);
        }

        this.matcher.add(this.path, target);

        if (callback) {
          if (callback.length === 0) { throw new Error("You must have an argument in the function passed to `to`"); }
          this.matcher.addChild(this.path, target, callback, this.delegate);
        }
        return this;
      }
    };

    function $$route$recognizer$dsl$$Matcher(target) {
      this.routes = {};
      this.children = {};
      this.target = target;
    }

    $$route$recognizer$dsl$$Matcher.prototype = {
      add: function(path, handler) {
        this.routes[path] = handler;
      },

      addChild: function(path, target, callback, delegate) {
        var matcher = new $$route$recognizer$dsl$$Matcher(target);
        this.children[path] = matcher;

        var match = $$route$recognizer$dsl$$generateMatch(path, matcher, delegate);

        if (delegate && delegate.contextEntered) {
          delegate.contextEntered(target, match);
        }

        callback(match);
      }
    };

    function $$route$recognizer$dsl$$generateMatch(startingPath, matcher, delegate) {
      return function(path, nestedCallback) {
        var fullPath = startingPath + path;

        if (nestedCallback) {
          nestedCallback($$route$recognizer$dsl$$generateMatch(fullPath, matcher, delegate));
        } else {
          return new $$route$recognizer$dsl$$Target(startingPath + path, matcher, delegate);
        }
      };
    }

    function $$route$recognizer$dsl$$addRoute(routeArray, path, handler) {
      var len = 0;
      for (var i=0, l=routeArray.length; i<l; i++) {
        len += routeArray[i].path.length;
      }

      path = path.substr(len);
      var route = { path: path, handler: handler };
      routeArray.push(route);
    }

    function $$route$recognizer$dsl$$eachRoute(baseRoute, matcher, callback, binding) {
      var routes = matcher.routes;

      for (var path in routes) {
        if (routes.hasOwnProperty(path)) {
          var routeArray = baseRoute.slice();
          $$route$recognizer$dsl$$addRoute(routeArray, path, routes[path]);

          if (matcher.children[path]) {
            $$route$recognizer$dsl$$eachRoute(routeArray, matcher.children[path], callback, binding);
          } else {
            callback.call(binding, routeArray);
          }
        }
      }
    }

    var $$route$recognizer$dsl$$default = function(callback, addRouteCallback) {
      var matcher = new $$route$recognizer$dsl$$Matcher();

      callback($$route$recognizer$dsl$$generateMatch("", matcher, this.delegate));

      $$route$recognizer$dsl$$eachRoute([], matcher, function(route) {
        if (addRouteCallback) { addRouteCallback(this, route); }
        else { this.add(route); }
      }, this);
    };

    var $$route$recognizer$$specials = [
      '/', '.', '*', '+', '?', '|',
      '(', ')', '[', ']', '{', '}', '\\'
    ];

    var $$route$recognizer$$escapeRegex = new RegExp('(\\' + $$route$recognizer$$specials.join('|\\') + ')', 'g');

    function $$route$recognizer$$isArray(test) {
      return Object.prototype.toString.call(test) === "[object Array]";
    }

    // A Segment represents a segment in the original route description.
    // Each Segment type provides an `eachChar` and `regex` method.
    //
    // The `eachChar` method invokes the callback with one or more character
    // specifications. A character specification consumes one or more input
    // characters.
    //
    // The `regex` method returns a regex fragment for the segment. If the
    // segment is a dynamic of star segment, the regex fragment also includes
    // a capture.
    //
    // A character specification contains:
    //
    // * `validChars`: a String with a list of all valid characters, or
    // * `invalidChars`: a String with a list of all invalid characters
    // * `repeat`: true if the character specification can repeat

    function $$route$recognizer$$StaticSegment(string) { this.string = string; }
    $$route$recognizer$$StaticSegment.prototype = {
      eachChar: function(callback) {
        var string = this.string, ch;

        for (var i=0, l=string.length; i<l; i++) {
          ch = string.charAt(i);
          callback({ validChars: ch });
        }
      },

      regex: function() {
        return this.string.replace($$route$recognizer$$escapeRegex, '\\$1');
      },

      generate: function() {
        return this.string;
      }
    };

    function $$route$recognizer$$DynamicSegment(name) { this.name = name; }
    $$route$recognizer$$DynamicSegment.prototype = {
      eachChar: function(callback) {
        callback({ invalidChars: "/", repeat: true });
      },

      regex: function() {
        return "([^/]+)";
      },

      generate: function(params) {
        return params[this.name];
      }
    };

    function $$route$recognizer$$StarSegment(name) { this.name = name; }
    $$route$recognizer$$StarSegment.prototype = {
      eachChar: function(callback) {
        callback({ invalidChars: "", repeat: true });
      },

      regex: function() {
        return "(.+)";
      },

      generate: function(params) {
        return params[this.name];
      }
    };

    function $$route$recognizer$$EpsilonSegment() {}
    $$route$recognizer$$EpsilonSegment.prototype = {
      eachChar: function() {},
      regex: function() { return ""; },
      generate: function() { return ""; }
    };

    function $$route$recognizer$$parse(route, names, specificity) {
      // normalize route as not starting with a "/". Recognition will
      // also normalize.
      if (route.charAt(0) === "/") { route = route.substr(1); }

      var segments = route.split("/"), results = [];

      // A routes has specificity determined by the order that its different segments
      // appear in. This system mirrors how the magnitude of numbers written as strings
      // works.
      // Consider a number written as: "abc". An example would be "200". Any other number written
      // "xyz" will be smaller than "abc" so long as `a > z`. For instance, "199" is smaller
      // then "200", even though "y" and "z" (which are both 9) are larger than "0" (the value
      // of (`b` and `c`). This is because the leading symbol, "2", is larger than the other
      // leading symbol, "1".
      // The rule is that symbols to the left carry more weight than symbols to the right
      // when a number is written out as a string. In the above strings, the leading digit
      // represents how many 100's are in the number, and it carries more weight than the middle
      // number which represents how many 10's are in the number.
      // This system of number magnitude works well for route specificity, too. A route written as
      // `a/b/c` will be more specific than `x/y/z` as long as `a` is more specific than
      // `x`, irrespective of the other parts.
      // Because of this similarity, we assign each type of segment a number value written as a
      // string. We can find the specificity of compound routes by concatenating these strings
      // together, from left to right. After we have looped through all of the segments,
      // we convert the string to a number.
      specificity.val = '';

      for (var i=0, l=segments.length; i<l; i++) {
        var segment = segments[i], match;

        if (match = segment.match(/^:([^\/]+)$/)) {
          results.push(new $$route$recognizer$$DynamicSegment(match[1]));
          names.push(match[1]);
          specificity.val += '3';
        } else if (match = segment.match(/^\*([^\/]+)$/)) {
          results.push(new $$route$recognizer$$StarSegment(match[1]));
          specificity.val += '2';
          names.push(match[1]);
        } else if(segment === "") {
          results.push(new $$route$recognizer$$EpsilonSegment());
          specificity.val += '1';
        } else {
          results.push(new $$route$recognizer$$StaticSegment(segment));
          specificity.val += '4';
        }
      }

      specificity.val = +specificity.val;

      return results;
    }

    // A State has a character specification and (`charSpec`) and a list of possible
    // subsequent states (`nextStates`).
    //
    // If a State is an accepting state, it will also have several additional
    // properties:
    //
    // * `regex`: A regular expression that is used to extract parameters from paths
    //   that reached this accepting state.
    // * `handlers`: Information on how to convert the list of captures into calls
    //   to registered handlers with the specified parameters
    // * `types`: How many static, dynamic or star segments in this route. Used to
    //   decide which route to use if multiple registered routes match a path.
    //
    // Currently, State is implemented naively by looping over `nextStates` and
    // comparing a character specification against a character. A more efficient
    // implementation would use a hash of keys pointing at one or more next states.

    function $$route$recognizer$$State(charSpec) {
      this.charSpec = charSpec;
      this.nextStates = [];
    }

    $$route$recognizer$$State.prototype = {
      get: function(charSpec) {
        var nextStates = this.nextStates;

        for (var i=0, l=nextStates.length; i<l; i++) {
          var child = nextStates[i];

          var isEqual = child.charSpec.validChars === charSpec.validChars;
          isEqual = isEqual && child.charSpec.invalidChars === charSpec.invalidChars;

          if (isEqual) { return child; }
        }
      },

      put: function(charSpec) {
        var state;

        // If the character specification already exists in a child of the current
        // state, just return that state.
        if (state = this.get(charSpec)) { return state; }

        // Make a new state for the character spec
        state = new $$route$recognizer$$State(charSpec);

        // Insert the new state as a child of the current state
        this.nextStates.push(state);

        // If this character specification repeats, insert the new state as a child
        // of itself. Note that this will not trigger an infinite loop because each
        // transition during recognition consumes a character.
        if (charSpec.repeat) {
          state.nextStates.push(state);
        }

        // Return the new state
        return state;
      },

      // Find a list of child states matching the next character
      match: function(ch) {
        // DEBUG "Processing `" + ch + "`:"
        var nextStates = this.nextStates,
            child, charSpec, chars;

        // DEBUG "  " + debugState(this)
        var returned = [];

        for (var i=0, l=nextStates.length; i<l; i++) {
          child = nextStates[i];

          charSpec = child.charSpec;

          if (typeof (chars = charSpec.validChars) !== 'undefined') {
            if (chars.indexOf(ch) !== -1) { returned.push(child); }
          } else if (typeof (chars = charSpec.invalidChars) !== 'undefined') {
            if (chars.indexOf(ch) === -1) { returned.push(child); }
          }
        }

        return returned;
      }

      /** IF DEBUG
      , debug: function() {
        var charSpec = this.charSpec,
            debug = "[",
            chars = charSpec.validChars || charSpec.invalidChars;

        if (charSpec.invalidChars) { debug += "^"; }
        debug += chars;
        debug += "]";

        if (charSpec.repeat) { debug += "+"; }

        return debug;
      }
      END IF **/
    };

    /** IF DEBUG
    function debug(log) {
      console.log(log);
    }

    function debugState(state) {
      return state.nextStates.map(function(n) {
        if (n.nextStates.length === 0) { return "( " + n.debug() + " [accepting] )"; }
        return "( " + n.debug() + " <then> " + n.nextStates.map(function(s) { return s.debug() }).join(" or ") + " )";
      }).join(", ")
    }
    END IF **/

    // Sort the routes by specificity
    function $$route$recognizer$$sortSolutions(states) {
      return states.sort(function(a, b) {
        return b.specificity.val - a.specificity.val;
      });
    }

    function $$route$recognizer$$recognizeChar(states, ch) {
      var nextStates = [];

      for (var i=0, l=states.length; i<l; i++) {
        var state = states[i];

        nextStates = nextStates.concat(state.match(ch));
      }

      return nextStates;
    }

    var $$route$recognizer$$oCreate = Object.create || function(proto) {
      function F() {}
      F.prototype = proto;
      return new F();
    };

    function $$route$recognizer$$RecognizeResults(queryParams) {
      this.queryParams = queryParams || {};
    }
    $$route$recognizer$$RecognizeResults.prototype = $$route$recognizer$$oCreate({
      splice: Array.prototype.splice,
      slice:  Array.prototype.slice,
      push:   Array.prototype.push,
      length: 0,
      queryParams: null
    });

    function $$route$recognizer$$findHandler(state, path, queryParams) {
      var handlers = state.handlers, regex = state.regex;
      var captures = path.match(regex), currentCapture = 1;
      var result = new $$route$recognizer$$RecognizeResults(queryParams);

      for (var i=0, l=handlers.length; i<l; i++) {
        var handler = handlers[i], names = handler.names, params = {};

        for (var j=0, m=names.length; j<m; j++) {
          params[names[j]] = captures[currentCapture++];
        }

        result.push({ handler: handler.handler, params: params, isDynamic: !!names.length });
      }

      return result;
    }

    function $$route$recognizer$$addSegment(currentState, segment) {
      segment.eachChar(function(ch) {
        var state;

        currentState = currentState.put(ch);
      });

      return currentState;
    }

    function $$route$recognizer$$decodeQueryParamPart(part) {
      // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
      part = part.replace(/\+/gm, '%20');
      return decodeURIComponent(part);
    }

    // The main interface

    var $$route$recognizer$$RouteRecognizer = function() {
      this.rootState = new $$route$recognizer$$State();
      this.names = {};
    };


    $$route$recognizer$$RouteRecognizer.prototype = {
      add: function(routes, options) {
        var currentState = this.rootState, regex = "^",
            specificity = {},
            handlers = [], allSegments = [], name;

        var isEmpty = true;

        for (var i=0, l=routes.length; i<l; i++) {
          var route = routes[i], names = [];

          var segments = $$route$recognizer$$parse(route.path, names, specificity);

          allSegments = allSegments.concat(segments);

          for (var j=0, m=segments.length; j<m; j++) {
            var segment = segments[j];

            if (segment instanceof $$route$recognizer$$EpsilonSegment) { continue; }

            isEmpty = false;

            // Add a "/" for the new segment
            currentState = currentState.put({ validChars: "/" });
            regex += "/";

            // Add a representation of the segment to the NFA and regex
            currentState = $$route$recognizer$$addSegment(currentState, segment);
            regex += segment.regex();
          }

          var handler = { handler: route.handler, names: names };
          handlers.push(handler);
        }

        if (isEmpty) {
          currentState = currentState.put({ validChars: "/" });
          regex += "/";
        }

        currentState.handlers = handlers;
        currentState.regex = new RegExp(regex + "$");
        currentState.specificity = specificity;

        if (name = options && options.as) {
          this.names[name] = {
            segments: allSegments,
            handlers: handlers
          };
        }
      },

      handlersFor: function(name) {
        var route = this.names[name], result = [];
        if (!route) { throw new Error("There is no route named " + name); }

        for (var i=0, l=route.handlers.length; i<l; i++) {
          result.push(route.handlers[i]);
        }

        return result;
      },

      hasRoute: function(name) {
        return !!this.names[name];
      },

      generate: function(name, params) {
        var route = this.names[name], output = "";
        if (!route) { throw new Error("There is no route named " + name); }

        var segments = route.segments;

        for (var i=0, l=segments.length; i<l; i++) {
          var segment = segments[i];

          if (segment instanceof $$route$recognizer$$EpsilonSegment) { continue; }

          output += "/";
          output += segment.generate(params);
        }

        if (output.charAt(0) !== '/') { output = '/' + output; }

        if (params && params.queryParams) {
          output += this.generateQueryString(params.queryParams, route.handlers);
        }

        return output;
      },

      generateQueryString: function(params, handlers) {
        var pairs = [];
        var keys = [];
        for(var key in params) {
          if (params.hasOwnProperty(key)) {
            keys.push(key);
          }
        }
        keys.sort();
        for (var i = 0, len = keys.length; i < len; i++) {
          key = keys[i];
          var value = params[key];
          if (value == null) {
            continue;
          }
          var pair = encodeURIComponent(key);
          if ($$route$recognizer$$isArray(value)) {
            for (var j = 0, l = value.length; j < l; j++) {
              var arrayPair = key + '[]' + '=' + encodeURIComponent(value[j]);
              pairs.push(arrayPair);
            }
          } else {
            pair += "=" + encodeURIComponent(value);
            pairs.push(pair);
          }
        }

        if (pairs.length === 0) { return ''; }

        return "?" + pairs.join("&");
      },

      parseQueryString: function(queryString) {
        var pairs = queryString.split("&"), queryParams = {};
        for(var i=0; i < pairs.length; i++) {
          var pair      = pairs[i].split('='),
              key       = $$route$recognizer$$decodeQueryParamPart(pair[0]),
              keyLength = key.length,
              isArray = false,
              value;
          if (pair.length === 1) {
            value = 'true';
          } else {
            //Handle arrays
            if (keyLength > 2 && key.slice(keyLength -2) === '[]') {
              isArray = true;
              key = key.slice(0, keyLength - 2);
              if(!queryParams[key]) {
                queryParams[key] = [];
              }
            }
            value = pair[1] ? $$route$recognizer$$decodeQueryParamPart(pair[1]) : '';
          }
          if (isArray) {
            queryParams[key].push(value);
          } else {
            queryParams[key] = value;
          }
        }
        return queryParams;
      },

      recognize: function(path) {
        var states = [ this.rootState ],
            pathLen, i, l, queryStart, queryParams = {},
            isSlashDropped = false;

        queryStart = path.indexOf('?');
        if (queryStart !== -1) {
          var queryString = path.substr(queryStart + 1, path.length);
          path = path.substr(0, queryStart);
          queryParams = this.parseQueryString(queryString);
        }

        path = decodeURI(path);

        // DEBUG GROUP path

        if (path.charAt(0) !== "/") { path = "/" + path; }

        pathLen = path.length;
        if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
          path = path.substr(0, pathLen - 1);
          isSlashDropped = true;
        }

        for (i=0, l=path.length; i<l; i++) {
          states = $$route$recognizer$$recognizeChar(states, path.charAt(i));
          if (!states.length) { break; }
        }

        // END DEBUG GROUP

        var solutions = [];
        for (i=0, l=states.length; i<l; i++) {
          if (states[i].handlers) { solutions.push(states[i]); }
        }

        states = $$route$recognizer$$sortSolutions(solutions);

        var state = solutions[0];

        if (state && state.handlers) {
          // if a trailing slash was dropped and a star segment is the last segment
          // specified, put the trailing slash back
          if (isSlashDropped && state.regex.source.slice(-5) === "(.+)$") {
            path = path + "/";
          }
          return $$route$recognizer$$findHandler(state, path, queryParams);
        }
      }
    };

    $$route$recognizer$$RouteRecognizer.prototype.map = $$route$recognizer$dsl$$default;

    $$route$recognizer$$RouteRecognizer.VERSION = '0.1.9';

    var $$route$recognizer$$default = $$route$recognizer$$RouteRecognizer;

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define('route-recognizer', function() { return $$route$recognizer$$default; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = $$route$recognizer$$default;
    } else if (typeof this !== 'undefined') {
      this['RouteRecognizer'] = $$route$recognizer$$default;
    }
}).call(this);


},{}],72:[function(require,module,exports){
var _ = require('../util')

/**
 * Create a child instance that prototypally inherits
 * data on parent. To achieve that we create an intermediate
 * constructor with its prototype pointing to parent.
 *
 * @param {Object} opts
 * @param {Function} [BaseCtor]
 * @return {Vue}
 * @public
 */

exports.$addChild = function (opts, BaseCtor) {
  BaseCtor = BaseCtor || _.Vue
  opts = opts || {}
  var ChildVue
  var parent = this
  // transclusion context
  var context = opts._context || parent
  var inherit = opts.inherit !== undefined
    ? opts.inherit
    : BaseCtor.options.inherit
  if (inherit) {
    var ctors = context._childCtors
    ChildVue = ctors[BaseCtor.cid]
    if (!ChildVue) {
      var optionName = BaseCtor.options.name
      var className = optionName
        ? _.classify(optionName)
        : 'VueComponent'
      ChildVue = new Function(
        'return function ' + className + ' (options) {' +
        'this.constructor = ' + className + ';' +
        'this._init(options) }'
      )()
      ChildVue.options = BaseCtor.options
      ChildVue.linker = BaseCtor.linker
      ChildVue.prototype = context
      ctors[BaseCtor.cid] = ChildVue
    }
  } else {
    ChildVue = BaseCtor
  }
  opts._parent = parent
  opts._root = parent.$root
  var child = new ChildVue(opts)
  return child
}

},{"../util":133}],73:[function(require,module,exports){
var Watcher = require('../watcher')
var Path = require('../parsers/path')
var textParser = require('../parsers/text')
var dirParser = require('../parsers/directive')
var expParser = require('../parsers/expression')
var filterRE = /[^|]\|[^|]/

/**
 * Get the value from an expression on this vm.
 *
 * @param {String} exp
 * @return {*}
 */

exports.$get = function (exp) {
  var res = expParser.parse(exp)
  if (res) {
    try {
      return res.get.call(this, this)
    } catch (e) {}
  }
}

/**
 * Set the value from an expression on this vm.
 * The expression must be a valid left-hand
 * expression in an assignment.
 *
 * @param {String} exp
 * @param {*} val
 */

exports.$set = function (exp, val) {
  var res = expParser.parse(exp, true)
  if (res && res.set) {
    res.set.call(this, this, val)
  }
}

/**
 * Add a property on the VM
 *
 * @param {String} key
 * @param {*} val
 */

exports.$add = function (key, val) {
  this._data.$add(key, val)
}

/**
 * Delete a property on the VM
 *
 * @param {String} key
 */

exports.$delete = function (key) {
  this._data.$delete(key)
}

/**
 * Watch an expression, trigger callback when its
 * value changes.
 *
 * @param {String|Function} expOrFn
 * @param {Function} cb
 * @param {Object} [options]
 *                 - {Boolean} deep
 *                 - {Boolean} immediate
 *                 - {Boolean} user
 * @return {Function} - unwatchFn
 */

exports.$watch = function (expOrFn, cb, options) {
  var vm = this
  var parsed
  if (typeof expOrFn === 'string') {
    parsed = dirParser.parse(expOrFn)[0]
    expOrFn = parsed.expression
  }
  var watcher = new Watcher(vm, expOrFn, cb, {
    deep: options && options.deep,
    user: !options || options.user !== false,
    filters: parsed && parsed.filters
  })
  if (options && options.immediate) {
    cb.call(vm, watcher.value)
  }
  return function unwatchFn () {
    watcher.teardown()
  }
}

/**
 * Evaluate a text directive, including filters.
 *
 * @param {String} text
 * @return {String}
 */

exports.$eval = function (text) {
  // check for filters.
  if (filterRE.test(text)) {
    var dir = dirParser.parse(text)[0]
    // the filter regex check might give false positive
    // for pipes inside strings, so it's possible that
    // we don't get any filters here
    var val = this.$get(dir.expression)
    return dir.filters
      ? this._applyFilters(val, null, dir.filters)
      : val
  } else {
    // no filter
    return this.$get(text)
  }
}

/**
 * Interpolate a piece of template text.
 *
 * @param {String} text
 * @return {String}
 */

exports.$interpolate = function (text) {
  var tokens = textParser.parse(text)
  var vm = this
  if (tokens) {
    if (tokens.length === 1) {
      return vm.$eval(tokens[0].value) + ''
    } else {
      return tokens.map(function (token) {
        return token.tag
          ? vm.$eval(token.value)
          : token.value
      }).join('')
    }
  } else {
    return text
  }
}

/**
 * Log instance data as a plain JS object
 * so that it is easier to inspect in console.
 * This method assumes console is available.
 *
 * @param {String} [path]
 */

exports.$log = function (path) {
  var data = path
    ? Path.get(this._data, path)
    : this._data
  if (data) {
    data = JSON.parse(JSON.stringify(data))
  }
  console.log(data)
}

},{"../parsers/directive":121,"../parsers/expression":122,"../parsers/path":123,"../parsers/text":125,"../watcher":137}],74:[function(require,module,exports){
var _ = require('../util')
var transition = require('../transition')

/**
 * Convenience on-instance nextTick. The callback is
 * auto-bound to the instance, and this avoids component
 * modules having to rely on the global Vue.
 *
 * @param {Function} fn
 */

exports.$nextTick = function (fn) {
  _.nextTick(fn, this)
}

/**
 * Append instance to target
 *
 * @param {Node} target
 * @param {Function} [cb]
 * @param {Boolean} [withTransition] - defaults to true
 */

exports.$appendTo = function (target, cb, withTransition) {
  return insert(
    this, target, cb, withTransition,
    append, transition.append
  )
}

/**
 * Prepend instance to target
 *
 * @param {Node} target
 * @param {Function} [cb]
 * @param {Boolean} [withTransition] - defaults to true
 */

exports.$prependTo = function (target, cb, withTransition) {
  target = query(target)
  if (target.hasChildNodes()) {
    this.$before(target.firstChild, cb, withTransition)
  } else {
    this.$appendTo(target, cb, withTransition)
  }
  return this
}

/**
 * Insert instance before target
 *
 * @param {Node} target
 * @param {Function} [cb]
 * @param {Boolean} [withTransition] - defaults to true
 */

exports.$before = function (target, cb, withTransition) {
  return insert(
    this, target, cb, withTransition,
    before, transition.before
  )
}

/**
 * Insert instance after target
 *
 * @param {Node} target
 * @param {Function} [cb]
 * @param {Boolean} [withTransition] - defaults to true
 */

exports.$after = function (target, cb, withTransition) {
  target = query(target)
  if (target.nextSibling) {
    this.$before(target.nextSibling, cb, withTransition)
  } else {
    this.$appendTo(target.parentNode, cb, withTransition)
  }
  return this
}

/**
 * Remove instance from DOM
 *
 * @param {Function} [cb]
 * @param {Boolean} [withTransition] - defaults to true
 */

exports.$remove = function (cb, withTransition) {
  if (!this.$el.parentNode) {
    return cb && cb()
  }
  var inDoc = this._isAttached && _.inDoc(this.$el)
  // if we are not in document, no need to check
  // for transitions
  if (!inDoc) withTransition = false
  var op
  var self = this
  var realCb = function () {
    if (inDoc) self._callHook('detached')
    if (cb) cb()
  }
  if (
    this._isFragment &&
    !this._blockFragment.hasChildNodes()
  ) {
    op = withTransition === false
      ? append
      : transition.removeThenAppend
    blockOp(this, this._blockFragment, op, realCb)
  } else {
    op = withTransition === false
      ? remove
      : transition.remove
    op(this.$el, this, realCb)
  }
  return this
}

/**
 * Shared DOM insertion function.
 *
 * @param {Vue} vm
 * @param {Element} target
 * @param {Function} [cb]
 * @param {Boolean} [withTransition]
 * @param {Function} op1 - op for non-transition insert
 * @param {Function} op2 - op for transition insert
 * @return vm
 */

function insert (vm, target, cb, withTransition, op1, op2) {
  target = query(target)
  var targetIsDetached = !_.inDoc(target)
  var op = withTransition === false || targetIsDetached
    ? op1
    : op2
  var shouldCallHook =
    !targetIsDetached &&
    !vm._isAttached &&
    !_.inDoc(vm.$el)
  if (vm._isFragment) {
    blockOp(vm, target, op, cb)
  } else {
    op(vm.$el, target, vm, cb)
  }
  if (shouldCallHook) {
    vm._callHook('attached')
  }
  return vm
}

/**
 * Execute a transition operation on a fragment instance,
 * iterating through all its block nodes.
 *
 * @param {Vue} vm
 * @param {Node} target
 * @param {Function} op
 * @param {Function} cb
 */

function blockOp (vm, target, op, cb) {
  var current = vm._fragmentStart
  var end = vm._fragmentEnd
  var next
  while (next !== end) {
    next = current.nextSibling
    op(current, target, vm)
    current = next
  }
  op(end, target, vm, cb)
}

/**
 * Check for selectors
 *
 * @param {String|Element} el
 */

function query (el) {
  return typeof el === 'string'
    ? document.querySelector(el)
    : el
}

/**
 * Append operation that takes a callback.
 *
 * @param {Node} el
 * @param {Node} target
 * @param {Vue} vm - unused
 * @param {Function} [cb]
 */

function append (el, target, vm, cb) {
  target.appendChild(el)
  if (cb) cb()
}

/**
 * InsertBefore operation that takes a callback.
 *
 * @param {Node} el
 * @param {Node} target
 * @param {Vue} vm - unused
 * @param {Function} [cb]
 */

function before (el, target, vm, cb) {
  _.before(el, target)
  if (cb) cb()
}

/**
 * Remove operation that takes a callback.
 *
 * @param {Node} el
 * @param {Vue} vm - unused
 * @param {Function} [cb]
 */

function remove (el, vm, cb) {
  _.remove(el)
  if (cb) cb()
}

},{"../transition":126,"../util":133}],75:[function(require,module,exports){
var _ = require('../util')

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 */

exports.$on = function (event, fn) {
  (this._events[event] || (this._events[event] = []))
    .push(fn)
  modifyListenerCount(this, event, 1)
  return this
}

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 */

exports.$once = function (event, fn) {
  var self = this
  function on () {
    self.$off(event, on)
    fn.apply(this, arguments)
  }
  on.fn = fn
  this.$on(event, on)
  return this
}

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 */

exports.$off = function (event, fn) {
  var cbs
  // all
  if (!arguments.length) {
    if (this.$parent) {
      for (event in this._events) {
        cbs = this._events[event]
        if (cbs) {
          modifyListenerCount(this, event, -cbs.length)
        }
      }
    }
    this._events = {}
    return this
  }
  // specific event
  cbs = this._events[event]
  if (!cbs) {
    return this
  }
  if (arguments.length === 1) {
    modifyListenerCount(this, event, -cbs.length)
    this._events[event] = null
    return this
  }
  // specific handler
  var cb
  var i = cbs.length
  while (i--) {
    cb = cbs[i]
    if (cb === fn || cb.fn === fn) {
      modifyListenerCount(this, event, -1)
      cbs.splice(i, 1)
      break
    }
  }
  return this
}

/**
 * Trigger an event on self.
 *
 * @param {String} event
 */

exports.$emit = function (event) {
  this._eventCancelled = false
  var cbs = this._events[event]
  if (cbs) {
    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length - 1
    var args = new Array(i)
    while (i--) {
      args[i] = arguments[i + 1]
    }
    i = 0
    cbs = cbs.length > 1
      ? _.toArray(cbs)
      : cbs
    for (var l = cbs.length; i < l; i++) {
      if (cbs[i].apply(this, args) === false) {
        this._eventCancelled = true
      }
    }
  }
  return this
}

/**
 * Recursively broadcast an event to all children instances.
 *
 * @param {String} event
 * @param {...*} additional arguments
 */

exports.$broadcast = function (event) {
  // if no child has registered for this event,
  // then there's no need to broadcast.
  if (!this._eventsCount[event]) return
  var children = this.$children
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i]
    child.$emit.apply(child, arguments)
    if (!child._eventCancelled) {
      child.$broadcast.apply(child, arguments)
    }
  }
  return this
}

/**
 * Recursively propagate an event up the parent chain.
 *
 * @param {String} event
 * @param {...*} additional arguments
 */

exports.$dispatch = function () {
  var parent = this.$parent
  while (parent) {
    parent.$emit.apply(parent, arguments)
    parent = parent._eventCancelled
      ? null
      : parent.$parent
  }
  return this
}

/**
 * Modify the listener counts on all parents.
 * This bookkeeping allows $broadcast to return early when
 * no child has listened to a certain event.
 *
 * @param {Vue} vm
 * @param {String} event
 * @param {Number} count
 */

var hookRE = /^hook:/
function modifyListenerCount (vm, event, count) {
  var parent = vm.$parent
  // hooks do not get broadcasted so no need
  // to do bookkeeping for them
  if (!parent || !count || hookRE.test(event)) return
  while (parent) {
    parent._eventsCount[event] =
      (parent._eventsCount[event] || 0) + count
    parent = parent.$parent
  }
}

},{"../util":133}],76:[function(require,module,exports){
var _ = require('../util')
var config = require('../config')

/**
 * Expose useful internals
 */

exports.util = _
exports.config = config
exports.nextTick = _.nextTick
exports.compiler = require('../compiler')

exports.parsers = {
  path: require('../parsers/path'),
  text: require('../parsers/text'),
  template: require('../parsers/template'),
  directive: require('../parsers/directive'),
  expression: require('../parsers/expression')
}

/**
 * Each instance constructor, including Vue, has a unique
 * cid. This enables us to create wrapped "child
 * constructors" for prototypal inheritance and cache them.
 */

exports.cid = 0
var cid = 1

/**
 * Class inheritance
 *
 * @param {Object} extendOptions
 */

exports.extend = function (extendOptions) {
  extendOptions = extendOptions || {}
  var Super = this
  var Sub = createClass(
    extendOptions.name ||
    Super.options.name ||
    'VueComponent'
  )
  Sub.prototype = Object.create(Super.prototype)
  Sub.prototype.constructor = Sub
  Sub.cid = cid++
  Sub.options = _.mergeOptions(
    Super.options,
    extendOptions
  )
  Sub['super'] = Super
  // allow further extension
  Sub.extend = Super.extend
  // create asset registers, so extended classes
  // can have their private assets too.
  config._assetTypes.forEach(function (type) {
    Sub[type] = Super[type]
  })
  return Sub
}

/**
 * A function that returns a sub-class constructor with the
 * given name. This gives us much nicer output when
 * logging instances in the console.
 *
 * @param {String} name
 * @return {Function}
 */

function createClass (name) {
  return new Function(
    'return function ' + _.classify(name) +
    ' (options) { this._init(options) }'
  )()
}

/**
 * Plugin system
 *
 * @param {Object} plugin
 */

exports.use = function (plugin) {
  // additional parameters
  var args = _.toArray(arguments, 1)
  args.unshift(this)
  if (typeof plugin.install === 'function') {
    plugin.install.apply(plugin, args)
  } else {
    plugin.apply(null, args)
  }
  return this
}

/**
 * Apply a global mixin by merging it into the default
 * options.
 */

exports.mixin = function (mixin) {
  var Vue = _.Vue
  Vue.options = _.mergeOptions(Vue.options, mixin)
}

/**
 * Create asset registration methods with the following
 * signature:
 *
 * @param {String} id
 * @param {*} definition
 */

config._assetTypes.forEach(function (type) {
  exports[type] = function (id, definition) {
    if (!definition) {
      return this.options[type + 's'][id]
    } else {
      if (
        type === 'component' &&
        _.isPlainObject(definition)
      ) {
        definition.name = id
        definition = _.Vue.extend(definition)
      }
      this.options[type + 's'][id] = definition
    }
  }
})

},{"../compiler":82,"../config":84,"../parsers/directive":121,"../parsers/expression":122,"../parsers/path":123,"../parsers/template":124,"../parsers/text":125,"../util":133}],77:[function(require,module,exports){
(function (process){
var _ = require('../util')
var compiler = require('../compiler')

/**
 * Set instance target element and kick off the compilation
 * process. The passed in `el` can be a selector string, an
 * existing Element, or a DocumentFragment (for block
 * instances).
 *
 * @param {Element|DocumentFragment|string} el
 * @public
 */

exports.$mount = function (el) {
  if (this._isCompiled) {
    process.env.NODE_ENV !== 'production' && _.warn(
      '$mount() should be called only once.'
    )
    return
  }
  el = _.query(el)
  if (!el) {
    el = document.createElement('div')
  }
  this._compile(el)
  this._isCompiled = true
  this._callHook('compiled')
  this._initDOMHooks()
  if (_.inDoc(this.$el)) {
    this._callHook('attached')
    ready.call(this)
  } else {
    this.$once('hook:attached', ready)
  }
  return this
}

/**
 * Mark an instance as ready.
 */

function ready () {
  this._isAttached = true
  this._isReady = true
  this._callHook('ready')
}

/**
 * Teardown the instance, simply delegate to the internal
 * _destroy.
 */

exports.$destroy = function (remove, deferCleanup) {
  this._destroy(remove, deferCleanup)
}

/**
 * Partially compile a piece of DOM and return a
 * decompile function.
 *
 * @param {Element|DocumentFragment} el
 * @param {Vue} [host]
 * @return {Function}
 */

exports.$compile = function (el, host) {
  return compiler.compile(el, this.$options, true)(this, el, host)
}

}).call(this,require('_process'))

},{"../compiler":82,"../util":133,"_process":24}],78:[function(require,module,exports){
(function (process){
var _ = require('./util')
var config = require('./config')

// we have two separate queues: one for directive updates
// and one for user watcher registered via $watch().
// we want to guarantee directive updates to be called
// before user watchers so that when user watchers are
// triggered, the DOM would have already been in updated
// state.
var queue = []
var userQueue = []
var has = {}
var circular = {}
var waiting = false
var internalQueueDepleted = false

/**
 * Reset the batcher's state.
 */

function resetBatcherState () {
  queue = []
  userQueue = []
  has = {}
  circular = {}
  waiting = internalQueueDepleted = false
}

/**
 * Flush both queues and run the watchers.
 */

function flushBatcherQueue () {
  runBatcherQueue(queue)
  internalQueueDepleted = true
  runBatcherQueue(userQueue)
  resetBatcherState()
}

/**
 * Run the watchers in a single queue.
 *
 * @param {Array} queue
 */

function runBatcherQueue (queue) {
  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (var i = 0; i < queue.length; i++) {
    var watcher = queue[i]
    var id = watcher.id
    has[id] = null
    watcher.run()
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > config._maxUpdateCount) {
        queue.splice(has[id], 1)
        _.warn(
          'You may have an infinite update loop for watcher ' +
          'with expression: ' + watcher.expression
        )
      }
    }
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 *
 * @param {Watcher} watcher
 *   properties:
 *   - {Number} id
 *   - {Function} run
 */

exports.push = function (watcher) {
  var id = watcher.id
  if (has[id] == null) {
    // if an internal watcher is pushed, but the internal
    // queue is already depleted, we run it immediately.
    if (internalQueueDepleted && !watcher.user) {
      watcher.run()
      return
    }
    // push watcher into appropriate queue
    var q = watcher.user ? userQueue : queue
    has[id] = q.length
    q.push(watcher)
    // queue the flush
    if (!waiting) {
      waiting = true
      _.nextTick(flushBatcherQueue)
    }
  }
}

}).call(this,require('_process'))

},{"./config":84,"./util":133,"_process":24}],79:[function(require,module,exports){
/**
 * A doubly linked list-based Least Recently Used (LRU)
 * cache. Will keep most recently used items while
 * discarding least recently used items when its limit is
 * reached. This is a bare-bone version of
 * Rasmus Andersson's js-lru:
 *
 *   https://github.com/rsms/js-lru
 *
 * @param {Number} limit
 * @constructor
 */

function Cache (limit) {
  this.size = 0
  this.limit = limit
  this.head = this.tail = undefined
  this._keymap = Object.create(null)
}

var p = Cache.prototype

/**
 * Put <value> into the cache associated with <key>.
 * Returns the entry which was removed to make room for
 * the new entry. Otherwise undefined is returned.
 * (i.e. if there was enough room already).
 *
 * @param {String} key
 * @param {*} value
 * @return {Entry|undefined}
 */

p.put = function (key, value) {
  var entry = {
    key: key,
    value: value
  }
  this._keymap[key] = entry
  if (this.tail) {
    this.tail.newer = entry
    entry.older = this.tail
  } else {
    this.head = entry
  }
  this.tail = entry
  if (this.size === this.limit) {
    return this.shift()
  } else {
    this.size++
  }
}

/**
 * Purge the least recently used (oldest) entry from the
 * cache. Returns the removed entry or undefined if the
 * cache was empty.
 */

p.shift = function () {
  var entry = this.head
  if (entry) {
    this.head = this.head.newer
    this.head.older = undefined
    entry.newer = entry.older = undefined
    this._keymap[entry.key] = undefined
  }
  return entry
}

/**
 * Get and register recent use of <key>. Returns the value
 * associated with <key> or undefined if not in cache.
 *
 * @param {String} key
 * @param {Boolean} returnEntry
 * @return {Entry|*}
 */

p.get = function (key, returnEntry) {
  var entry = this._keymap[key]
  if (entry === undefined) return
  if (entry === this.tail) {
    return returnEntry
      ? entry
      : entry.value
  }
  // HEAD--------------TAIL
  //   <.older   .newer>
  //  <--- add direction --
  //   A  B  C  <D>  E
  if (entry.newer) {
    if (entry === this.head) {
      this.head = entry.newer
    }
    entry.newer.older = entry.older // C <-- E.
  }
  if (entry.older) {
    entry.older.newer = entry.newer // C. --> E
  }
  entry.newer = undefined // D --x
  entry.older = this.tail // D. --> E
  if (this.tail) {
    this.tail.newer = entry // E. <-- D
  }
  this.tail = entry
  return returnEntry
    ? entry
    : entry.value
}

module.exports = Cache

},{}],80:[function(require,module,exports){
(function (process){
var _ = require('../util')
var textParser = require('../parsers/text')
var propDef = require('../directives/prop')
var propBindingModes = require('../config')._propBindingModes

// regexes
var identRE = require('../parsers/path').identRE
var dataAttrRE = /^data-/
var settablePathRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\[[^\[\]]+\])*$/
var literalValueRE = /^(true|false)$|^\d.*/

/**
 * Compile param attributes on a root element and return
 * a props link function.
 *
 * @param {Element|DocumentFragment} el
 * @param {Array} propOptions
 * @return {Function} propsLinkFn
 */

module.exports = function compileProps (el, propOptions) {
  var props = []
  var i = propOptions.length
  var options, name, attr, value, path, prop, literal, single
  while (i--) {
    options = propOptions[i]
    name = options.name
    // props could contain dashes, which will be
    // interpreted as minus calculations by the parser
    // so we need to camelize the path here
    path = _.camelize(name.replace(dataAttrRE, ''))
    if (!identRE.test(path)) {
      process.env.NODE_ENV !== 'production' && _.warn(
        'Invalid prop key: "' + name + '". Prop keys ' +
        'must be valid identifiers.'
      )
      continue
    }
    attr = _.hyphenate(name)
    value = el.getAttribute(attr)
    if (value === null) {
      attr = 'data-' + attr
      value = el.getAttribute(attr)
    }
    // create a prop descriptor
    prop = {
      name: name,
      raw: value,
      path: path,
      options: options,
      mode: propBindingModes.ONE_WAY
    }
    if (value !== null) {
      // important so that this doesn't get compiled
      // again as a normal attribute binding
      el.removeAttribute(attr)
      var tokens = textParser.parse(value)
      if (tokens) {
        prop.dynamic = true
        prop.parentPath = textParser.tokensToExp(tokens)
        // check prop binding type.
        single = tokens.length === 1
        literal = literalValueRE.test(prop.parentPath)
        // one time: {{* prop}}
        if (literal || (single && tokens[0].oneTime)) {
          prop.mode = propBindingModes.ONE_TIME
        } else if (
          !literal &&
          (single && tokens[0].twoWay)
        ) {
          if (settablePathRE.test(prop.parentPath)) {
            prop.mode = propBindingModes.TWO_WAY
          } else {
            process.env.NODE_ENV !== 'production' && _.warn(
              'Cannot bind two-way prop with non-settable ' +
              'parent path: ' + prop.parentPath
            )
          }
        }
        if (
          process.env.NODE_ENV !== 'production' &&
          options.twoWay &&
          prop.mode !== propBindingModes.TWO_WAY
        ) {
          _.warn(
            'Prop "' + name + '" expects a two-way binding type.'
          )
        }
      }
    } else if (options && options.required) {
      process.env.NODE_ENV !== 'production' && _.warn(
        'Missing required prop: ' + name
      )
    }
    props.push(prop)
  }
  return makePropsLinkFn(props)
}

/**
 * Build a function that applies props to a vm.
 *
 * @param {Array} props
 * @return {Function} propsLinkFn
 */

function makePropsLinkFn (props) {
  return function propsLinkFn (vm, el) {
    // store resolved props info
    vm._props = {}
    var i = props.length
    var prop, path, options, value
    while (i--) {
      prop = props[i]
      path = prop.path
      vm._props[path] = prop
      options = prop.options
      if (prop.raw === null) {
        // initialize absent prop
        _.initProp(vm, prop, getDefault(options))
      } else if (prop.dynamic) {
        // dynamic prop
        if (vm._context) {
          if (prop.mode === propBindingModes.ONE_TIME) {
            // one time binding
            value = vm._context.$get(prop.parentPath)
            _.initProp(vm, prop, value)
          } else {
            // dynamic binding
            vm._bindDir('prop', el, prop, propDef)
          }
        } else {
          process.env.NODE_ENV !== 'production' && _.warn(
            'Cannot bind dynamic prop on a root instance' +
            ' with no parent: ' + prop.name + '="' +
            prop.raw + '"'
          )
        }
      } else {
        // literal, cast it and just set once
        var raw = prop.raw
        value = options.type === Boolean && raw === ''
          ? true
          // do not cast emptry string.
          // _.toNumber casts empty string to 0.
          : raw.trim()
            ? _.toBoolean(_.toNumber(raw))
            : raw
        _.initProp(vm, prop, value)
      }
    }
  }
}

/**
 * Get the default value of a prop.
 *
 * @param {Object} options
 * @return {*}
 */

function getDefault (options) {
  // no default, return undefined
  if (!options.hasOwnProperty('default')) {
    // absent boolean value defaults to false
    return options.type === Boolean
      ? false
      : undefined
  }
  var def = options.default
  // warn against non-factory defaults for Object & Array
  if (_.isObject(def)) {
    process.env.NODE_ENV !== 'production' && _.warn(
      'Object/Array as default prop values will be shared ' +
      'across multiple instances. Use a factory function ' +
      'to return the default value instead.'
    )
  }
  // call factory function for non-Function types
  return typeof def === 'function' && options.type !== Function
    ? def()
    : def
}

}).call(this,require('_process'))

},{"../config":84,"../directives/prop":100,"../parsers/path":123,"../parsers/text":125,"../util":133,"_process":24}],81:[function(require,module,exports){
(function (process){
var _ = require('../util')
var compileProps = require('./compile-props')
var config = require('../config')
var textParser = require('../parsers/text')
var dirParser = require('../parsers/directive')
var templateParser = require('../parsers/template')
var resolveAsset = _.resolveAsset
var componentDef = require('../directives/component')

// terminal directives
var terminalDirectives = [
  'repeat',
  'if'
]

/**
 * Compile a template and return a reusable composite link
 * function, which recursively contains more link functions
 * inside. This top level compile function would normally
 * be called on instance root nodes, but can also be used
 * for partial compilation if the partial argument is true.
 *
 * The returned composite link function, when called, will
 * return an unlink function that tearsdown all directives
 * created during the linking phase.
 *
 * @param {Element|DocumentFragment} el
 * @param {Object} options
 * @param {Boolean} partial
 * @return {Function}
 */

exports.compile = function (el, options, partial) {
  // link function for the node itself.
  var nodeLinkFn = partial || !options._asComponent
    ? compileNode(el, options)
    : null
  // link function for the childNodes
  var childLinkFn =
    !(nodeLinkFn && nodeLinkFn.terminal) &&
    el.tagName !== 'SCRIPT' &&
    el.hasChildNodes()
      ? compileNodeList(el.childNodes, options)
      : null

  /**
   * A composite linker function to be called on a already
   * compiled piece of DOM, which instantiates all directive
   * instances.
   *
   * @param {Vue} vm
   * @param {Element|DocumentFragment} el
   * @param {Vue} [host] - host vm of transcluded content
   * @return {Function|undefined}
   */

  return function compositeLinkFn (vm, el, host) {
    // cache childNodes before linking parent, fix #657
    var childNodes = _.toArray(el.childNodes)
    // link
    var dirs = linkAndCapture(function () {
      if (nodeLinkFn) nodeLinkFn(vm, el, host)
      if (childLinkFn) childLinkFn(vm, childNodes, host)
    }, vm)
    return makeUnlinkFn(vm, dirs)
  }
}

/**
 * Apply a linker to a vm/element pair and capture the
 * directives created during the process.
 *
 * @param {Function} linker
 * @param {Vue} vm
 */

function linkAndCapture (linker, vm) {
  var originalDirCount = vm._directives.length
  linker()
  return vm._directives.slice(originalDirCount)
}

/**
 * Linker functions return an unlink function that
 * tearsdown all directives instances generated during
 * the process.
 *
 * We create unlink functions with only the necessary
 * information to avoid retaining additional closures.
 *
 * @param {Vue} vm
 * @param {Array} dirs
 * @param {Vue} [context]
 * @param {Array} [contextDirs]
 * @return {Function}
 */

function makeUnlinkFn (vm, dirs, context, contextDirs) {
  return function unlink (destroying) {
    teardownDirs(vm, dirs, destroying)
    if (context && contextDirs) {
      teardownDirs(context, contextDirs)
    }
  }
}

/**
 * Teardown partial linked directives.
 *
 * @param {Vue} vm
 * @param {Array} dirs
 * @param {Boolean} destroying
 */

function teardownDirs (vm, dirs, destroying) {
  var i = dirs.length
  while (i--) {
    dirs[i]._teardown()
    if (!destroying) {
      vm._directives.$remove(dirs[i])
    }
  }
}

/**
 * Compile link props on an instance.
 *
 * @param {Vue} vm
 * @param {Element} el
 * @param {Object} options
 * @return {Function}
 */

exports.compileAndLinkProps = function (vm, el, props) {
  var propsLinkFn = compileProps(el, props)
  var propDirs = linkAndCapture(function () {
    propsLinkFn(vm, null)
  }, vm)
  return makeUnlinkFn(vm, propDirs)
}

/**
 * Compile the root element of an instance.
 *
 * 1. attrs on context container (context scope)
 * 2. attrs on the component template root node, if
 *    replace:true (child scope)
 *
 * If this is a fragment instance, we only need to compile 1.
 *
 * @param {Vue} vm
 * @param {Element} el
 * @param {Object} options
 * @return {Function}
 */

exports.compileRoot = function (el, options) {
  var containerAttrs = options._containerAttrs
  var replacerAttrs = options._replacerAttrs
  var contextLinkFn, replacerLinkFn

  // only need to compile other attributes for
  // non-fragment instances
  if (el.nodeType !== 11) {
    // for components, container and replacer need to be
    // compiled separately and linked in different scopes.
    if (options._asComponent) {
      // 2. container attributes
      if (containerAttrs) {
        contextLinkFn = compileDirectives(containerAttrs, options)
      }
      if (replacerAttrs) {
        // 3. replacer attributes
        replacerLinkFn = compileDirectives(replacerAttrs, options)
      }
    } else {
      // non-component, just compile as a normal element.
      replacerLinkFn = compileDirectives(el.attributes, options)
    }
  }

  return function rootLinkFn (vm, el) {
    // link context scope dirs
    var context = vm._context
    var contextDirs
    if (context && contextLinkFn) {
      contextDirs = linkAndCapture(function () {
        contextLinkFn(context, el)
      }, context)
    }

    // link self
    var selfDirs = linkAndCapture(function () {
      if (replacerLinkFn) replacerLinkFn(vm, el)
    }, vm)

    // return the unlink function that tearsdown context
    // container directives.
    return makeUnlinkFn(vm, selfDirs, context, contextDirs)
  }
}

/**
 * Compile a node and return a nodeLinkFn based on the
 * node type.
 *
 * @param {Node} node
 * @param {Object} options
 * @return {Function|null}
 */

function compileNode (node, options) {
  var type = node.nodeType
  if (type === 1 && node.tagName !== 'SCRIPT') {
    return compileElement(node, options)
  } else if (type === 3 && config.interpolate && node.data.trim()) {
    return compileTextNode(node, options)
  } else {
    return null
  }
}

/**
 * Compile an element and return a nodeLinkFn.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Function|null}
 */

function compileElement (el, options) {
  // preprocess textareas.
  // textarea treats its text content as the initial value.
  // just bind it as a v-attr directive for value.
  if (el.tagName === 'TEXTAREA') {
    if (textParser.parse(el.value)) {
      el.setAttribute('value', el.value)
    }
  }
  var linkFn
  var hasAttrs = el.hasAttributes()
  // check terminal directives (repeat & if)
  if (hasAttrs) {
    linkFn = checkTerminalDirectives(el, options)
  }
  // check element directives
  if (!linkFn) {
    linkFn = checkElementDirectives(el, options)
  }
  // check component
  if (!linkFn) {
    linkFn = checkComponent(el, options)
  }
  // normal directives
  if (!linkFn && hasAttrs) {
    linkFn = compileDirectives(el.attributes, options)
  }
  return linkFn
}

/**
 * Compile a textNode and return a nodeLinkFn.
 *
 * @param {TextNode} node
 * @param {Object} options
 * @return {Function|null} textNodeLinkFn
 */

function compileTextNode (node, options) {
  var tokens = textParser.parse(node.data)
  if (!tokens) {
    return null
  }
  var frag = document.createDocumentFragment()
  var el, token
  for (var i = 0, l = tokens.length; i < l; i++) {
    token = tokens[i]
    el = token.tag
      ? processTextToken(token, options)
      : document.createTextNode(token.value)
    frag.appendChild(el)
  }
  return makeTextNodeLinkFn(tokens, frag, options)
}

/**
 * Process a single text token.
 *
 * @param {Object} token
 * @param {Object} options
 * @return {Node}
 */

function processTextToken (token, options) {
  var el
  if (token.oneTime) {
    el = document.createTextNode(token.value)
  } else {
    if (token.html) {
      el = document.createComment('v-html')
      setTokenType('html')
    } else {
      // IE will clean up empty textNodes during
      // frag.cloneNode(true), so we have to give it
      // something here...
      el = document.createTextNode(' ')
      setTokenType('text')
    }
  }
  function setTokenType (type) {
    token.type = type
    token.def = resolveAsset(options, 'directives', type)
    token.descriptor = dirParser.parse(token.value)[0]
  }
  return el
}

/**
 * Build a function that processes a textNode.
 *
 * @param {Array<Object>} tokens
 * @param {DocumentFragment} frag
 */

function makeTextNodeLinkFn (tokens, frag) {
  return function textNodeLinkFn (vm, el) {
    var fragClone = frag.cloneNode(true)
    var childNodes = _.toArray(fragClone.childNodes)
    var token, value, node
    for (var i = 0, l = tokens.length; i < l; i++) {
      token = tokens[i]
      value = token.value
      if (token.tag) {
        node = childNodes[i]
        if (token.oneTime) {
          value = vm.$eval(value)
          if (token.html) {
            _.replace(node, templateParser.parse(value, true))
          } else {
            node.data = value
          }
        } else {
          vm._bindDir(token.type, node,
                      token.descriptor, token.def)
        }
      }
    }
    _.replace(el, fragClone)
  }
}

/**
 * Compile a node list and return a childLinkFn.
 *
 * @param {NodeList} nodeList
 * @param {Object} options
 * @return {Function|undefined}
 */

function compileNodeList (nodeList, options) {
  var linkFns = []
  var nodeLinkFn, childLinkFn, node
  for (var i = 0, l = nodeList.length; i < l; i++) {
    node = nodeList[i]
    nodeLinkFn = compileNode(node, options)
    childLinkFn =
      !(nodeLinkFn && nodeLinkFn.terminal) &&
      node.tagName !== 'SCRIPT' &&
      node.hasChildNodes()
        ? compileNodeList(node.childNodes, options)
        : null
    linkFns.push(nodeLinkFn, childLinkFn)
  }
  return linkFns.length
    ? makeChildLinkFn(linkFns)
    : null
}

/**
 * Make a child link function for a node's childNodes.
 *
 * @param {Array<Function>} linkFns
 * @return {Function} childLinkFn
 */

function makeChildLinkFn (linkFns) {
  return function childLinkFn (vm, nodes, host) {
    var node, nodeLinkFn, childrenLinkFn
    for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
      node = nodes[n]
      nodeLinkFn = linkFns[i++]
      childrenLinkFn = linkFns[i++]
      // cache childNodes before linking parent, fix #657
      var childNodes = _.toArray(node.childNodes)
      if (nodeLinkFn) {
        nodeLinkFn(vm, node, host)
      }
      if (childrenLinkFn) {
        childrenLinkFn(vm, childNodes, host)
      }
    }
  }
}

/**
 * Check for element directives (custom elements that should
 * be resovled as terminal directives).
 *
 * @param {Element} el
 * @param {Object} options
 */

function checkElementDirectives (el, options) {
  var tag = el.tagName.toLowerCase()
  if (_.commonTagRE.test(tag)) return
  var def = resolveAsset(options, 'elementDirectives', tag)
  if (def) {
    return makeTerminalNodeLinkFn(el, tag, '', options, def)
  }
}

/**
 * Check if an element is a component. If yes, return
 * a component link function.
 *
 * @param {Element} el
 * @param {Object} options
 * @param {Boolean} hasAttrs
 * @return {Function|undefined}
 */

function checkComponent (el, options, hasAttrs) {
  var componentId = _.checkComponent(el, options, hasAttrs)
  if (componentId) {
    var componentLinkFn = function (vm, el, host) {
      vm._bindDir('component', el, {
        expression: componentId
      }, componentDef, host)
    }
    componentLinkFn.terminal = true
    return componentLinkFn
  }
}

/**
 * Check an element for terminal directives in fixed order.
 * If it finds one, return a terminal link function.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Function} terminalLinkFn
 */

function checkTerminalDirectives (el, options) {
  if (_.attr(el, 'pre') !== null) {
    return skip
  }
  var value, dirName
  for (var i = 0, l = terminalDirectives.length; i < l; i++) {
    dirName = terminalDirectives[i]
    if ((value = _.attr(el, dirName)) !== null) {
      return makeTerminalNodeLinkFn(el, dirName, value, options)
    }
  }
}

function skip () {}
skip.terminal = true

/**
 * Build a node link function for a terminal directive.
 * A terminal link function terminates the current
 * compilation recursion and handles compilation of the
 * subtree in the directive.
 *
 * @param {Element} el
 * @param {String} dirName
 * @param {String} value
 * @param {Object} options
 * @param {Object} [def]
 * @return {Function} terminalLinkFn
 */

function makeTerminalNodeLinkFn (el, dirName, value, options, def) {
  var descriptor = dirParser.parse(value)[0]
  // no need to call resolveAsset since terminal directives
  // are always internal
  def = def || options.directives[dirName]
  var fn = function terminalNodeLinkFn (vm, el, host) {
    vm._bindDir(dirName, el, descriptor, def, host)
  }
  fn.terminal = true
  return fn
}

/**
 * Compile the directives on an element and return a linker.
 *
 * @param {Array|NamedNodeMap} attrs
 * @param {Object} options
 * @return {Function}
 */

function compileDirectives (attrs, options) {
  var i = attrs.length
  var dirs = []
  var attr, name, value, dir, dirName, dirDef
  while (i--) {
    attr = attrs[i]
    name = attr.name
    value = attr.value
    if (name.indexOf(config.prefix) === 0) {
      dirName = name.slice(config.prefix.length)
      dirDef = resolveAsset(options, 'directives', dirName)
      if (process.env.NODE_ENV !== 'production') {
        _.assertAsset(dirDef, 'directive', dirName)
      }
      if (dirDef) {
        dirs.push({
          name: dirName,
          descriptors: dirParser.parse(value),
          def: dirDef
        })
      }
    } else if (config.interpolate) {
      dir = collectAttrDirective(name, value, options)
      if (dir) {
        dirs.push(dir)
      }
    }
  }
  // sort by priority, LOW to HIGH
  if (dirs.length) {
    dirs.sort(directiveComparator)
    return makeNodeLinkFn(dirs)
  }
}

/**
 * Build a link function for all directives on a single node.
 *
 * @param {Array} directives
 * @return {Function} directivesLinkFn
 */

function makeNodeLinkFn (directives) {
  return function nodeLinkFn (vm, el, host) {
    // reverse apply because it's sorted low to high
    var i = directives.length
    var dir, j, k
    while (i--) {
      dir = directives[i]
      if (dir._link) {
        // custom link fn
        dir._link(vm, el)
      } else {
        k = dir.descriptors.length
        for (j = 0; j < k; j++) {
          vm._bindDir(dir.name, el,
            dir.descriptors[j], dir.def, host)
        }
      }
    }
  }
}

/**
 * Check an attribute for potential dynamic bindings,
 * and return a directive object.
 *
 * Special case: class interpolations are translated into
 * v-class instead v-attr, so that it can work with user
 * provided v-class bindings.
 *
 * @param {String} name
 * @param {String} value
 * @param {Object} options
 * @return {Object}
 */

function collectAttrDirective (name, value, options) {
  var tokens = textParser.parse(value)
  var isClass = name === 'class'
  if (tokens) {
    var dirName = isClass ? 'class' : 'attr'
    var def = options.directives[dirName]
    var i = tokens.length
    var allOneTime = true
    while (i--) {
      var token = tokens[i]
      if (token.tag && !token.oneTime) {
        allOneTime = false
      }
    }
    var linker
    if (allOneTime) {
      linker = function (vm, el) {
        el.setAttribute(name, vm.$interpolate(value))
      }
    } else {
      linker = function (vm, el) {
        var exp = textParser.tokensToExp(tokens, vm)
        var desc = isClass
          ? dirParser.parse(exp)[0]
          : dirParser.parse(name + ':' + exp)[0]
        if (isClass) {
          desc._rawClass = value
        }
        vm._bindDir(dirName, el, desc, def)
      }
    }
    return {
      def: def,
      _link: linker
    }
  }
}

/**
 * Directive priority sort comparator
 *
 * @param {Object} a
 * @param {Object} b
 */

function directiveComparator (a, b) {
  a = a.def.priority || 0
  b = b.def.priority || 0
  return a > b ? 1 : -1
}

}).call(this,require('_process'))

},{"../config":84,"../directives/component":89,"../parsers/directive":121,"../parsers/template":124,"../parsers/text":125,"../util":133,"./compile-props":80,"_process":24}],82:[function(require,module,exports){
var _ = require('../util')

_.extend(exports, require('./compile'))
_.extend(exports, require('./transclude'))

},{"../util":133,"./compile":81,"./transclude":83}],83:[function(require,module,exports){
(function (process){
var _ = require('../util')
var config = require('../config')
var templateParser = require('../parsers/template')

/**
 * Process an element or a DocumentFragment based on a
 * instance option object. This allows us to transclude
 * a template node/fragment before the instance is created,
 * so the processed fragment can then be cloned and reused
 * in v-repeat.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Element|DocumentFragment}
 */

exports.transclude = function (el, options) {
  // extract container attributes to pass them down
  // to compiler, because they need to be compiled in
  // parent scope. we are mutating the options object here
  // assuming the same object will be used for compile
  // right after this.
  if (options) {
    options._containerAttrs = extractAttrs(el)
  }
  // for template tags, what we want is its content as
  // a documentFragment (for fragment instances)
  if (_.isTemplate(el)) {
    el = templateParser.parse(el)
  }
  if (options) {
    if (options._asComponent && !options.template) {
      options.template = '<content></content>'
    }
    if (options.template) {
      options._content = _.extractContent(el)
      el = transcludeTemplate(el, options)
    }
  }
  if (el instanceof DocumentFragment) {
    // anchors for fragment instance
    // passing in `persist: true` to avoid them being
    // discarded by IE during template cloning
    _.prepend(_.createAnchor('v-start', true), el)
    el.appendChild(_.createAnchor('v-end', true))
  }
  return el
}

/**
 * Process the template option.
 * If the replace option is true this will swap the $el.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Element|DocumentFragment}
 */

function transcludeTemplate (el, options) {
  var template = options.template
  var frag = templateParser.parse(template, true)
  if (frag) {
    var replacer = frag.firstChild
    var tag = replacer.tagName && replacer.tagName.toLowerCase()
    if (options.replace) {
      /* istanbul ignore if */
      if (el === document.body) {
        process.env.NODE_ENV !== 'production' && _.warn(
          'You are mounting an instance with a template to ' +
          '<body>. This will replace <body> entirely. You ' +
          'should probably use `replace: false` here.'
        )
      }
      // there are many cases where the instance must
      // become a fragment instance: basically anything that
      // can create more than 1 root nodes.
      if (
        // multi-children template
        frag.childNodes.length > 1 ||
        // non-element template
        replacer.nodeType !== 1 ||
        // single nested component
        tag === 'component' ||
        _.resolveAsset(options, 'components', tag) ||
        replacer.hasAttribute(config.prefix + 'component') ||
        // element directive
        _.resolveAsset(options, 'elementDirectives', tag) ||
        // repeat block
        replacer.hasAttribute(config.prefix + 'repeat')
      ) {
        return frag
      } else {
        options._replacerAttrs = extractAttrs(replacer)
        mergeAttrs(el, replacer)
        return replacer
      }
    } else {
      el.appendChild(frag)
      return el
    }
  } else {
    process.env.NODE_ENV !== 'production' && _.warn(
      'Invalid template option: ' + template
    )
  }
}

/**
 * Helper to extract a component container's attributes
 * into a plain object array.
 *
 * @param {Element} el
 * @return {Array}
 */

function extractAttrs (el) {
  if (el.nodeType === 1 && el.hasAttributes()) {
    return _.toArray(el.attributes)
  }
}

/**
 * Merge the attributes of two elements, and make sure
 * the class names are merged properly.
 *
 * @param {Element} from
 * @param {Element} to
 */

function mergeAttrs (from, to) {
  var attrs = from.attributes
  var i = attrs.length
  var name, value
  while (i--) {
    name = attrs[i].name
    value = attrs[i].value
    if (!to.hasAttribute(name)) {
      to.setAttribute(name, value)
    } else if (name === 'class') {
      value = to.getAttribute(name) + ' ' + value
      to.setAttribute(name, value)
    }
  }
}

}).call(this,require('_process'))

},{"../config":84,"../parsers/template":124,"../util":133,"_process":24}],84:[function(require,module,exports){
module.exports = {

  /**
   * The prefix to look for when parsing directives.
   *
   * @type {String}
   */

  prefix: 'v-',

  /**
   * Whether to print debug messages.
   * Also enables stack trace for warnings.
   *
   * @type {Boolean}
   */

  debug: false,

  /**
   * Strict mode.
   * Disables asset lookup in the view parent chain.
   */

  strict: false,

  /**
   * Whether to suppress warnings.
   *
   * @type {Boolean}
   */

  silent: false,

  /**
   * Whether allow observer to alter data objects'
   * __proto__.
   *
   * @type {Boolean}
   */

  proto: true,

  /**
   * Whether to parse mustache tags in templates.
   *
   * @type {Boolean}
   */

  interpolate: true,

  /**
   * Whether to use async rendering.
   */

  async: true,

  /**
   * Whether to warn against errors caught when evaluating
   * expressions.
   */

  warnExpressionErrors: true,

  /**
   * Internal flag to indicate the delimiters have been
   * changed.
   *
   * @type {Boolean}
   */

  _delimitersChanged: true,

  /**
   * List of asset types that a component can own.
   *
   * @type {Array}
   */

  _assetTypes: [
    'component',
    'directive',
    'elementDirective',
    'filter',
    'transition',
    'partial'
  ],

  /**
   * prop binding modes
   */

  _propBindingModes: {
    ONE_WAY: 0,
    TWO_WAY: 1,
    ONE_TIME: 2
  },

  /**
   * Max circular updates allowed in a batcher flush cycle.
   */

  _maxUpdateCount: 100

}

/**
 * Interpolation delimiters.
 * We need to mark the changed flag so that the text parser
 * knows it needs to recompile the regex.
 *
 * @type {Array<String>}
 */

var delimiters = ['{{', '}}']
Object.defineProperty(module.exports, 'delimiters', {
  get: function () {
    return delimiters
  },
  set: function (val) {
    delimiters = val
    this._delimitersChanged = true
  }
})

},{}],85:[function(require,module,exports){
(function (process){
var _ = require('./util')
var config = require('./config')
var Watcher = require('./watcher')
var textParser = require('./parsers/text')
var expParser = require('./parsers/expression')
function noop () {}

/**
 * A directive links a DOM element with a piece of data,
 * which is the result of evaluating an expression.
 * It registers a watcher with the expression and calls
 * the DOM update function when a change is triggered.
 *
 * @param {String} name
 * @param {Node} el
 * @param {Vue} vm
 * @param {Object} descriptor
 *                 - {String} expression
 *                 - {String} [arg]
 *                 - {Array<Object>} [filters]
 * @param {Object} def - directive definition object
 * @param {Vue|undefined} host - transclusion host target
 * @constructor
 */

function Directive (name, el, vm, descriptor, def, host) {
  // public
  this.name = name
  this.el = el
  this.vm = vm
  // copy descriptor props
  this.raw = descriptor.raw
  this.expression = descriptor.expression
  this.arg = descriptor.arg
  this.filters = descriptor.filters
  // private
  this._descriptor = descriptor
  this._host = host
  this._locked = false
  this._bound = false
  this._listeners = null
  // init
  this._bind(def)
}

/**
 * Initialize the directive, mixin definition properties,
 * setup the watcher, call definition bind() and update()
 * if present.
 *
 * @param {Object} def
 */

Directive.prototype._bind = function (def) {
  if (
    (this.name !== 'cloak' || this.vm._isCompiled) &&
    this.el && this.el.removeAttribute
  ) {
    this.el.removeAttribute(config.prefix + this.name)
  }
  if (typeof def === 'function') {
    this.update = def
  } else {
    _.extend(this, def)
  }
  this._watcherExp = this.expression
  this._checkDynamicLiteral()
  if (this.bind) {
    this.bind()
  }
  if (this._watcherExp &&
      (this.update || this.twoWay) &&
      (!this.isLiteral || this._isDynamicLiteral) &&
      !this._checkStatement()) {
    // wrapped updater for context
    var dir = this
    if (this.update) {
      this._update = function (val, oldVal) {
        if (!dir._locked) {
          dir.update(val, oldVal)
        }
      }
    } else {
      this._update = noop
    }
    // pre-process hook called before the value is piped
    // through the filters. used in v-repeat.
    var preProcess = this._preProcess
      ? _.bind(this._preProcess, this)
      : null
    var watcher = this._watcher = new Watcher(
      this.vm,
      this._watcherExp,
      this._update, // callback
      {
        filters: this.filters,
        twoWay: this.twoWay,
        deep: this.deep,
        preProcess: preProcess
      }
    )
    if (this._initValue != null) {
      watcher.set(this._initValue)
    } else if (this.update) {
      this.update(watcher.value)
    }
  }
  this._bound = true
}

/**
 * check if this is a dynamic literal binding.
 *
 * e.g. v-component="{{currentView}}"
 */

Directive.prototype._checkDynamicLiteral = function () {
  var expression = this.expression
  if (expression && this.isLiteral) {
    var tokens = textParser.parse(expression)
    if (tokens) {
      var exp = textParser.tokensToExp(tokens)
      this.expression = this.vm.$get(exp)
      this._watcherExp = exp
      this._isDynamicLiteral = true
    }
  }
}

/**
 * Check if the directive is a function caller
 * and if the expression is a callable one. If both true,
 * we wrap up the expression and use it as the event
 * handler.
 *
 * e.g. v-on="click: a++"
 *
 * @return {Boolean}
 */

Directive.prototype._checkStatement = function () {
  var expression = this.expression
  if (
    expression && this.acceptStatement &&
    !expParser.isSimplePath(expression)
  ) {
    var fn = expParser.parse(expression).get
    var vm = this.vm
    var handler = function () {
      fn.call(vm, vm)
    }
    if (this.filters) {
      handler = vm._applyFilters(handler, null, this.filters)
    }
    this.update(handler)
    return true
  }
}

/**
 * Check for an attribute directive param, e.g. lazy
 *
 * @param {String} name
 * @return {String}
 */

Directive.prototype._checkParam = function (name) {
  var param = this.el.getAttribute(name)
  if (param !== null) {
    this.el.removeAttribute(name)
    param = this.vm.$interpolate(param)
  }
  return param
}

/**
 * Set the corresponding value with the setter.
 * This should only be used in two-way directives
 * e.g. v-model.
 *
 * @param {*} value
 * @public
 */

Directive.prototype.set = function (value) {
  /* istanbul ignore else */
  if (this.twoWay) {
    this._withLock(function () {
      this._watcher.set(value)
    })
  } else if (process.env.NODE_ENV !== 'production') {
    _.warn(
      'Directive.set() can only be used inside twoWay' +
      'directives.'
    )
  }
}

/**
 * Execute a function while preventing that function from
 * triggering updates on this directive instance.
 *
 * @param {Function} fn
 */

Directive.prototype._withLock = function (fn) {
  var self = this
  self._locked = true
  fn.call(self)
  _.nextTick(function () {
    self._locked = false
  })
}

/**
 * Convenience method that attaches a DOM event listener
 * to the directive element and autometically tears it down
 * during unbind.
 *
 * @param {String} event
 * @param {Function} handler
 */

Directive.prototype.on = function (event, handler) {
  _.on(this.el, event, handler)
  ;(this._listeners || (this._listeners = []))
    .push([event, handler])
}

/**
 * Teardown the watcher and call unbind.
 */

Directive.prototype._teardown = function () {
  if (this._bound) {
    this._bound = false
    if (this.unbind) {
      this.unbind()
    }
    if (this._watcher) {
      this._watcher.teardown()
    }
    var listeners = this._listeners
    if (listeners) {
      for (var i = 0; i < listeners.length; i++) {
        _.off(this.el, listeners[i][0], listeners[i][1])
      }
    }
    this.vm = this.el =
    this._watcher = this._listeners = null
  }
}

module.exports = Directive

}).call(this,require('_process'))

},{"./config":84,"./parsers/expression":122,"./parsers/text":125,"./util":133,"./watcher":137,"_process":24}],86:[function(require,module,exports){
// xlink
var xlinkNS = 'http://www.w3.org/1999/xlink'
var xlinkRE = /^xlink:/
var inputProps = {
  value: 1,
  checked: 1,
  selected: 1
}

module.exports = {

  priority: 850,

  update: function (value) {
    if (this.arg) {
      this.setAttr(this.arg, value)
    } else if (typeof value === 'object') {
      this.objectHandler(value)
    }
  },

  objectHandler: function (value) {
    // cache object attrs so that only changed attrs
    // are actually updated.
    var cache = this.cache || (this.cache = {})
    var attr, val
    for (attr in cache) {
      if (!(attr in value)) {
        this.setAttr(attr, null)
        delete cache[attr]
      }
    }
    for (attr in value) {
      val = value[attr]
      if (val !== cache[attr]) {
        cache[attr] = val
        this.setAttr(attr, val)
      }
    }
  },

  setAttr: function (attr, value) {
    if (inputProps[attr] && attr in this.el) {
      if (!this.valueRemoved) {
        this.el.removeAttribute(attr)
        this.valueRemoved = true
      }
      this.el[attr] = value
    } else if (value != null && value !== false) {
      if (xlinkRE.test(attr)) {
        this.el.setAttributeNS(xlinkNS, attr, value)
      } else {
        this.el.setAttribute(attr, value)
      }
    } else {
      this.el.removeAttribute(attr)
    }
  }
}

},{}],87:[function(require,module,exports){
var _ = require('../util')
var addClass = _.addClass
var removeClass = _.removeClass

module.exports = {

  bind: function () {
    // interpolations like class="{{abc}}" are converted
    // to v-class, and we need to remove the raw,
    // uninterpolated className at binding time.
    var raw = this._descriptor._rawClass
    if (raw) {
      this.prevKeys = raw.trim().split(/\s+/)
    }
  },

  update: function (value) {
    if (this.arg) {
      // single toggle
      if (value) {
        addClass(this.el, this.arg)
      } else {
        removeClass(this.el, this.arg)
      }
    } else {
      if (value && typeof value === 'string') {
        this.handleObject(stringToObject(value))
      } else if (_.isPlainObject(value)) {
        this.handleObject(value)
      } else {
        this.cleanup()
      }
    }
  },

  handleObject: function (value) {
    this.cleanup(value)
    var keys = this.prevKeys = Object.keys(value)
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i]
      if (value[key]) {
        addClass(this.el, key)
      } else {
        removeClass(this.el, key)
      }
    }
  },

  cleanup: function (value) {
    if (this.prevKeys) {
      var i = this.prevKeys.length
      while (i--) {
        var key = this.prevKeys[i]
        if (!value || !value.hasOwnProperty(key)) {
          removeClass(this.el, key)
        }
      }
    }
  }
}

function stringToObject (value) {
  var res = {}
  var keys = value.trim().split(/\s+/)
  var i = keys.length
  while (i--) {
    res[keys[i]] = true
  }
  return res
}

},{"../util":133}],88:[function(require,module,exports){
var config = require('../config')

module.exports = {
  bind: function () {
    var el = this.el
    this.vm.$once('hook:compiled', function () {
      el.removeAttribute(config.prefix + 'cloak')
    })
  }
}

},{"../config":84}],89:[function(require,module,exports){
(function (process){
var _ = require('../util')
var config = require('../config')
var templateParser = require('../parsers/template')

module.exports = {

  isLiteral: true,

  /**
   * Setup. Two possible usages:
   *
   * - static:
   *   v-component="comp"
   *
   * - dynamic:
   *   v-component="{{currentView}}"
   */

  bind: function () {
    if (!this.el.__vue__) {
      // create a ref anchor
      this.anchor = _.createAnchor('v-component')
      _.replace(this.el, this.anchor)
      // check keep-alive options.
      // If yes, instead of destroying the active vm when
      // hiding (v-if) or switching (dynamic literal) it,
      // we simply remove it from the DOM and save it in a
      // cache object, with its constructor id as the key.
      this.keepAlive = this._checkParam('keep-alive') != null
      // wait for event before insertion
      this.waitForEvent = this._checkParam('wait-for')
      // check ref
      this.refID = this._checkParam(config.prefix + 'ref')
      if (this.keepAlive) {
        this.cache = {}
      }
      // check inline-template
      if (this._checkParam('inline-template') !== null) {
        // extract inline template as a DocumentFragment
        this.template = _.extractContent(this.el, true)
      }
      // component resolution related state
      this.pendingComponentCb =
      this.Component = null
      // transition related state
      this.pendingRemovals = 0
      this.pendingRemovalCb = null
      // if static, build right now.
      if (!this._isDynamicLiteral) {
        this.resolveComponent(this.expression, _.bind(this.initStatic, this))
      } else {
        // check dynamic component params
        this.transMode = this._checkParam('transition-mode')
      }
    } else {
      process.env.NODE_ENV !== 'production' && _.warn(
        'cannot mount component "' + this.expression + '" ' +
        'on already mounted element: ' + this.el
      )
    }
  },

  /**
   * Initialize a static component.
   */

  initStatic: function () {
    // wait-for
    var anchor = this.anchor
    var options
    var waitFor = this.waitForEvent
    if (waitFor) {
      options = {
        created: function () {
          this.$once(waitFor, function () {
            this.$before(anchor)
          })
        }
      }
    }
    var child = this.build(options)
    this.setCurrent(child)
    if (!this.waitForEvent) {
      child.$before(anchor)
    }
  },

  /**
   * Public update, called by the watcher in the dynamic
   * literal scenario, e.g. v-component="{{view}}"
   */

  update: function (value) {
    this.setComponent(value)
  },

  /**
   * Switch dynamic components. May resolve the component
   * asynchronously, and perform transition based on
   * specified transition mode. Accepts a few additional
   * arguments specifically for vue-router.
   *
   * The callback is called when the full transition is
   * finished.
   *
   * @param {String} value
   * @param {Function} [cb]
   */

  setComponent: function (value, cb) {
    this.invalidatePending()
    if (!value) {
      // just remove current
      this.unbuild(true)
      this.remove(this.childVM, cb)
      this.unsetCurrent()
    } else {
      this.resolveComponent(value, _.bind(function () {
        this.unbuild(true)
        var options
        var self = this
        var waitFor = this.waitForEvent
        if (waitFor) {
          options = {
            created: function () {
              this.$once(waitFor, function () {
                self.waitingFor = null
                self.transition(this, cb)
              })
            }
          }
        }
        var cached = this.getCached()
        var newComponent = this.build(options)
        if (!waitFor || cached) {
          this.transition(newComponent, cb)
        } else {
          this.waitingFor = newComponent
        }
      }, this))
    }
  },

  /**
   * Resolve the component constructor to use when creating
   * the child vm.
   */

  resolveComponent: function (id, cb) {
    var self = this
    this.pendingComponentCb = _.cancellable(function (Component) {
      self.Component = Component
      cb()
    })
    this.vm._resolveComponent(id, this.pendingComponentCb)
  },

  /**
   * When the component changes or unbinds before an async
   * constructor is resolved, we need to invalidate its
   * pending callback.
   */

  invalidatePending: function () {
    if (this.pendingComponentCb) {
      this.pendingComponentCb.cancel()
      this.pendingComponentCb = null
    }
  },

  /**
   * Instantiate/insert a new child vm.
   * If keep alive and has cached instance, insert that
   * instance; otherwise build a new one and cache it.
   *
   * @param {Object} [extraOptions]
   * @return {Vue} - the created instance
   */

  build: function (extraOptions) {
    var cached = this.getCached()
    if (cached) {
      return cached
    }
    if (this.Component) {
      // default options
      var options = {
        el: templateParser.clone(this.el),
        template: this.template,
        // if no inline-template, then the compiled
        // linker can be cached for better performance.
        _linkerCachable: !this.template,
        _asComponent: true,
        _isRouterView: this._isRouterView,
        _context: this.vm
      }
      // extra options
      if (extraOptions) {
        _.extend(options, extraOptions)
      }
      var parent = this._host || this.vm
      var child = parent.$addChild(options, this.Component)
      if (this.keepAlive) {
        this.cache[this.Component.cid] = child
      }
      return child
    }
  },

  /**
   * Try to get a cached instance of the current component.
   *
   * @return {Vue|undefined}
   */

  getCached: function () {
    return this.keepAlive && this.cache[this.Component.cid]
  },

  /**
   * Teardown the current child, but defers cleanup so
   * that we can separate the destroy and removal steps.
   *
   * @param {Boolean} defer
   */

  unbuild: function (defer) {
    if (this.waitingFor) {
      this.waitingFor.$destroy()
      this.waitingFor = null
    }
    var child = this.childVM
    if (!child || this.keepAlive) {
      return
    }
    // the sole purpose of `deferCleanup` is so that we can
    // "deactivate" the vm right now and perform DOM removal
    // later.
    child.$destroy(false, defer)
  },

  /**
   * Remove current destroyed child and manually do
   * the cleanup after removal.
   *
   * @param {Function} cb
   */

  remove: function (child, cb) {
    var keepAlive = this.keepAlive
    if (child) {
      // we may have a component switch when a previous
      // component is still being transitioned out.
      // we want to trigger only one lastest insertion cb
      // when the existing transition finishes. (#1119)
      this.pendingRemovals++
      this.pendingRemovalCb = cb
      var self = this
      child.$remove(function () {
        self.pendingRemovals--
        if (!keepAlive) child._cleanup()
        if (!self.pendingRemovals && self.pendingRemovalCb) {
          self.pendingRemovalCb()
          self.pendingRemovalCb = null
        }
      })
    } else if (cb) {
      cb()
    }
  },

  /**
   * Actually swap the components, depending on the
   * transition mode. Defaults to simultaneous.
   *
   * @param {Vue} target
   * @param {Function} [cb]
   */

  transition: function (target, cb) {
    var self = this
    var current = this.childVM
    this.setCurrent(target)
    switch (self.transMode) {
      case 'in-out':
        target.$before(self.anchor, function () {
          self.remove(current, cb)
        })
        break
      case 'out-in':
        self.remove(current, function () {
          target.$before(self.anchor, cb)
        })
        break
      default:
        self.remove(current)
        target.$before(self.anchor, cb)
    }
  },

  /**
   * Set childVM and parent ref
   */

  setCurrent: function (child) {
    this.unsetCurrent()
    this.childVM = child
    var refID = child._refID || this.refID
    if (refID) {
      this.vm.$[refID] = child
    }
  },

  /**
   * Unset childVM and parent ref
   */

  unsetCurrent: function () {
    var child = this.childVM
    this.childVM = null
    var refID = (child && child._refID) || this.refID
    if (refID) {
      this.vm.$[refID] = null
    }
  },

  /**
   * Unbind.
   */

  unbind: function () {
    this.invalidatePending()
    // Do not defer cleanup when unbinding
    this.unbuild()
    this.unsetCurrent()
    // destroy all keep-alive cached instances
    if (this.cache) {
      for (var key in this.cache) {
        this.cache[key].$destroy()
      }
      this.cache = null
    }
  }
}

}).call(this,require('_process'))

},{"../config":84,"../parsers/template":124,"../util":133,"_process":24}],90:[function(require,module,exports){
module.exports = {

  isLiteral: true,

  bind: function () {
    this.vm.$$[this.expression] = this.el
  },

  unbind: function () {
    delete this.vm.$$[this.expression]
  }
}

},{}],91:[function(require,module,exports){
var _ = require('../util')
var templateParser = require('../parsers/template')

module.exports = {

  bind: function () {
    // a comment node means this is a binding for
    // {{{ inline unescaped html }}}
    if (this.el.nodeType === 8) {
      // hold nodes
      this.nodes = []
      // replace the placeholder with proper anchor
      this.anchor = _.createAnchor('v-html')
      _.replace(this.el, this.anchor)
    }
  },

  update: function (value) {
    value = _.toString(value)
    if (this.nodes) {
      this.swap(value)
    } else {
      this.el.innerHTML = value
    }
  },

  swap: function (value) {
    // remove old nodes
    var i = this.nodes.length
    while (i--) {
      _.remove(this.nodes[i])
    }
    // convert new value to a fragment
    // do not attempt to retrieve from id selector
    var frag = templateParser.parse(value, true, true)
    // save a reference to these nodes so we can remove later
    this.nodes = _.toArray(frag.childNodes)
    _.before(frag, this.anchor)
  }
}

},{"../parsers/template":124,"../util":133}],92:[function(require,module,exports){
(function (process){
var _ = require('../util')
var compiler = require('../compiler')
var templateParser = require('../parsers/template')
var transition = require('../transition')
var Cache = require('../cache')
var cache = new Cache(1000)

module.exports = {

  bind: function () {
    var el = this.el
    if (!el.__vue__) {
      this.start = _.createAnchor('v-if-start')
      this.end = _.createAnchor('v-if-end')
      _.replace(el, this.end)
      _.before(this.start, this.end)
      if (_.isTemplate(el)) {
        this.template = templateParser.parse(el, true)
      } else {
        this.template = document.createDocumentFragment()
        this.template.appendChild(templateParser.clone(el))
      }
      // compile the nested partial
      var cacheId = (this.vm.constructor.cid || '') + el.outerHTML
      this.linker = cache.get(cacheId)
      if (!this.linker) {
        this.linker = compiler.compile(
          this.template,
          this.vm.$options,
          true // partial
        )
        cache.put(cacheId, this.linker)
      }
    } else {
      process.env.NODE_ENV !== 'production' && _.warn(
        'v-if="' + this.expression + '" cannot be ' +
        'used on an instance root element.'
      )
      this.invalid = true
    }
  },

  update: function (value) {
    if (this.invalid) return
    if (value) {
      // avoid duplicate compiles, since update() can be
      // called with different truthy values
      if (!this.unlink) {
        this.link(
          templateParser.clone(this.template),
          this.linker
        )
      }
    } else {
      this.teardown()
    }
  },

  link: function (frag, linker) {
    var vm = this.vm
    this.unlink = linker(vm, frag, this._host /* important */)
    transition.blockAppend(frag, this.end, vm)
    // call attached for all the child components created
    // during the compilation
    if (_.inDoc(vm.$el)) {
      var children = this.getContainedComponents()
      if (children) children.forEach(callAttach)
    }
  },

  teardown: function () {
    if (!this.unlink) return
    // collect children beforehand
    var children
    if (_.inDoc(this.vm.$el)) {
      children = this.getContainedComponents()
    }
    transition.blockRemove(this.start, this.end, this.vm)
    if (children) children.forEach(callDetach)
    this.unlink()
    this.unlink = null
  },

  getContainedComponents: function () {
    var vm = this._host || this.vm
    var start = this.start.nextSibling
    var end = this.end

    function contains (c) {
      var cur = start
      var next
      while (next !== end) {
        next = cur.nextSibling
        if (
          cur === c.$el ||
          cur.contains && cur.contains(c.$el)
        ) {
          return true
        }
        cur = next
      }
      return false
    }

    return vm.$children.length &&
      vm.$children.filter(contains)
  },

  unbind: function () {
    if (this.unlink) this.unlink()
  }

}

function callAttach (child) {
  if (!child._isAttached) {
    child._callHook('attached')
  }
}

function callDetach (child) {
  if (child._isAttached) {
    child._callHook('detached')
  }
}

}).call(this,require('_process'))

},{"../cache":79,"../compiler":82,"../parsers/template":124,"../transition":126,"../util":133,"_process":24}],93:[function(require,module,exports){
// manipulation directives
exports.text = require('./text')
exports.html = require('./html')
exports.attr = require('./attr')
exports.show = require('./show')
exports['class'] = require('./class')
exports.el = require('./el')
exports.ref = require('./ref')
exports.cloak = require('./cloak')
exports.style = require('./style')
exports.transition = require('./transition')

// event listener directives
exports.on = require('./on')
exports.model = require('./model')

// logic control directives
exports.repeat = require('./repeat')
exports['if'] = require('./if')

// internal directives that should not be used directly
// but we still want to expose them for advanced usage.
exports._component = require('./component')
exports._prop = require('./prop')

},{"./attr":86,"./class":87,"./cloak":88,"./component":89,"./el":90,"./html":91,"./if":92,"./model":95,"./on":99,"./prop":100,"./ref":101,"./repeat":102,"./show":103,"./style":104,"./text":105,"./transition":106}],94:[function(require,module,exports){
var _ = require('../../util')

module.exports = {

  bind: function () {
    var self = this
    var el = this.el
    var trueExp = this._checkParam('true-exp')
    var falseExp = this._checkParam('false-exp')

    this._matchValue = function (value) {
      if (trueExp !== null) {
        return _.looseEqual(value, self.vm.$eval(trueExp))
      } else {
        return !!value
      }
    }

    function getValue () {
      var val = el.checked
      if (val && trueExp !== null) {
        val = self.vm.$eval(trueExp)
      }
      if (!val && falseExp !== null) {
        val = self.vm.$eval(falseExp)
      }
      return val
    }

    this.on('change', function () {
      self.set(getValue())
    })

    if (el.checked) {
      this._initValue = getValue()
    }
  },

  update: function (value) {
    this.el.checked = this._matchValue(value)
  }
}

},{"../../util":133}],95:[function(require,module,exports){
(function (process){
var _ = require('../../util')

var handlers = {
  text: require('./text'),
  radio: require('./radio'),
  select: require('./select'),
  checkbox: require('./checkbox')
}

module.exports = {

  priority: 800,
  twoWay: true,
  handlers: handlers,

  /**
   * Possible elements:
   *   <select>
   *   <textarea>
   *   <input type="*">
   *     - text
   *     - checkbox
   *     - radio
   *     - number
   *     - TODO: more types may be supplied as a plugin
   */

  bind: function () {
    // friendly warning...
    this.checkFilters()
    if (this.hasRead && !this.hasWrite) {
      process.env.NODE_ENV !== 'production' && _.warn(
        'It seems you are using a read-only filter with ' +
        'v-model. You might want to use a two-way filter ' +
        'to ensure correct behavior.'
      )
    }
    var el = this.el
    var tag = el.tagName
    var handler
    if (tag === 'INPUT') {
      handler = handlers[el.type] || handlers.text
    } else if (tag === 'SELECT') {
      handler = handlers.select
    } else if (tag === 'TEXTAREA') {
      handler = handlers.text
    } else {
      process.env.NODE_ENV !== 'production' && _.warn(
        'v-model does not support element type: ' + tag
      )
      return
    }
    el.__v_model = this
    handler.bind.call(this)
    this.update = handler.update
    this._unbind = handler.unbind
  },

  /**
   * Check read/write filter stats.
   */

  checkFilters: function () {
    var filters = this.filters
    if (!filters) return
    var i = filters.length
    while (i--) {
      var filter = _.resolveAsset(this.vm.$options, 'filters', filters[i].name)
      if (typeof filter === 'function' || filter.read) {
        this.hasRead = true
      }
      if (filter.write) {
        this.hasWrite = true
      }
    }
  },

  unbind: function () {
    this.el.__v_model = null
    this._unbind && this._unbind()
  }
}

}).call(this,require('_process'))

},{"../../util":133,"./checkbox":94,"./radio":96,"./select":97,"./text":98,"_process":24}],96:[function(require,module,exports){
var _ = require('../../util')

module.exports = {

  bind: function () {
    var self = this
    var el = this.el
    var number = this._checkParam('number') != null
    var expression = this._checkParam('exp')

    this.getValue = function () {
      var val = el.value
      if (number) {
        val = _.toNumber(val)
      } else if (expression !== null) {
        val = self.vm.$eval(expression)
      }
      return val
    }

    this.on('change', function () {
      self.set(self.getValue())
    })

    if (el.checked) {
      this._initValue = this.getValue()
    }
  },

  update: function (value) {
    this.el.checked = _.looseEqual(value, this.getValue())
  }
}

},{"../../util":133}],97:[function(require,module,exports){
(function (process){
var _ = require('../../util')
var Watcher = require('../../watcher')
var dirParser = require('../../parsers/directive')

module.exports = {

  bind: function () {
    var self = this
    var el = this.el

    // method to force update DOM using latest value.
    this.forceUpdate = function () {
      if (self._watcher) {
        self.update(self._watcher.get())
      }
    }

    // check options param
    var optionsParam = this._checkParam('options')
    if (optionsParam) {
      initOptions.call(this, optionsParam)
    }
    this.number = this._checkParam('number') != null
    this.multiple = el.hasAttribute('multiple')

    // attach listener
    this.on('change', function () {
      var value = getValue(el, self.multiple)
      value = self.number
        ? _.isArray(value)
          ? value.map(_.toNumber)
          : _.toNumber(value)
        : value
      self.set(value)
    })

    // check initial value (inline selected attribute)
    checkInitialValue.call(this)

    // All major browsers except Firefox resets
    // selectedIndex with value -1 to 0 when the element
    // is appended to a new parent, therefore we have to
    // force a DOM update whenever that happens...
    this.vm.$on('hook:attached', this.forceUpdate)
  },

  update: function (value) {
    var el = this.el
    el.selectedIndex = -1
    if (value == null) {
      if (this.defaultOption) {
        this.defaultOption.selected = true
      }
      return
    }
    var multi = this.multiple && _.isArray(value)
    var options = el.options
    var i = options.length
    var op, val
    while (i--) {
      op = options[i]
      val = op.hasOwnProperty('_value')
        ? op._value
        : op.value
      /* eslint-disable eqeqeq */
      op.selected = multi
        ? indexOf(value, val) > -1
        : _.looseEqual(value, val)
      /* eslint-enable eqeqeq */
    }
  },

  unbind: function () {
    this.vm.$off('hook:attached', this.forceUpdate)
    if (this.optionWatcher) {
      this.optionWatcher.teardown()
    }
  }
}

/**
 * Initialize the option list from the param.
 *
 * @param {String} expression
 */

function initOptions (expression) {
  var self = this
  var el = self.el
  var defaultOption = self.defaultOption = self.el.options[0]
  var descriptor = dirParser.parse(expression)[0]
  function optionUpdateWatcher (value) {
    if (_.isArray(value)) {
      // clear old options.
      // cannot reset innerHTML here because IE family get
      // confused during compilation.
      var i = el.options.length
      while (i--) {
        var option = el.options[i]
        if (option !== defaultOption) {
          var parentNode = option.parentNode
          if (parentNode === el) {
            parentNode.removeChild(option)
          } else {
            el.removeChild(parentNode)
            i = el.options.length
          }
        }
      }
      buildOptions(el, value)
      self.forceUpdate()
    } else {
      process.env.NODE_ENV !== 'production' && _.warn(
        'Invalid options value for v-model: ' + value
      )
    }
  }
  this.optionWatcher = new Watcher(
    this.vm,
    descriptor.expression,
    optionUpdateWatcher,
    {
      deep: true,
      filters: descriptor.filters
    }
  )
  // update with initial value
  optionUpdateWatcher(this.optionWatcher.value)
}

/**
 * Build up option elements. IE9 doesn't create options
 * when setting innerHTML on <select> elements, so we have
 * to use DOM API here.
 *
 * @param {Element} parent - a <select> or an <optgroup>
 * @param {Array} options
 */

function buildOptions (parent, options) {
  var op, el
  for (var i = 0, l = options.length; i < l; i++) {
    op = options[i]
    if (!op.options) {
      el = document.createElement('option')
      if (typeof op === 'string' || typeof op === 'number') {
        el.text = el.value = op
      } else {
        if (op.value != null && !_.isObject(op.value)) {
          el.value = op.value
        }
        // object values gets serialized when set as value,
        // so we store the raw value as a different property
        el._value = op.value
        el.text = op.text || ''
        if (op.disabled) {
          el.disabled = true
        }
      }
    } else {
      el = document.createElement('optgroup')
      el.label = op.label
      buildOptions(el, op.options)
    }
    parent.appendChild(el)
  }
}

/**
 * Check the initial value for selected options.
 */

function checkInitialValue () {
  var initValue
  var options = this.el.options
  for (var i = 0, l = options.length; i < l; i++) {
    if (options[i].hasAttribute('selected')) {
      if (this.multiple) {
        (initValue || (initValue = []))
          .push(options[i].value)
      } else {
        initValue = options[i].value
      }
    }
  }
  if (typeof initValue !== 'undefined') {
    this._initValue = this.number
      ? _.toNumber(initValue)
      : initValue
  }
}

/**
 * Get select value
 *
 * @param {SelectElement} el
 * @param {Boolean} multi
 * @return {Array|*}
 */

function getValue (el, multi) {
  var res = multi ? [] : null
  var op, val
  for (var i = 0, l = el.options.length; i < l; i++) {
    op = el.options[i]
    if (op.selected) {
      val = op.hasOwnProperty('_value')
        ? op._value
        : op.value
      if (multi) {
        res.push(val)
      } else {
        return val
      }
    }
  }
  return res
}

/**
 * Native Array.indexOf uses strict equal, but in this
 * case we need to match string/numbers with custom equal.
 *
 * @param {Array} arr
 * @param {*} val
 */

function indexOf (arr, val) {
  var i = arr.length
  while (i--) {
    if (_.looseEqual(arr[i], val)) {
      return i
    }
  }
  return -1
}

}).call(this,require('_process'))

},{"../../parsers/directive":121,"../../util":133,"../../watcher":137,"_process":24}],98:[function(require,module,exports){
var _ = require('../../util')

module.exports = {

  bind: function () {
    var self = this
    var el = this.el
    var isRange = el.type === 'range'

    // check params
    // - lazy: update model on "change" instead of "input"
    var lazy = this._checkParam('lazy') != null
    // - number: cast value into number when updating model.
    var number = this._checkParam('number') != null
    // - debounce: debounce the input listener
    var debounce = parseInt(this._checkParam('debounce'), 10)

    // handle composition events.
    //   http://blog.evanyou.me/2014/01/03/composition-event/
    // skip this for Android because it handles composition
    // events quite differently. Android doesn't trigger
    // composition events for language input methods e.g.
    // Chinese, but instead triggers them for spelling
    // suggestions... (see Discussion/#162)
    var composing = false
    if (!_.isAndroid && !isRange) {
      this.on('compositionstart', function () {
        composing = true
      })
      this.on('compositionend', function () {
        composing = false
        // in IE11 the "compositionend" event fires AFTER
        // the "input" event, so the input handler is blocked
        // at the end... have to call it here.
        //
        // #1327: in lazy mode this is unecessary.
        if (!lazy) {
          self.listener()
        }
      })
    }

    // prevent messing with the input when user is typing,
    // and force update on blur.
    this.focused = false
    if (!isRange) {
      this.on('focus', function () {
        self.focused = true
      })
      this.on('blur', function () {
        self.focused = false
        self.listener()
      })
    }

    // Now attach the main listener
    this.listener = function () {
      if (composing) return
      var val = number || isRange
        ? _.toNumber(el.value)
        : el.value
      self.set(val)
      // force update on next tick to avoid lock & same value
      // also only update when user is not typing
      _.nextTick(function () {
        if (self._bound && !self.focused) {
          self.update(self._watcher.value)
        }
      })
    }
    if (debounce) {
      this.listener = _.debounce(this.listener, debounce)
    }

    // Support jQuery events, since jQuery.trigger() doesn't
    // trigger native events in some cases and some plugins
    // rely on $.trigger()
    //
    // We want to make sure if a listener is attached using
    // jQuery, it is also removed with jQuery, that's why
    // we do the check for each directive instance and
    // store that check result on itself. This also allows
    // easier test coverage control by unsetting the global
    // jQuery variable in tests.
    this.hasjQuery = typeof jQuery === 'function'
    if (this.hasjQuery) {
      jQuery(el).on('change', this.listener)
      if (!lazy) {
        jQuery(el).on('input', this.listener)
      }
    } else {
      this.on('change', this.listener)
      if (!lazy) {
        this.on('input', this.listener)
      }
    }

    // IE9 doesn't fire input event on backspace/del/cut
    if (!lazy && _.isIE9) {
      this.on('cut', function () {
        _.nextTick(self.listener)
      })
      this.on('keyup', function (e) {
        if (e.keyCode === 46 || e.keyCode === 8) {
          self.listener()
        }
      })
    }

    // set initial value if present
    if (
      el.hasAttribute('value') ||
      (el.tagName === 'TEXTAREA' && el.value.trim())
    ) {
      this._initValue = number
        ? _.toNumber(el.value)
        : el.value
    }
  },

  update: function (value) {
    this.el.value = _.toString(value)
  },

  unbind: function () {
    var el = this.el
    if (this.hasjQuery) {
      jQuery(el).off('change', this.listener)
      jQuery(el).off('input', this.listener)
    }
  }
}

},{"../../util":133}],99:[function(require,module,exports){
(function (process){
var _ = require('../util')

module.exports = {

  acceptStatement: true,
  priority: 700,

  bind: function () {
    // deal with iframes
    if (
      this.el.tagName === 'IFRAME' &&
      this.arg !== 'load'
    ) {
      var self = this
      this.iframeBind = function () {
        _.on(self.el.contentWindow, self.arg, self.handler)
      }
      this.on('load', this.iframeBind)
    }
  },

  update: function (handler) {
    if (typeof handler !== 'function') {
      process.env.NODE_ENV !== 'production' && _.warn(
        'Directive v-on="' + this.arg + ': ' +
        this.expression + '" expects a function value, ' +
        'got ' + handler
      )
      return
    }
    this.reset()
    var vm = this.vm
    this.handler = function (e) {
      e.targetVM = vm
      vm.$event = e
      var res = handler(e)
      vm.$event = null
      return res
    }
    if (this.iframeBind) {
      this.iframeBind()
    } else {
      _.on(this.el, this.arg, this.handler)
    }
  },

  reset: function () {
    var el = this.iframeBind
      ? this.el.contentWindow
      : this.el
    if (this.handler) {
      _.off(el, this.arg, this.handler)
    }
  },

  unbind: function () {
    this.reset()
  }
}

}).call(this,require('_process'))

},{"../util":133,"_process":24}],100:[function(require,module,exports){
// NOTE: the prop internal directive is compiled and linked
// during _initScope(), before the created hook is called.
// The purpose is to make the initial prop values available
// inside `created` hooks and `data` functions.

var _ = require('../util')
var Watcher = require('../watcher')
var bindingModes = require('../config')._propBindingModes

module.exports = {

  bind: function () {

    var child = this.vm
    var parent = child._context
    // passed in from compiler directly
    var prop = this._descriptor
    var childKey = prop.path
    var parentKey = prop.parentPath

    this.parentWatcher = new Watcher(
      parent,
      parentKey,
      function (val) {
        if (_.assertProp(prop, val)) {
          child[childKey] = val
        }
      }, { sync: true }
    )

    // set the child initial value.
    var value = this.parentWatcher.value
    if (childKey === '$data') {
      child._data = value
    } else {
      _.initProp(child, prop, value)
    }

    // setup two-way binding
    if (prop.mode === bindingModes.TWO_WAY) {
      // important: defer the child watcher creation until
      // the created hook (after data observation)
      var self = this
      child.$once('hook:created', function () {
        self.childWatcher = new Watcher(
          child,
          childKey,
          function (val) {
            parent.$set(parentKey, val)
          }, { sync: true }
        )
      })
    }
  },

  unbind: function () {
    this.parentWatcher.teardown()
    if (this.childWatcher) {
      this.childWatcher.teardown()
    }
  }
}

},{"../config":84,"../util":133,"../watcher":137}],101:[function(require,module,exports){
(function (process){
var _ = require('../util')

module.exports = {

  isLiteral: true,

  bind: function () {
    var vm = this.el.__vue__
    if (!vm) {
      process.env.NODE_ENV !== 'production' && _.warn(
        'v-ref should only be used on a component root element.'
      )
      return
    }
    // If we get here, it means this is a `v-ref` on a
    // child, because parent scope `v-ref` is stripped in
    // `v-component` already. So we just record our own ref
    // here - it will overwrite parent ref in `v-component`,
    // if any.
    vm._refID = this.expression
  }
}

}).call(this,require('_process'))

},{"../util":133,"_process":24}],102:[function(require,module,exports){
(function (process){
var _ = require('../util')
var config = require('../config')
var isObject = _.isObject
var isPlainObject = _.isPlainObject
var textParser = require('../parsers/text')
var expParser = require('../parsers/expression')
var templateParser = require('../parsers/template')
var compiler = require('../compiler')
var uid = 0

// async component resolution states
var UNRESOLVED = 0
var PENDING = 1
var RESOLVED = 2
var ABORTED = 3

module.exports = {

  /**
   * Setup.
   */

  bind: function () {

    // some helpful tips...
    /* istanbul ignore if */
    if (
      process.env.NODE_ENV !== 'production' &&
      this.el.tagName === 'OPTION' &&
      this.el.parentNode && this.el.parentNode.__v_model
    ) {
      _.warn(
        'Don\'t use v-repeat for v-model options; ' +
        'use the `options` param instead: ' +
        'http://vuejs.org/guide/forms.html#Dynamic_Select_Options'
      )
    }

    // support for item in array syntax
    var inMatch = this.expression.match(/(.*) in (.*)/)
    if (inMatch) {
      this.arg = inMatch[1]
      this._watcherExp = inMatch[2]
    }
    // uid as a cache identifier
    this.id = '__v_repeat_' + (++uid)

    // setup anchor nodes
    this.start = _.createAnchor('v-repeat-start')
    this.end = _.createAnchor('v-repeat-end')
    _.replace(this.el, this.end)
    _.before(this.start, this.end)

    // check if this is a block repeat
    this.template = _.isTemplate(this.el)
      ? templateParser.parse(this.el, true)
      : this.el

    // check for trackby param
    this.idKey = this._checkParam('track-by')
    // check for transition stagger
    var stagger = +this._checkParam('stagger')
    this.enterStagger = +this._checkParam('enter-stagger') || stagger
    this.leaveStagger = +this._checkParam('leave-stagger') || stagger

    // check for v-ref/v-el
    this.refID = this._checkParam(config.prefix + 'ref')
    this.elID = this._checkParam(config.prefix + 'el')

    // check other directives that need to be handled
    // at v-repeat level
    this.checkIf()
    this.checkComponent()

    // create cache object
    this.cache = Object.create(null)
  },

  /**
   * Warn against v-if usage.
   */

  checkIf: function () {
    if (_.attr(this.el, 'if') !== null) {
      process.env.NODE_ENV !== 'production' && _.warn(
        'Don\'t use v-if with v-repeat. ' +
        'Use v-show or the "filterBy" filter instead.'
      )
    }
  },

  /**
   * Check the component constructor to use for repeated
   * instances. If static we resolve it now, otherwise it
   * needs to be resolved at build time with actual data.
   */

  checkComponent: function () {
    this.componentState = UNRESOLVED
    var options = this.vm.$options
    var id = _.checkComponent(this.el, options)
    if (!id) {
      // default constructor
      this.Component = _.Vue
      // inline repeats should inherit
      this.inline = true
      // important: transclude with no options, just
      // to ensure block start and block end
      this.template = compiler.transclude(this.template)
      var copy = _.extend({}, options)
      copy._asComponent = false
      this._linkFn = compiler.compile(this.template, copy)
    } else {
      this.Component = null
      this.asComponent = true
      // check inline-template
      if (this._checkParam('inline-template') !== null) {
        // extract inline template as a DocumentFragment
        this.inlineTemplate = _.extractContent(this.el, true)
      }
      var tokens = textParser.parse(id)
      if (tokens) {
        // dynamic component to be resolved later
        var componentExp = textParser.tokensToExp(tokens)
        this.componentGetter = expParser.parse(componentExp).get
      } else {
        // static
        this.componentId = id
        this.pendingData = null
      }
    }
  },

  resolveComponent: function () {
    this.componentState = PENDING
    this.vm._resolveComponent(this.componentId, _.bind(function (Component) {
      if (this.componentState === ABORTED) {
        return
      }
      this.Component = Component
      this.componentState = RESOLVED
      this.realUpdate(this.pendingData)
      this.pendingData = null
    }, this))
  },

  /**
   * Resolve a dynamic component to use for an instance.
   * The tricky part here is that there could be dynamic
   * components depending on instance data.
   *
   * @param {Object} data
   * @param {Object} meta
   * @return {Function}
   */

  resolveDynamicComponent: function (data, meta) {
    // create a temporary context object and copy data
    // and meta properties onto it.
    // use _.define to avoid accidentally overwriting scope
    // properties.
    var context = Object.create(this.vm)
    var key
    for (key in data) {
      _.define(context, key, data[key])
    }
    for (key in meta) {
      _.define(context, key, meta[key])
    }
    var id = this.componentGetter.call(context, context)
    var Component = _.resolveAsset(this.vm.$options, 'components', id)
    if (process.env.NODE_ENV !== 'production') {
      _.assertAsset(Component, 'component', id)
    }
    if (!Component.options) {
      process.env.NODE_ENV !== 'production' && _.warn(
        'Async resolution is not supported for v-repeat ' +
        '+ dynamic component. (component: ' + id + ')'
      )
      return _.Vue
    }
    return Component
  },

  /**
   * Update.
   * This is called whenever the Array mutates. If we have
   * a component, we might need to wait for it to resolve
   * asynchronously.
   *
   * @param {Array|Number|String} data
   */

  update: function (data) {
    if (process.env.NODE_ENV !== 'production' && !_.isArray(data)) {
      _.warn(
        'v-repeat pre-converts Objects into Arrays, and ' +
        'v-repeat filters should always return Arrays.'
      )
    }
    if (this.componentId) {
      var state = this.componentState
      if (state === UNRESOLVED) {
        this.pendingData = data
        // once resolved, it will call realUpdate
        this.resolveComponent()
      } else if (state === PENDING) {
        this.pendingData = data
      } else if (state === RESOLVED) {
        this.realUpdate(data)
      }
    } else {
      this.realUpdate(data)
    }
  },

  /**
   * The real update that actually modifies the DOM.
   *
   * @param {Array|Number|String} data
   */

  realUpdate: function (data) {
    this.vms = this.diff(data, this.vms)
    // update v-ref
    if (this.refID) {
      this.vm.$[this.refID] = this.converted
        ? toRefObject(this.vms)
        : this.vms
    }
    if (this.elID) {
      this.vm.$$[this.elID] = this.vms.map(function (vm) {
        return vm.$el
      })
    }
  },

  /**
   * Diff, based on new data and old data, determine the
   * minimum amount of DOM manipulations needed to make the
   * DOM reflect the new data Array.
   *
   * The algorithm diffs the new data Array by storing a
   * hidden reference to an owner vm instance on previously
   * seen data. This allows us to achieve O(n) which is
   * better than a levenshtein distance based algorithm,
   * which is O(m * n).
   *
   * @param {Array} data
   * @param {Array} oldVms
   * @return {Array}
   */

  diff: function (data, oldVms) {
    var idKey = this.idKey
    var converted = this.converted
    var start = this.start
    var end = this.end
    var inDoc = _.inDoc(start)
    var alias = this.arg
    var init = !oldVms
    var vms = new Array(data.length)
    var obj, raw, vm, i, l, primitive
    // First pass, go through the new Array and fill up
    // the new vms array. If a piece of data has a cached
    // instance for it, we reuse it. Otherwise build a new
    // instance.
    for (i = 0, l = data.length; i < l; i++) {
      obj = data[i]
      raw = converted ? obj.$value : obj
      primitive = !isObject(raw)
      vm = !init && this.getVm(raw, i, converted ? obj.$key : null)
      if (vm) { // reusable instance

        if (process.env.NODE_ENV !== 'production' && vm._reused) {
          _.warn(
            'Duplicate objects found in v-repeat="' + this.expression + '": ' +
            JSON.stringify(raw)
          )
        }

        vm._reused = true
        vm.$index = i // update $index
        // update data for track-by or object repeat,
        // since in these two cases the data is replaced
        // rather than mutated.
        if (idKey || converted || primitive) {
          if (alias) {
            vm[alias] = raw
          } else if (_.isPlainObject(raw)) {
            vm.$data = raw
          } else {
            vm.$value = raw
          }
        }
      } else { // new instance
        vm = this.build(obj, i, true)
        vm._reused = false
      }
      vms[i] = vm
      // insert if this is first run
      if (init) {
        vm.$before(end)
      }
    }
    // if this is the first run, we're done.
    if (init) {
      return vms
    }
    // Second pass, go through the old vm instances and
    // destroy those who are not reused (and remove them
    // from cache)
    var removalIndex = 0
    var totalRemoved = oldVms.length - vms.length
    for (i = 0, l = oldVms.length; i < l; i++) {
      vm = oldVms[i]
      if (!vm._reused) {
        this.uncacheVm(vm)
        vm.$destroy(false, true) // defer cleanup until removal
        this.remove(vm, removalIndex++, totalRemoved, inDoc)
      }
    }
    // final pass, move/insert new instances into the
    // right place.
    var targetPrev, prevEl, currentPrev
    var insertionIndex = 0
    for (i = 0, l = vms.length; i < l; i++) {
      vm = vms[i]
      // this is the vm that we should be after
      targetPrev = vms[i - 1]
      prevEl = targetPrev
        ? targetPrev._staggerCb
          ? targetPrev._staggerAnchor
          : targetPrev._fragmentEnd || targetPrev.$el
        : start
      if (vm._reused && !vm._staggerCb) {
        currentPrev = findPrevVm(vm, start, this.id)
        if (currentPrev !== targetPrev) {
          this.move(vm, prevEl)
        }
      } else {
        // new instance, or still in stagger.
        // insert with updated stagger index.
        this.insert(vm, insertionIndex++, prevEl, inDoc)
      }
      vm._reused = false
    }
    return vms
  },

  /**
   * Build a new instance and cache it.
   *
   * @param {Object} data
   * @param {Number} index
   * @param {Boolean} needCache
   */

  build: function (data, index, needCache) {
    var meta = { $index: index }
    if (this.converted) {
      meta.$key = data.$key
    }
    var raw = this.converted ? data.$value : data
    var alias = this.arg
    if (alias) {
      data = {}
      data[alias] = raw
    } else if (!isPlainObject(raw)) {
      // non-object values
      data = {}
      meta.$value = raw
    } else {
      // default
      data = raw
    }
    // resolve constructor
    var Component = this.Component || this.resolveDynamicComponent(data, meta)
    var parent = this._host || this.vm
    var vm = parent.$addChild({
      el: templateParser.clone(this.template),
      data: data,
      inherit: this.inline,
      template: this.inlineTemplate,
      // repeater meta, e.g. $index, $key
      _meta: meta,
      // mark this as an inline-repeat instance
      _repeat: this.inline,
      // is this a component?
      _asComponent: this.asComponent,
      // linker cachable if no inline-template
      _linkerCachable: !this.inlineTemplate && Component !== _.Vue,
      // pre-compiled linker for simple repeats
      _linkFn: this._linkFn,
      // identifier, shows that this vm belongs to this collection
      _repeatId: this.id,
      // transclusion content owner
      _context: this.vm
    }, Component)
    // cache instance
    if (needCache) {
      this.cacheVm(raw, vm, index, this.converted ? meta.$key : null)
    }
    // sync back changes for two-way bindings of primitive values
    var dir = this
    if (this.rawType === 'object' && isPrimitive(raw)) {
      vm.$watch(alias || '$value', function (val) {
        if (dir.filters) {
          process.env.NODE_ENV !== 'production' && _.warn(
            'You seem to be mutating the $value reference of ' +
            'a v-repeat instance (likely through v-model) ' +
            'and filtering the v-repeat at the same time. ' +
            'This will not work properly with an Array of ' +
            'primitive values. Please use an Array of ' +
            'Objects instead.'
          )
        }
        dir._withLock(function () {
          if (dir.converted) {
            dir.rawValue[vm.$key] = val
          } else {
            dir.rawValue.$set(vm.$index, val)
          }
        })
      })
    }
    return vm
  },

  /**
   * Unbind, teardown everything
   */

  unbind: function () {
    this.componentState = ABORTED
    if (this.refID) {
      this.vm.$[this.refID] = null
    }
    if (this.vms) {
      var i = this.vms.length
      var vm
      while (i--) {
        vm = this.vms[i]
        this.uncacheVm(vm)
        vm.$destroy()
      }
    }
  },

  /**
   * Cache a vm instance based on its data.
   *
   * If the data is an object, we save the vm's reference on
   * the data object as a hidden property. Otherwise we
   * cache them in an object and for each primitive value
   * there is an array in case there are duplicates.
   *
   * @param {Object} data
   * @param {Vue} vm
   * @param {Number} index
   * @param {String} [key]
   */

  cacheVm: function (data, vm, index, key) {
    var idKey = this.idKey
    var cache = this.cache
    var primitive = !isObject(data)
    var id
    if (key || idKey || primitive) {
      id = idKey
        ? idKey === '$index'
          ? index
          : data[idKey]
        : (key || index)
      if (!cache[id]) {
        cache[id] = vm
      } else if (!primitive && idKey !== '$index') {
        process.env.NODE_ENV !== 'production' && _.warn(
          'Duplicate objects with the same track-by key in v-repeat: ' + id
        )
      }
    } else {
      id = this.id
      if (data.hasOwnProperty(id)) {
        if (data[id] === null) {
          data[id] = vm
        } else {
          process.env.NODE_ENV !== 'production' && _.warn(
            'Duplicate objects found in v-repeat="' + this.expression + '": ' +
            JSON.stringify(data)
          )
        }
      } else {
        _.define(data, id, vm)
      }
    }
    vm._raw = data
  },

  /**
   * Try to get a cached instance from a piece of data.
   *
   * @param {Object} data
   * @param {Number} index
   * @param {String} [key]
   * @return {Vue|undefined}
   */

  getVm: function (data, index, key) {
    var idKey = this.idKey
    var primitive = !isObject(data)
    if (key || idKey || primitive) {
      var id = idKey
        ? idKey === '$index'
          ? index
          : data[idKey]
        : (key || index)
      return this.cache[id]
    } else {
      return data[this.id]
    }
  },

  /**
   * Delete a cached vm instance.
   *
   * @param {Vue} vm
   */

  uncacheVm: function (vm) {
    var data = vm._raw
    var idKey = this.idKey
    var index = vm.$index
    // fix #948: avoid accidentally fall through to
    // a parent repeater which happens to have $key.
    var key = vm.hasOwnProperty('$key') && vm.$key
    var primitive = !isObject(data)
    if (idKey || key || primitive) {
      var id = idKey
        ? idKey === '$index'
          ? index
          : data[idKey]
        : (key || index)
      this.cache[id] = null
    } else {
      data[this.id] = null
      vm._raw = null
    }
  },

  /**
   * Insert an instance.
   *
   * @param {Vue} vm
   * @param {Number} index
   * @param {Node} prevEl
   * @param {Boolean} inDoc
   */

  insert: function (vm, index, prevEl, inDoc) {
    if (vm._staggerCb) {
      vm._staggerCb.cancel()
      vm._staggerCb = null
    }
    var staggerAmount = this.getStagger(vm, index, null, 'enter')
    if (inDoc && staggerAmount) {
      // create an anchor and insert it synchronously,
      // so that we can resolve the correct order without
      // worrying about some elements not inserted yet
      var anchor = vm._staggerAnchor
      if (!anchor) {
        anchor = vm._staggerAnchor = _.createAnchor('stagger-anchor')
        anchor.__vue__ = vm
      }
      _.after(anchor, prevEl)
      var op = vm._staggerCb = _.cancellable(function () {
        vm._staggerCb = null
        vm.$before(anchor)
        _.remove(anchor)
      })
      setTimeout(op, staggerAmount)
    } else {
      vm.$after(prevEl)
    }
  },

  /**
   * Move an already inserted instance.
   *
   * @param {Vue} vm
   * @param {Node} prevEl
   */

  move: function (vm, prevEl) {
    vm.$after(prevEl, null, false)
  },

  /**
   * Remove an instance.
   *
   * @param {Vue} vm
   * @param {Number} index
   * @param {Boolean} inDoc
   */

  remove: function (vm, index, total, inDoc) {
    if (vm._staggerCb) {
      vm._staggerCb.cancel()
      vm._staggerCb = null
      // it's not possible for the same vm to be removed
      // twice, so if we have a pending stagger callback,
      // it means this vm is queued for enter but removed
      // before its transition started. Since it is already
      // destroyed, we can just leave it in detached state.
      return
    }
    var staggerAmount = this.getStagger(vm, index, total, 'leave')
    if (inDoc && staggerAmount) {
      var op = vm._staggerCb = _.cancellable(function () {
        vm._staggerCb = null
        remove()
      })
      setTimeout(op, staggerAmount)
    } else {
      remove()
    }
    function remove () {
      vm.$remove(function () {
        vm._cleanup()
      })
    }
  },

  /**
   * Get the stagger amount for an insertion/removal.
   *
   * @param {Vue} vm
   * @param {Number} index
   * @param {String} type
   * @param {Number} total
   */

  getStagger: function (vm, index, total, type) {
    type = type + 'Stagger'
    var transition = vm.$el.__v_trans
    var hooks = transition && transition.hooks
    var hook = hooks && (hooks[type] || hooks.stagger)
    return hook
      ? hook.call(vm, index, total)
      : index * this[type]
  },

  /**
   * Pre-process the value before piping it through the
   * filters, and convert non-Array objects to arrays.
   *
   * This function will be bound to this directive instance
   * and passed into the watcher.
   *
   * @param {*} value
   * @return {Array}
   * @private
   */

  _preProcess: function (value) {
    // regardless of type, store the un-filtered raw value.
    this.rawValue = value
    var type = this.rawType = typeof value
    if (!isPlainObject(value)) {
      this.converted = false
      if (type === 'number') {
        value = range(value)
      } else if (type === 'string') {
        value = _.toArray(value)
      }
      return value || []
    } else {
      // convert plain object to array.
      var keys = Object.keys(value)
      var i = keys.length
      var res = new Array(i)
      var key
      while (i--) {
        key = keys[i]
        res[i] = {
          $key: key,
          $value: value[key]
        }
      }
      this.converted = true
      return res
    }
  }
}

/**
 * Helper to find the previous element that is an instance
 * root node. This is necessary because a destroyed vm's
 * element could still be lingering in the DOM before its
 * leaving transition finishes, but its __vue__ reference
 * should have been removed so we can skip them.
 *
 * If this is a block repeat, we want to make sure we only
 * return vm that is bound to this v-repeat. (see #929)
 *
 * @param {Vue} vm
 * @param {Comment|Text} anchor
 * @return {Vue}
 */

function findPrevVm (vm, anchor, id) {
  var el = vm.$el.previousSibling
  /* istanbul ignore if */
  if (!el) return
  while (
    (!el.__vue__ || el.__vue__.$options._repeatId !== id) &&
    el !== anchor
  ) {
    el = el.previousSibling
  }
  return el.__vue__
}

/**
 * Create a range array from given number.
 *
 * @param {Number} n
 * @return {Array}
 */

function range (n) {
  var i = -1
  var ret = new Array(n)
  while (++i < n) {
    ret[i] = i
  }
  return ret
}

/**
 * Convert a vms array to an object ref for v-ref on an
 * Object value.
 *
 * @param {Array} vms
 * @return {Object}
 */

function toRefObject (vms) {
  var ref = {}
  for (var i = 0, l = vms.length; i < l; i++) {
    ref[vms[i].$key] = vms[i]
  }
  return ref
}

/**
 * Check if a value is a primitive one:
 * String, Number, Boolean, null or undefined.
 *
 * @param {*} value
 * @return {Boolean}
 */

function isPrimitive (value) {
  var type = typeof value
  return value == null ||
    type === 'string' ||
    type === 'number' ||
    type === 'boolean'
}

}).call(this,require('_process'))

},{"../compiler":82,"../config":84,"../parsers/expression":122,"../parsers/template":124,"../parsers/text":125,"../util":133,"_process":24}],103:[function(require,module,exports){
var transition = require('../transition')

module.exports = function (value) {
  var el = this.el
  transition.apply(el, value ? 1 : -1, function () {
    el.style.display = value ? '' : 'none'
  }, this.vm)
}

},{"../transition":126}],104:[function(require,module,exports){
var _ = require('../util')
var prefixes = ['-webkit-', '-moz-', '-ms-']
var camelPrefixes = ['Webkit', 'Moz', 'ms']
var importantRE = /!important;?$/
var camelRE = /([a-z])([A-Z])/g
var testEl = null
var propCache = {}

module.exports = {

  deep: true,

  update: function (value) {
    if (this.arg) {
      this.setProp(this.arg, value)
    } else {
      if (typeof value === 'object') {
        this.objectHandler(value)
      } else {
        this.el.style.cssText = value
      }
    }
  },

  objectHandler: function (value) {
    // cache object styles so that only changed props
    // are actually updated.
    var cache = this.cache || (this.cache = {})
    var prop, val
    for (prop in cache) {
      if (!(prop in value)) {
        this.setProp(prop, null)
        delete cache[prop]
      }
    }
    for (prop in value) {
      val = value[prop]
      if (val !== cache[prop]) {
        cache[prop] = val
        this.setProp(prop, val)
      }
    }
  },

  setProp: function (prop, value) {
    prop = normalize(prop)
    if (!prop) return // unsupported prop
    // cast possible numbers/booleans into strings
    if (value != null) value += ''
    if (value) {
      var isImportant = importantRE.test(value)
        ? 'important'
        : ''
      if (isImportant) {
        value = value.replace(importantRE, '').trim()
      }
      this.el.style.setProperty(prop, value, isImportant)
    } else {
      this.el.style.removeProperty(prop)
    }
  }

}

/**
 * Normalize a CSS property name.
 * - cache result
 * - auto prefix
 * - camelCase -> dash-case
 *
 * @param {String} prop
 * @return {String}
 */

function normalize (prop) {
  if (propCache[prop]) {
    return propCache[prop]
  }
  var res = prefix(prop)
  propCache[prop] = propCache[res] = res
  return res
}

/**
 * Auto detect the appropriate prefix for a CSS property.
 * https://gist.github.com/paulirish/523692
 *
 * @param {String} prop
 * @return {String}
 */

function prefix (prop) {
  prop = prop.replace(camelRE, '$1-$2').toLowerCase()
  var camel = _.camelize(prop)
  var upper = camel.charAt(0).toUpperCase() + camel.slice(1)
  if (!testEl) {
    testEl = document.createElement('div')
  }
  if (camel in testEl.style) {
    return prop
  }
  var i = prefixes.length
  var prefixed
  while (i--) {
    prefixed = camelPrefixes[i] + upper
    if (prefixed in testEl.style) {
      return prefixes[i] + prop
    }
  }
}

},{"../util":133}],105:[function(require,module,exports){
var _ = require('../util')

module.exports = {

  bind: function () {
    this.attr = this.el.nodeType === 3
      ? 'data'
      : 'textContent'
  },

  update: function (value) {
    this.el[this.attr] = _.toString(value)
  }
}

},{"../util":133}],106:[function(require,module,exports){
var _ = require('../util')
var Transition = require('../transition/transition')

module.exports = {

  priority: 1000,
  isLiteral: true,

  bind: function () {
    if (!this._isDynamicLiteral) {
      this.update(this.expression)
    }
  },

  update: function (id, oldId) {
    var el = this.el
    var vm = this.el.__vue__ || this.vm
    var hooks = _.resolveAsset(vm.$options, 'transitions', id)
    id = id || 'v'
    el.__v_trans = new Transition(el, id, hooks, vm)
    if (oldId) {
      _.removeClass(el, oldId + '-transition')
    }
    _.addClass(el, id + '-transition')
  }
}

},{"../transition/transition":128,"../util":133}],107:[function(require,module,exports){
var _ = require('../util')
var clone = require('../parsers/template').clone

// This is the elementDirective that handles <content>
// transclusions. It relies on the raw content of an
// instance being stored as `$options._content` during
// the transclude phase.

module.exports = {

  bind: function () {
    var vm = this.vm
    var host = vm
    // we need find the content context, which is the
    // closest non-inline-repeater instance.
    while (host.$options._repeat) {
      host = host.$parent
    }
    var raw = host.$options._content
    var content
    if (!raw) {
      this.fallback()
      return
    }
    var context = host._context
    var selector = this._checkParam('select')
    if (!selector) {
      // Default content
      var self = this
      var compileDefaultContent = function () {
        self.compile(
          extractFragment(raw.childNodes, raw, true),
          context,
          vm
        )
      }
      if (!host._isCompiled) {
        // defer until the end of instance compilation,
        // because the default outlet must wait until all
        // other possible outlets with selectors have picked
        // out their contents.
        host.$once('hook:compiled', compileDefaultContent)
      } else {
        compileDefaultContent()
      }
    } else {
      // select content
      var nodes = raw.querySelectorAll(selector)
      if (nodes.length) {
        content = extractFragment(nodes, raw)
        if (content.hasChildNodes()) {
          this.compile(content, context, vm)
        } else {
          this.fallback()
        }
      } else {
        this.fallback()
      }
    }
  },

  fallback: function () {
    this.compile(_.extractContent(this.el, true), this.vm)
  },

  compile: function (content, context, host) {
    if (content && context) {
      this.unlink = context.$compile(content, host)
    }
    if (content) {
      _.replace(this.el, content)
    } else {
      _.remove(this.el)
    }
  },

  unbind: function () {
    if (this.unlink) {
      this.unlink()
    }
  }
}

/**
 * Extract qualified content nodes from a node list.
 *
 * @param {NodeList} nodes
 * @param {Element} parent
 * @param {Boolean} main
 * @return {DocumentFragment}
 */

function extractFragment (nodes, parent, main) {
  var frag = document.createDocumentFragment()
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i]
    // if this is the main outlet, we want to skip all
    // previously selected nodes;
    // otherwise, we want to mark the node as selected.
    // clone the node so the original raw content remains
    // intact. this ensures proper re-compilation in cases
    // where the outlet is inside a conditional block
    if (main && !node.__v_selected) {
      frag.appendChild(clone(node))
    } else if (!main && node.parentNode === parent) {
      node.__v_selected = true
      frag.appendChild(clone(node))
    }
  }
  return frag
}

},{"../parsers/template":124,"../util":133}],108:[function(require,module,exports){
exports.content = require('./content')
exports.partial = require('./partial')

},{"./content":107,"./partial":109}],109:[function(require,module,exports){
(function (process){
var _ = require('../util')
var templateParser = require('../parsers/template')
var textParser = require('../parsers/text')
var compiler = require('../compiler')
var Cache = require('../cache')
var cache = new Cache(1000)

// v-partial reuses logic from v-if
var vIf = require('../directives/if')

module.exports = {

  link: vIf.link,
  teardown: vIf.teardown,
  getContainedComponents: vIf.getContainedComponents,

  bind: function () {
    var el = this.el
    this.start = _.createAnchor('v-partial-start')
    this.end = _.createAnchor('v-partial-end')
    _.replace(el, this.end)
    _.before(this.start, this.end)
    var id = el.getAttribute('name')
    var tokens = textParser.parse(id)
    if (tokens) {
      // dynamic partial
      this.setupDynamic(tokens)
    } else {
      // static partial
      this.insert(id)
    }
  },

  setupDynamic: function (tokens) {
    var self = this
    var exp = textParser.tokensToExp(tokens)
    this.unwatch = this.vm.$watch(exp, function (value) {
      self.teardown()
      self.insert(value)
    }, {
      immediate: true,
      user: false
    })
  },

  insert: function (id) {
    var partial = _.resolveAsset(this.vm.$options, 'partials', id)
    if (process.env.NODE_ENV !== 'production') {
      _.assertAsset(partial, 'partial', id)
    }
    if (partial) {
      var frag = templateParser.parse(partial, true)
      // cache partials based on constructor id.
      var cacheId = (this.vm.constructor.cid || '') + partial
      var linker = this.compile(frag, cacheId)
      // this is provided by v-if
      this.link(frag, linker)
    }
  },

  compile: function (frag, cacheId) {
    var hit = cache.get(cacheId)
    if (hit) return hit
    var linker = compiler.compile(frag, this.vm.$options, true)
    cache.put(cacheId, linker)
    return linker
  },

  unbind: function () {
    if (this.unlink) this.unlink()
    if (this.unwatch) this.unwatch()
  }
}

}).call(this,require('_process'))

},{"../cache":79,"../compiler":82,"../directives/if":92,"../parsers/template":124,"../parsers/text":125,"../util":133,"_process":24}],110:[function(require,module,exports){
var _ = require('../util')
var Path = require('../parsers/path')

/**
 * Filter filter for v-repeat
 *
 * @param {String} searchKey
 * @param {String} [delimiter]
 * @param {String} dataKey
 */

exports.filterBy = function (arr, search, delimiter /* ...dataKeys */) {
  if (search == null) {
    return arr
  }
  if (typeof search === 'function') {
    return arr.filter(search)
  }
  // cast to lowercase string
  search = ('' + search).toLowerCase()
  // allow optional `in` delimiter
  // because why not
  var n = delimiter === 'in' ? 3 : 2
  // extract and flatten keys
  var keys = _.toArray(arguments, n).reduce(function (prev, cur) {
    return prev.concat(cur)
  }, [])
  return arr.filter(function (item) {
    if (keys.length) {
      return keys.some(function (key) {
        return contains(Path.get(item, key), search)
      })
    } else {
      return contains(item, search)
    }
  })
}

/**
 * Filter filter for v-repeat
 *
 * @param {String} sortKey
 * @param {String} reverse
 */

exports.orderBy = function (arr, sortKey, reverse) {
  if (!sortKey) {
    return arr
  }
  var order = 1
  if (arguments.length > 2) {
    if (reverse === '-1') {
      order = -1
    } else {
      order = reverse ? -1 : 1
    }
  }
  // sort on a copy to avoid mutating original array
  return arr.slice().sort(function (a, b) {
    if (sortKey !== '$key' && sortKey !== '$value') {
      if (a && '$value' in a) a = a.$value
      if (b && '$value' in b) b = b.$value
    }
    a = _.isObject(a) ? Path.get(a, sortKey) : a
    b = _.isObject(b) ? Path.get(b, sortKey) : b
    return a === b ? 0 : a > b ? order : -order
  })
}

/**
 * String contain helper
 *
 * @param {*} val
 * @param {String} search
 */

function contains (val, search) {
  var i
  if (_.isPlainObject(val)) {
    var keys = Object.keys(val)
    i = keys.length
    while (i--) {
      if (contains(val[keys[i]], search)) {
        return true
      }
    }
  } else if (_.isArray(val)) {
    i = val.length
    while (i--) {
      if (contains(val[i], search)) {
        return true
      }
    }
  } else if (val != null) {
    return val.toString().toLowerCase().indexOf(search) > -1
  }
}

},{"../parsers/path":123,"../util":133}],111:[function(require,module,exports){
var _ = require('../util')

/**
 * Stringify value.
 *
 * @param {Number} indent
 */

exports.json = {
  read: function (value, indent) {
    return typeof value === 'string'
      ? value
      : JSON.stringify(value, null, Number(indent) || 2)
  },
  write: function (value) {
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  }
}

/**
 * 'abc' => 'Abc'
 */

exports.capitalize = function (value) {
  if (!value && value !== 0) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 * 'abc' => 'ABC'
 */

exports.uppercase = function (value) {
  return (value || value === 0)
    ? value.toString().toUpperCase()
    : ''
}

/**
 * 'AbC' => 'abc'
 */

exports.lowercase = function (value) {
  return (value || value === 0)
    ? value.toString().toLowerCase()
    : ''
}

/**
 * 12345 => $12,345.00
 *
 * @param {String} sign
 */

var digitsRE = /(\d{3})(?=\d)/g
exports.currency = function (value, currency) {
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  currency = currency != null ? currency : '$'
  var stringified = Math.abs(value).toFixed(2)
  var _int = stringified.slice(0, -3)
  var i = _int.length % 3
  var head = i > 0
    ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
    : ''
  var _float = stringified.slice(-3)
  var sign = value < 0 ? '-' : ''
  return currency + sign + head +
    _int.slice(i).replace(digitsRE, '$1,') +
    _float
}

/**
 * 'item' => 'items'
 *
 * @params
 *  an array of strings corresponding to
 *  the single, double, triple ... forms of the word to
 *  be pluralized. When the number to be pluralized
 *  exceeds the length of the args, it will use the last
 *  entry in the array.
 *
 *  e.g. ['single', 'double', 'triple', 'multiple']
 */

exports.pluralize = function (value) {
  var args = _.toArray(arguments, 1)
  return args.length > 1
    ? (args[value % 10 - 1] || args[args.length - 1])
    : (args[0] + (value === 1 ? '' : 's'))
}

/**
 * A special filter that takes a handler function,
 * wraps it so it only gets triggered on specific
 * keypresses. v-on only.
 *
 * @param {String} key
 */

var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  'delete': 46,
  up: 38,
  left: 37,
  right: 39,
  down: 40
}

exports.key = function (handler, key) {
  if (!handler) return
  var code = keyCodes[key]
  if (!code) {
    code = parseInt(key, 10)
  }
  return function (e) {
    if (e.keyCode === code) {
      return handler.call(this, e)
    }
  }
}

// expose keycode hash
exports.key.keyCodes = keyCodes

exports.debounce = function (handler, delay) {
  if (!handler) return
  if (!delay) {
    delay = 300
  }
  return _.debounce(handler, delay)
}

/**
 * Install special array filters
 */

_.extend(exports, require('./array-filters'))

},{"../util":133,"./array-filters":110}],112:[function(require,module,exports){
var _ = require('../util')
var Directive = require('../directive')
var compiler = require('../compiler')

/**
 * Transclude, compile and link element.
 *
 * If a pre-compiled linker is available, that means the
 * passed in element will be pre-transcluded and compiled
 * as well - all we need to do is to call the linker.
 *
 * Otherwise we need to call transclude/compile/link here.
 *
 * @param {Element} el
 * @return {Element}
 */

exports._compile = function (el) {
  var options = this.$options
  var host = this._host
  if (options._linkFn) {
    // pre-transcluded with linker, just use it
    this._initElement(el)
    this._unlinkFn = options._linkFn(this, el, host)
  } else {
    // transclude and init element
    // transclude can potentially replace original
    // so we need to keep reference; this step also injects
    // the template and caches the original attributes
    // on the container node and replacer node.
    var original = el
    el = compiler.transclude(el, options)
    this._initElement(el)

    // root is always compiled per-instance, because
    // container attrs and props can be different every time.
    var rootLinker = compiler.compileRoot(el, options)

    // compile and link the rest
    var contentLinkFn
    var ctor = this.constructor
    // component compilation can be cached
    // as long as it's not using inline-template
    if (options._linkerCachable) {
      contentLinkFn = ctor.linker
      if (!contentLinkFn) {
        contentLinkFn = ctor.linker = compiler.compile(el, options)
      }
    }

    // link phase
    var rootUnlinkFn = rootLinker(this, el)
    var contentUnlinkFn = contentLinkFn
      ? contentLinkFn(this, el)
      : compiler.compile(el, options)(this, el, host)

    // register composite unlink function
    // to be called during instance destruction
    this._unlinkFn = function () {
      rootUnlinkFn()
      // passing destroying: true to avoid searching and
      // splicing the directives
      contentUnlinkFn(true)
    }

    // finally replace original
    if (options.replace) {
      _.replace(original, el)
    }
  }
  return el
}

/**
 * Initialize instance element. Called in the public
 * $mount() method.
 *
 * @param {Element} el
 */

exports._initElement = function (el) {
  if (el instanceof DocumentFragment) {
    this._isFragment = true
    this.$el = this._fragmentStart = el.firstChild
    this._fragmentEnd = el.lastChild
    // set persisted text anchors to empty
    if (this._fragmentStart.nodeType === 3) {
      this._fragmentStart.data = this._fragmentEnd.data = ''
    }
    this._blockFragment = el
  } else {
    this.$el = el
  }
  this.$el.__vue__ = this
  this._callHook('beforeCompile')
}

/**
 * Create and bind a directive to an element.
 *
 * @param {String} name - directive name
 * @param {Node} node   - target node
 * @param {Object} desc - parsed directive descriptor
 * @param {Object} def  - directive definition object
 * @param {Vue|undefined} host - transclusion host component
 */

exports._bindDir = function (name, node, desc, def, host) {
  this._directives.push(
    new Directive(name, node, this, desc, def, host)
  )
}

/**
 * Teardown an instance, unobserves the data, unbind all the
 * directives, turn off all the event listeners, etc.
 *
 * @param {Boolean} remove - whether to remove the DOM node.
 * @param {Boolean} deferCleanup - if true, defer cleanup to
 *                                 be called later
 */

exports._destroy = function (remove, deferCleanup) {
  if (this._isBeingDestroyed) {
    return
  }
  this._callHook('beforeDestroy')
  this._isBeingDestroyed = true
  var i
  // remove self from parent. only necessary
  // if parent is not being destroyed as well.
  var parent = this.$parent
  if (parent && !parent._isBeingDestroyed) {
    parent.$children.$remove(this)
  }
  // destroy all children.
  i = this.$children.length
  while (i--) {
    this.$children[i].$destroy()
  }
  // teardown props
  if (this._propsUnlinkFn) {
    this._propsUnlinkFn()
  }
  // teardown all directives. this also tearsdown all
  // directive-owned watchers.
  if (this._unlinkFn) {
    this._unlinkFn()
  }
  i = this._watchers.length
  while (i--) {
    this._watchers[i].teardown()
  }
  // remove reference to self on $el
  if (this.$el) {
    this.$el.__vue__ = null
  }
  // remove DOM element
  var self = this
  if (remove && this.$el) {
    this.$remove(function () {
      self._cleanup()
    })
  } else if (!deferCleanup) {
    this._cleanup()
  }
}

/**
 * Clean up to ensure garbage collection.
 * This is called after the leave transition if there
 * is any.
 */

exports._cleanup = function () {
  // remove reference from data ob
  // frozen object may not have observer.
  if (this._data.__ob__) {
    this._data.__ob__.removeVm(this)
  }
  // Clean up references to private properties and other
  // instances. preserve reference to _data so that proxy
  // accessors still work. The only potential side effect
  // here is that mutating the instance after it's destroyed
  // may affect the state of other components that are still
  // observing the same object, but that seems to be a
  // reasonable responsibility for the user rather than
  // always throwing an error on them.
  this.$el =
  this.$parent =
  this.$root =
  this.$children =
  this._watchers =
  this._directives = null
  // call the last hook...
  this._isDestroyed = true
  this._callHook('destroyed')
  // turn off all instance listeners.
  this.$off()
}

},{"../compiler":82,"../directive":85,"../util":133}],113:[function(require,module,exports){
(function (process){
var _ = require('../util')
var inDoc = _.inDoc

/**
 * Setup the instance's option events & watchers.
 * If the value is a string, we pull it from the
 * instance's methods by name.
 */

exports._initEvents = function () {
  var options = this.$options
  registerCallbacks(this, '$on', options.events)
  registerCallbacks(this, '$watch', options.watch)
}

/**
 * Register callbacks for option events and watchers.
 *
 * @param {Vue} vm
 * @param {String} action
 * @param {Object} hash
 */

function registerCallbacks (vm, action, hash) {
  if (!hash) return
  var handlers, key, i, j
  for (key in hash) {
    handlers = hash[key]
    if (_.isArray(handlers)) {
      for (i = 0, j = handlers.length; i < j; i++) {
        register(vm, action, key, handlers[i])
      }
    } else {
      register(vm, action, key, handlers)
    }
  }
}

/**
 * Helper to register an event/watch callback.
 *
 * @param {Vue} vm
 * @param {String} action
 * @param {String} key
 * @param {Function|String|Object} handler
 * @param {Object} [options]
 */

function register (vm, action, key, handler, options) {
  var type = typeof handler
  if (type === 'function') {
    vm[action](key, handler, options)
  } else if (type === 'string') {
    var methods = vm.$options.methods
    var method = methods && methods[handler]
    if (method) {
      vm[action](key, method, options)
    } else {
      process.env.NODE_ENV !== 'production' && _.warn(
        'Unknown method: "' + handler + '" when ' +
        'registering callback for ' + action +
        ': "' + key + '".'
      )
    }
  } else if (handler && type === 'object') {
    register(vm, action, key, handler.handler, handler)
  }
}

/**
 * Setup recursive attached/detached calls
 */

exports._initDOMHooks = function () {
  this.$on('hook:attached', onAttached)
  this.$on('hook:detached', onDetached)
}

/**
 * Callback to recursively call attached hook on children
 */

function onAttached () {
  if (!this._isAttached) {
    this._isAttached = true
    this.$children.forEach(callAttach)
  }
}

/**
 * Iterator to call attached hook
 *
 * @param {Vue} child
 */

function callAttach (child) {
  if (!child._isAttached && inDoc(child.$el)) {
    child._callHook('attached')
  }
}

/**
 * Callback to recursively call detached hook on children
 */

function onDetached () {
  if (this._isAttached) {
    this._isAttached = false
    this.$children.forEach(callDetach)
  }
}

/**
 * Iterator to call detached hook
 *
 * @param {Vue} child
 */

function callDetach (child) {
  if (child._isAttached && !inDoc(child.$el)) {
    child._callHook('detached')
  }
}

/**
 * Trigger all handlers for a hook
 *
 * @param {String} hook
 */

exports._callHook = function (hook) {
  var handlers = this.$options[hook]
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      handlers[i].call(this)
    }
  }
  this.$emit('hook:' + hook)
}

}).call(this,require('_process'))

},{"../util":133,"_process":24}],114:[function(require,module,exports){
var mergeOptions = require('../util').mergeOptions

/**
 * The main init sequence. This is called for every
 * instance, including ones that are created from extended
 * constructors.
 *
 * @param {Object} options - this options object should be
 *                           the result of merging class
 *                           options and the options passed
 *                           in to the constructor.
 */

exports._init = function (options) {

  options = options || {}

  this.$el = null
  this.$parent = options._parent
  this.$root = options._root || this
  this.$children = []
  this.$ = {}           // child vm references
  this.$$ = {}          // element references
  this._watchers = []   // all watchers as an array
  this._directives = [] // all directives
  this._childCtors = {} // inherit:true constructors

  // a flag to avoid this being observed
  this._isVue = true

  // events bookkeeping
  this._events = {}            // registered callbacks
  this._eventsCount = {}       // for $broadcast optimization
  this._eventCancelled = false // for event cancellation

  // fragment instance properties
  this._isFragment = false
  this._fragmentStart =    // @type {CommentNode}
  this._fragmentEnd = null // @type {CommentNode}

  // lifecycle state
  this._isCompiled =
  this._isDestroyed =
  this._isReady =
  this._isAttached =
  this._isBeingDestroyed = false
  this._unlinkFn = null

  // context: the scope in which the component was used,
  // and the scope in which props and contents of this
  // instance should be compiled in.
  this._context =
    options._context ||
    options._parent

  // push self into parent / transclusion host
  if (this.$parent) {
    this.$parent.$children.push(this)
  }

  // props used in v-repeat diffing
  this._reused = false
  this._staggerOp = null

  // merge options.
  options = this.$options = mergeOptions(
    this.constructor.options,
    options,
    this
  )

  // initialize data as empty object.
  // it will be filled up in _initScope().
  this._data = {}

  // initialize data observation and scope inheritance.
  this._initScope()

  // setup event system and option events.
  this._initEvents()

  // call created hook
  this._callHook('created')

  // if `el` option is passed, start compilation.
  if (options.el) {
    this.$mount(options.el)
  }
}

},{"../util":133}],115:[function(require,module,exports){
(function (process){
var _ = require('../util')

/**
 * Apply a list of filter (descriptors) to a value.
 * Using plain for loops here because this will be called in
 * the getter of any watcher with filters so it is very
 * performance sensitive.
 *
 * @param {*} value
 * @param {*} [oldValue]
 * @param {Array} filters
 * @param {Boolean} write
 * @return {*}
 */

exports._applyFilters = function (value, oldValue, filters, write) {
  var filter, fn, args, arg, offset, i, l, j, k
  for (i = 0, l = filters.length; i < l; i++) {
    filter = filters[i]
    fn = _.resolveAsset(this.$options, 'filters', filter.name)
    if (process.env.NODE_ENV !== 'production') {
      _.assertAsset(fn, 'filter', filter.name)
    }
    if (!fn) continue
    fn = write ? fn.write : (fn.read || fn)
    if (typeof fn !== 'function') continue
    args = write ? [value, oldValue] : [value]
    offset = write ? 2 : 1
    if (filter.args) {
      for (j = 0, k = filter.args.length; j < k; j++) {
        arg = filter.args[j]
        args[j + offset] = arg.dynamic
          ? this.$get(arg.value)
          : arg.value
      }
    }
    value = fn.apply(this, args)
  }
  return value
}

/**
 * Resolve a component, depending on whether the component
 * is defined normally or using an async factory function.
 * Resolves synchronously if already resolved, otherwise
 * resolves asynchronously and caches the resolved
 * constructor on the factory.
 *
 * @param {String} id
 * @param {Function} cb
 */

exports._resolveComponent = function (id, cb) {
  var factory = _.resolveAsset(this.$options, 'components', id)
  if (process.env.NODE_ENV !== 'production') {
    _.assertAsset(factory, 'component', id)
  }
  if (!factory) {
    return
  }
  // async component factory
  if (!factory.options) {
    if (factory.resolved) {
      // cached
      cb(factory.resolved)
    } else if (factory.requested) {
      // pool callbacks
      factory.pendingCallbacks.push(cb)
    } else {
      factory.requested = true
      var cbs = factory.pendingCallbacks = [cb]
      factory(function resolve (res) {
        if (_.isPlainObject(res)) {
          res = _.Vue.extend(res)
        }
        // cache resolved
        factory.resolved = res
        // invoke callbacks
        for (var i = 0, l = cbs.length; i < l; i++) {
          cbs[i](res)
        }
      }, function reject (reason) {
        process.env.NODE_ENV !== 'production' && _.warn(
          'Failed to resolve async component: ' + id + '. ' +
          (reason ? '\nReason: ' + reason : '')
        )
      })
    }
  } else {
    // normal component
    cb(factory)
  }
}

}).call(this,require('_process'))

},{"../util":133,"_process":24}],116:[function(require,module,exports){
(function (process){
var _ = require('../util')
var compiler = require('../compiler')
var Observer = require('../observer')
var Dep = require('../observer/dep')
var Watcher = require('../watcher')

/**
 * Setup the scope of an instance, which contains:
 * - observed data
 * - computed properties
 * - user methods
 * - meta properties
 */

exports._initScope = function () {
  this._initProps()
  this._initMeta()
  this._initMethods()
  this._initData()
  this._initComputed()
}

/**
 * Initialize props.
 */

exports._initProps = function () {
  var options = this.$options
  var el = options.el
  var props = options.props
  if (props && !el) {
    process.env.NODE_ENV !== 'production' && _.warn(
      'Props will not be compiled if no `el` option is ' +
      'provided at instantiation.'
    )
  }
  // make sure to convert string selectors into element now
  el = options.el = _.query(el)
  this._propsUnlinkFn = el && el.nodeType === 1 && props
    ? compiler.compileAndLinkProps(
        this, el, props
      )
    : null
}

/**
 * Initialize the data.
 */

exports._initData = function () {
  var propsData = this._data
  var optionsDataFn = this.$options.data
  var optionsData = optionsDataFn && optionsDataFn()
  if (optionsData) {
    this._data = optionsData
    for (var prop in propsData) {
      if (
        this._props[prop].raw !== null ||
        !optionsData.hasOwnProperty(prop)
      ) {
        optionsData.$set(prop, propsData[prop])
      }
    }
  }
  var data = this._data
  // proxy data on instance
  var keys = Object.keys(data)
  var i, key
  i = keys.length
  while (i--) {
    key = keys[i]
    if (!_.isReserved(key)) {
      this._proxy(key)
    }
  }
  // observe data
  Observer.create(data, this)
}

/**
 * Swap the isntance's $data. Called in $data's setter.
 *
 * @param {Object} newData
 */

exports._setData = function (newData) {
  newData = newData || {}
  var oldData = this._data
  this._data = newData
  var keys, key, i
  // copy props.
  // this should only happen during a v-repeat of component
  // that also happens to have compiled props.
  var props = this.$options.props
  if (props) {
    i = props.length
    while (i--) {
      key = props[i].name
      if (key !== '$data' && !newData.hasOwnProperty(key)) {
        newData.$set(key, oldData[key])
      }
    }
  }
  // unproxy keys not present in new data
  keys = Object.keys(oldData)
  i = keys.length
  while (i--) {
    key = keys[i]
    if (!_.isReserved(key) && !(key in newData)) {
      this._unproxy(key)
    }
  }
  // proxy keys not already proxied,
  // and trigger change for changed values
  keys = Object.keys(newData)
  i = keys.length
  while (i--) {
    key = keys[i]
    if (!this.hasOwnProperty(key) && !_.isReserved(key)) {
      // new property
      this._proxy(key)
    }
  }
  oldData.__ob__.removeVm(this)
  Observer.create(newData, this)
  this._digest()
}

/**
 * Proxy a property, so that
 * vm.prop === vm._data.prop
 *
 * @param {String} key
 */

exports._proxy = function (key) {
  // need to store ref to self here
  // because these getter/setters might
  // be called by child instances!
  var self = this
  Object.defineProperty(self, key, {
    configurable: true,
    enumerable: true,
    get: function proxyGetter () {
      return self._data[key]
    },
    set: function proxySetter (val) {
      self._data[key] = val
    }
  })
}

/**
 * Unproxy a property.
 *
 * @param {String} key
 */

exports._unproxy = function (key) {
  delete this[key]
}

/**
 * Force update on every watcher in scope.
 */

exports._digest = function () {
  var i = this._watchers.length
  while (i--) {
    this._watchers[i].update(true) // shallow updates
  }
  var children = this.$children
  i = children.length
  while (i--) {
    var child = children[i]
    if (child.$options.inherit) {
      child._digest()
    }
  }
}

/**
 * Setup computed properties. They are essentially
 * special getter/setters
 */

function noop () {}
exports._initComputed = function () {
  var computed = this.$options.computed
  if (computed) {
    for (var key in computed) {
      var userDef = computed[key]
      var def = {
        enumerable: true,
        configurable: true
      }
      if (typeof userDef === 'function') {
        def.get = makeComputedGetter(userDef, this)
        def.set = noop
      } else {
        def.get = userDef.get
          ? userDef.cache !== false
            ? makeComputedGetter(userDef.get, this)
            : _.bind(userDef.get, this)
          : noop
        def.set = userDef.set
          ? _.bind(userDef.set, this)
          : noop
      }
      Object.defineProperty(this, key, def)
    }
  }
}

function makeComputedGetter (getter, owner) {
  var watcher = new Watcher(owner, getter, null, {
    lazy: true
  })
  return function computedGetter () {
    if (watcher.dirty) {
      watcher.evaluate()
    }
    if (Dep.target) {
      watcher.depend()
    }
    return watcher.value
  }
}

/**
 * Setup instance methods. Methods must be bound to the
 * instance since they might be called by children
 * inheriting them.
 */

exports._initMethods = function () {
  var methods = this.$options.methods
  if (methods) {
    for (var key in methods) {
      this[key] = _.bind(methods[key], this)
    }
  }
}

/**
 * Initialize meta information like $index, $key & $value.
 */

exports._initMeta = function () {
  var metas = this.$options._meta
  if (metas) {
    for (var key in metas) {
      this._defineMeta(key, metas[key])
    }
  }
}

/**
 * Define a meta property, e.g $index, $key, $value
 * which only exists on the vm instance but not in $data.
 *
 * @param {String} key
 * @param {*} value
 */

exports._defineMeta = function (key, value) {
  var dep = new Dep()
  Object.defineProperty(this, key, {
    get: function metaGetter () {
      if (Dep.target) {
        dep.depend()
      }
      return value
    },
    set: function metaSetter (val) {
      if (val !== value) {
        value = val
        dep.notify()
      }
    }
  })
}

}).call(this,require('_process'))

},{"../compiler":82,"../observer":119,"../observer/dep":118,"../util":133,"../watcher":137,"_process":24}],117:[function(require,module,exports){
var _ = require('../util')
var arrayProto = Array.prototype
var arrayMethods = Object.create(arrayProto)

/**
 * Intercept mutating methods and emit events
 */

;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method]
  _.define(arrayMethods, method, function mutator () {
    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length
    var args = new Array(i)
    while (i--) {
      args[i] = arguments[i]
    }
    var result = original.apply(this, args)
    var ob = this.__ob__
    var inserted, removed
    switch (method) {
      case 'push':
        inserted = args
        break
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        removed = result
        break
      case 'pop':
      case 'shift':
        removed = [result]
        break
    }
    if (inserted) ob.observeArray(inserted)
    if (removed) ob.unobserveArray(removed)
    // notify change
    ob.notify()
    return result
  })
})

/**
 * Swap the element at the given index with a new value
 * and emits corresponding event.
 *
 * @param {Number} index
 * @param {*} val
 * @return {*} - replaced element
 */

_.define(
  arrayProto,
  '$set',
  function $set (index, val) {
    if (index >= this.length) {
      this.length = index + 1
    }
    return this.splice(index, 1, val)[0]
  }
)

/**
 * Convenience method to remove the element at given index.
 *
 * @param {Number} index
 * @param {*} val
 */

_.define(
  arrayProto,
  '$remove',
  function $remove (index) {
    /* istanbul ignore if */
    if (!this.length) return
    if (typeof index !== 'number') {
      index = _.indexOf(this, index)
    }
    if (index > -1) {
      return this.splice(index, 1)
    }
  }
)

module.exports = arrayMethods

},{"../util":133}],118:[function(require,module,exports){
var _ = require('../util')
var uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 *
 * @constructor
 */

function Dep () {
  this.id = uid++
  this.subs = []
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null

/**
 * Add a directive subscriber.
 *
 * @param {Directive} sub
 */

Dep.prototype.addSub = function (sub) {
  this.subs.push(sub)
}

/**
 * Remove a directive subscriber.
 *
 * @param {Directive} sub
 */

Dep.prototype.removeSub = function (sub) {
  this.subs.$remove(sub)
}

/**
 * Add self as a dependency to the target watcher.
 */

Dep.prototype.depend = function () {
  Dep.target.addDep(this)
}

/**
 * Notify all subscribers of a new value.
 */

Dep.prototype.notify = function () {
  // stablize the subscriber list first
  var subs = _.toArray(this.subs)
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update()
  }
}

module.exports = Dep

},{"../util":133}],119:[function(require,module,exports){
var _ = require('../util')
var config = require('../config')
var Dep = require('./dep')
var arrayMethods = require('./array')
var arrayKeys = Object.getOwnPropertyNames(arrayMethods)
require('./object')

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 *
 * @param {Array|Object} value
 * @constructor
 */

function Observer (value) {
  this.value = value
  this.dep = new Dep()
  _.define(value, '__ob__', this)
  if (_.isArray(value)) {
    var augment = config.proto && _.hasProto
      ? protoAugment
      : copyAugment
    augment(value, arrayMethods, arrayKeys)
    this.observeArray(value)
  } else {
    this.walk(value)
  }
}

// Static methods

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 *
 * @param {*} value
 * @param {Vue} [vm]
 * @return {Observer|undefined}
 * @static
 */

Observer.create = function (value, vm) {
  var ob
  if (
    value &&
    value.hasOwnProperty('__ob__') &&
    value.__ob__ instanceof Observer
  ) {
    ob = value.__ob__
  } else if (
    (_.isArray(value) || _.isPlainObject(value)) &&
    !Object.isFrozen(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (ob && vm) {
    ob.addVm(vm)
  }
  return ob
}

// Instance methods

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object. Properties prefixed with `$` or `_`
 * and accessor properties are ignored.
 *
 * @param {Object} obj
 */

Observer.prototype.walk = function (obj) {
  var keys = Object.keys(obj)
  var i = keys.length
  while (i--) {
    this.convert(keys[i], obj[keys[i]])
  }
}

/**
 * Try to carete an observer for a child value,
 * and if value is array, link dep to the array.
 *
 * @param {*} val
 * @return {Dep|undefined}
 */

Observer.prototype.observe = function (val) {
  return Observer.create(val)
}

/**
 * Observe a list of Array items.
 *
 * @param {Array} items
 */

Observer.prototype.observeArray = function (items) {
  var i = items.length
  while (i--) {
    var ob = this.observe(items[i])
    if (ob) {
      (ob.parents || (ob.parents = [])).push(this)
    }
  }
}

/**
 * Remove self from the parent list of removed objects.
 *
 * @param {Array} items
 */

Observer.prototype.unobserveArray = function (items) {
  var i = items.length
  while (i--) {
    var ob = items[i] && items[i].__ob__
    if (ob) {
      ob.parents.$remove(this)
    }
  }
}

/**
 * Notify self dependency, and also parent Array dependency
 * if any.
 */

Observer.prototype.notify = function () {
  this.dep.notify()
  var parents = this.parents
  if (parents) {
    var i = parents.length
    while (i--) {
      parents[i].notify()
    }
  }
}

/**
 * Convert a property into getter/setter so we can emit
 * the events when the property is accessed/changed.
 *
 * @param {String} key
 * @param {*} val
 */

Observer.prototype.convert = function (key, val) {
  var ob = this
  var childOb = ob.observe(val)
  var dep = new Dep()
  Object.defineProperty(ob.value, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
        }
      }
      return val
    },
    set: function (newVal) {
      if (newVal === val) return
      val = newVal
      childOb = ob.observe(newVal)
      dep.notify()
    }
  })
}

/**
 * Add an owner vm, so that when $add/$delete mutations
 * happen we can notify owner vms to proxy the keys and
 * digest the watchers. This is only called when the object
 * is observed as an instance's root $data.
 *
 * @param {Vue} vm
 */

Observer.prototype.addVm = function (vm) {
  (this.vms || (this.vms = [])).push(vm)
}

/**
 * Remove an owner vm. This is called when the object is
 * swapped out as an instance's $data object.
 *
 * @param {Vue} vm
 */

Observer.prototype.removeVm = function (vm) {
  this.vms.$remove(vm)
}

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 *
 * @param {Object|Array} target
 * @param {Object} proto
 */

function protoAugment (target, src) {
  target.__proto__ = src
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 *
 * @param {Object|Array} target
 * @param {Object} proto
 */

function copyAugment (target, src, keys) {
  var i = keys.length
  var key
  while (i--) {
    key = keys[i]
    _.define(target, key, src[key])
  }
}

module.exports = Observer

},{"../config":84,"../util":133,"./array":117,"./dep":118,"./object":120}],120:[function(require,module,exports){
var _ = require('../util')
var objProto = Object.prototype

/**
 * Add a new property to an observed object
 * and emits corresponding event
 *
 * @param {String} key
 * @param {*} val
 * @public
 */

_.define(
  objProto,
  '$add',
  function $add (key, val) {
    if (this.hasOwnProperty(key)) return
    var ob = this.__ob__
    if (!ob || _.isReserved(key)) {
      this[key] = val
      return
    }
    ob.convert(key, val)
    ob.notify()
    if (ob.vms) {
      var i = ob.vms.length
      while (i--) {
        var vm = ob.vms[i]
        vm._proxy(key)
        vm._digest()
      }
    }
  }
)

/**
 * Set a property on an observed object, calling add to
 * ensure the property is observed.
 *
 * @param {String} key
 * @param {*} val
 * @public
 */

_.define(
  objProto,
  '$set',
  function $set (key, val) {
    this.$add(key, val)
    this[key] = val
  }
)

/**
 * Deletes a property from an observed object
 * and emits corresponding event
 *
 * @param {String} key
 * @public
 */

_.define(
  objProto,
  '$delete',
  function $delete (key) {
    if (!this.hasOwnProperty(key)) return
    delete this[key]
    var ob = this.__ob__
    if (!ob || _.isReserved(key)) {
      return
    }
    ob.notify()
    if (ob.vms) {
      var i = ob.vms.length
      while (i--) {
        var vm = ob.vms[i]
        vm._unproxy(key)
        vm._digest()
      }
    }
  }
)

},{"../util":133}],121:[function(require,module,exports){
var _ = require('../util')
var Cache = require('../cache')
var cache = new Cache(1000)
var argRE = /^[^\{\?]+$|^'[^']*'$|^"[^"]*"$/
var filterTokenRE = /[^\s'"]+|'[^']*'|"[^"]*"/g
var reservedArgRE = /^in$|^-?\d+/

/**
 * Parser state
 */

var str
var c, i, l
var inSingle
var inDouble
var curly
var square
var paren
var begin
var argIndex
var dirs
var dir
var lastFilterIndex
var arg

/**
 * Push a directive object into the result Array
 */

function pushDir () {
  dir.raw = str.slice(begin, i).trim()
  if (dir.expression === undefined) {
    dir.expression = str.slice(argIndex, i).trim()
  } else if (lastFilterIndex !== begin) {
    pushFilter()
  }
  if (i === 0 || dir.expression) {
    dirs.push(dir)
  }
}

/**
 * Push a filter to the current directive object
 */

function pushFilter () {
  var exp = str.slice(lastFilterIndex, i).trim()
  var filter
  if (exp) {
    filter = {}
    var tokens = exp.match(filterTokenRE)
    filter.name = tokens[0]
    if (tokens.length > 1) {
      filter.args = tokens.slice(1).map(processFilterArg)
    }
  }
  if (filter) {
    (dir.filters = dir.filters || []).push(filter)
  }
  lastFilterIndex = i + 1
}

/**
 * Check if an argument is dynamic and strip quotes.
 *
 * @param {String} arg
 * @return {Object}
 */

function processFilterArg (arg) {
  var stripped = reservedArgRE.test(arg)
    ? arg
    : _.stripQuotes(arg)
  var dynamic = stripped === false
  return {
    value: dynamic ? arg : stripped,
    dynamic: dynamic
  }
}

/**
 * Parse a directive string into an Array of AST-like
 * objects representing directives.
 *
 * Example:
 *
 * "click: a = a + 1 | uppercase" will yield:
 * {
 *   arg: 'click',
 *   expression: 'a = a + 1',
 *   filters: [
 *     { name: 'uppercase', args: null }
 *   ]
 * }
 *
 * @param {String} str
 * @return {Array<Object>}
 */

exports.parse = function (s) {

  var hit = cache.get(s)
  if (hit) {
    return hit
  }

  // reset parser state
  str = s
  inSingle = inDouble = false
  curly = square = paren = begin = argIndex = 0
  lastFilterIndex = 0
  dirs = []
  dir = {}
  arg = null

  for (i = 0, l = str.length; i < l; i++) {
    c = str.charCodeAt(i)
    if (inSingle) {
      // check single quote
      if (c === 0x27) inSingle = !inSingle
    } else if (inDouble) {
      // check double quote
      if (c === 0x22) inDouble = !inDouble
    } else if (
      c === 0x2C && // comma
      !paren && !curly && !square
    ) {
      // reached the end of a directive
      pushDir()
      // reset & skip the comma
      dir = {}
      begin = argIndex = lastFilterIndex = i + 1
    } else if (
      c === 0x3A && // colon
      !dir.expression &&
      !dir.arg
    ) {
      // argument
      arg = str.slice(begin, i).trim()
      // test for valid argument here
      // since we may have caught stuff like first half of
      // an object literal or a ternary expression.
      if (argRE.test(arg)) {
        argIndex = i + 1
        dir.arg = _.stripQuotes(arg) || arg
      }
    } else if (
      c === 0x7C && // pipe
      str.charCodeAt(i + 1) !== 0x7C &&
      str.charCodeAt(i - 1) !== 0x7C
    ) {
      if (dir.expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1
        dir.expression = str.slice(argIndex, i).trim()
      } else {
        // already has filter
        pushFilter()
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break // "
        case 0x27: inSingle = true; break // '
        case 0x28: paren++; break         // (
        case 0x29: paren--; break         // )
        case 0x5B: square++; break        // [
        case 0x5D: square--; break        // ]
        case 0x7B: curly++; break         // {
        case 0x7D: curly--; break         // }
      }
    }
  }

  if (i === 0 || begin !== i) {
    pushDir()
  }

  cache.put(s, dirs)
  return dirs
}

},{"../cache":79,"../util":133}],122:[function(require,module,exports){
(function (process){
var _ = require('../util')
var Path = require('./path')
var Cache = require('../cache')
var expressionCache = new Cache(1000)

var allowedKeywords =
  'Math,Date,this,true,false,null,undefined,Infinity,NaN,' +
  'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' +
  'encodeURIComponent,parseInt,parseFloat'
var allowedKeywordsRE =
  new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)')

// keywords that don't make sense inside expressions
var improperKeywords =
  'break,case,class,catch,const,continue,debugger,default,' +
  'delete,do,else,export,extends,finally,for,function,if,' +
  'import,in,instanceof,let,return,super,switch,throw,try,' +
  'var,while,with,yield,enum,await,implements,package,' +
  'proctected,static,interface,private,public'
var improperKeywordsRE =
  new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)')

var wsRE = /\s/g
var newlineRE = /\n/g
var saveRE = /[\{,]\s*[\w\$_]+\s*:|('[^']*'|"[^"]*")|new |typeof |void /g
var restoreRE = /"(\d+)"/g
var pathTestRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/
var pathReplaceRE = /[^\w$\.]([A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\])*)/g
var booleanLiteralRE = /^(true|false)$/

/**
 * Save / Rewrite / Restore
 *
 * When rewriting paths found in an expression, it is
 * possible for the same letter sequences to be found in
 * strings and Object literal property keys. Therefore we
 * remove and store these parts in a temporary array, and
 * restore them after the path rewrite.
 */

var saved = []

/**
 * Save replacer
 *
 * The save regex can match two possible cases:
 * 1. An opening object literal
 * 2. A string
 * If matched as a plain string, we need to escape its
 * newlines, since the string needs to be preserved when
 * generating the function body.
 *
 * @param {String} str
 * @param {String} isString - str if matched as a string
 * @return {String} - placeholder with index
 */

function save (str, isString) {
  var i = saved.length
  saved[i] = isString
    ? str.replace(newlineRE, '\\n')
    : str
  return '"' + i + '"'
}

/**
 * Path rewrite replacer
 *
 * @param {String} raw
 * @return {String}
 */

function rewrite (raw) {
  var c = raw.charAt(0)
  var path = raw.slice(1)
  if (allowedKeywordsRE.test(path)) {
    return raw
  } else {
    path = path.indexOf('"') > -1
      ? path.replace(restoreRE, restore)
      : path
    return c + 'scope.' + path
  }
}

/**
 * Restore replacer
 *
 * @param {String} str
 * @param {String} i - matched save index
 * @return {String}
 */

function restore (str, i) {
  return saved[i]
}

/**
 * Rewrite an expression, prefixing all path accessors with
 * `scope.` and generate getter/setter functions.
 *
 * @param {String} exp
 * @param {Boolean} needSet
 * @return {Function}
 */

function compileExpFns (exp, needSet) {
  if (improperKeywordsRE.test(exp)) {
    process.env.NODE_ENV !== 'production' && _.warn(
      'Avoid using reserved keywords in expression: ' + exp
    )
  }
  // reset state
  saved.length = 0
  // save strings and object literal keys
  var body = exp
    .replace(saveRE, save)
    .replace(wsRE, '')
  // rewrite all paths
  // pad 1 space here becaue the regex matches 1 extra char
  body = (' ' + body)
    .replace(pathReplaceRE, rewrite)
    .replace(restoreRE, restore)
  var getter = makeGetter(body)
  if (getter) {
    return {
      get: getter,
      body: body,
      set: needSet
        ? makeSetter(body)
        : null
    }
  }
}

/**
 * Compile getter setters for a simple path.
 *
 * @param {String} exp
 * @return {Function}
 */

function compilePathFns (exp) {
  var getter, path
  if (exp.indexOf('[') < 0) {
    // really simple path
    path = exp.split('.')
    path.raw = exp
    getter = Path.compileGetter(path)
  } else {
    // do the real parsing
    path = Path.parse(exp)
    getter = path.get
  }
  return {
    get: getter,
    // always generate setter for simple paths
    set: function (obj, val) {
      Path.set(obj, path, val)
    }
  }
}

/**
 * Build a getter function. Requires eval.
 *
 * We isolate the try/catch so it doesn't affect the
 * optimization of the parse function when it is not called.
 *
 * @param {String} body
 * @return {Function|undefined}
 */

function makeGetter (body) {
  try {
    return new Function('scope', 'return ' + body + ';')
  } catch (e) {
    process.env.NODE_ENV !== 'production' && _.warn(
      'Invalid expression. ' +
      'Generated function body: ' + body
    )
  }
}

/**
 * Build a setter function.
 *
 * This is only needed in rare situations like "a[b]" where
 * a settable path requires dynamic evaluation.
 *
 * This setter function may throw error when called if the
 * expression body is not a valid left-hand expression in
 * assignment.
 *
 * @param {String} body
 * @return {Function|undefined}
 */

function makeSetter (body) {
  try {
    return new Function('scope', 'value', body + '=value;')
  } catch (e) {
    process.env.NODE_ENV !== 'production' && _.warn(
      'Invalid setter function body: ' + body
    )
  }
}

/**
 * Check for setter existence on a cache hit.
 *
 * @param {Function} hit
 */

function checkSetter (hit) {
  if (!hit.set) {
    hit.set = makeSetter(hit.body)
  }
}

/**
 * Parse an expression into re-written getter/setters.
 *
 * @param {String} exp
 * @param {Boolean} needSet
 * @return {Function}
 */

exports.parse = function (exp, needSet) {
  exp = exp.trim()
  // try cache
  var hit = expressionCache.get(exp)
  if (hit) {
    if (needSet) {
      checkSetter(hit)
    }
    return hit
  }
  // we do a simple path check to optimize for them.
  // the check fails valid paths with unusal whitespaces,
  // but that's too rare and we don't care.
  // also skip boolean literals and paths that start with
  // global "Math"
  var res = exports.isSimplePath(exp)
    ? compilePathFns(exp)
    : compileExpFns(exp, needSet)
  expressionCache.put(exp, res)
  return res
}

/**
 * Check if an expression is a simple path.
 *
 * @param {String} exp
 * @return {Boolean}
 */

exports.isSimplePath = function (exp) {
  return pathTestRE.test(exp) &&
    // don't treat true/false as paths
    !booleanLiteralRE.test(exp) &&
    // Math constants e.g. Math.PI, Math.E etc.
    exp.slice(0, 5) !== 'Math.'
}

}).call(this,require('_process'))

},{"../cache":79,"../util":133,"./path":123,"_process":24}],123:[function(require,module,exports){
(function (process){
var _ = require('../util')
var Cache = require('../cache')
var pathCache = new Cache(1000)
var identRE = exports.identRE = /^[$_a-zA-Z]+[\w$]*$/

// actions
var APPEND = 0
var PUSH = 1

// states
var BEFORE_PATH = 0
var IN_PATH = 1
var BEFORE_IDENT = 2
var IN_IDENT = 3
var BEFORE_ELEMENT = 4
var AFTER_ZERO = 5
var IN_INDEX = 6
var IN_SINGLE_QUOTE = 7
var IN_DOUBLE_QUOTE = 8
var IN_SUB_PATH = 9
var AFTER_ELEMENT = 10
var AFTER_PATH = 11
var ERROR = 12

var pathStateMachine = []

pathStateMachine[BEFORE_PATH] = {
  'ws': [BEFORE_PATH],
  'ident': [IN_IDENT, APPEND],
  '[': [BEFORE_ELEMENT],
  'eof': [AFTER_PATH]
}

pathStateMachine[IN_PATH] = {
  'ws': [IN_PATH],
  '.': [BEFORE_IDENT],
  '[': [BEFORE_ELEMENT],
  'eof': [AFTER_PATH]
}

pathStateMachine[BEFORE_IDENT] = {
  'ws': [BEFORE_IDENT],
  'ident': [IN_IDENT, APPEND]
}

pathStateMachine[IN_IDENT] = {
  'ident': [IN_IDENT, APPEND],
  '0': [IN_IDENT, APPEND],
  'number': [IN_IDENT, APPEND],
  'ws': [IN_PATH, PUSH],
  '.': [BEFORE_IDENT, PUSH],
  '[': [BEFORE_ELEMENT, PUSH],
  'eof': [AFTER_PATH, PUSH]
}

pathStateMachine[BEFORE_ELEMENT] = {
  'ws': [BEFORE_ELEMENT],
  '0': [AFTER_ZERO, APPEND],
  'number': [IN_INDEX, APPEND],
  "'": [IN_SINGLE_QUOTE, APPEND, ''],
  '"': [IN_DOUBLE_QUOTE, APPEND, ''],
  'ident': [IN_SUB_PATH, APPEND, '*']
}

pathStateMachine[AFTER_ZERO] = {
  'ws': [AFTER_ELEMENT, PUSH],
  ']': [IN_PATH, PUSH]
}

pathStateMachine[IN_INDEX] = {
  '0': [IN_INDEX, APPEND],
  'number': [IN_INDEX, APPEND],
  'ws': [AFTER_ELEMENT],
  ']': [IN_PATH, PUSH]
}

pathStateMachine[IN_SINGLE_QUOTE] = {
  "'": [AFTER_ELEMENT],
  'eof': ERROR,
  'else': [IN_SINGLE_QUOTE, APPEND]
}

pathStateMachine[IN_DOUBLE_QUOTE] = {
  '"': [AFTER_ELEMENT],
  'eof': ERROR,
  'else': [IN_DOUBLE_QUOTE, APPEND]
}

pathStateMachine[IN_SUB_PATH] = {
  'ident': [IN_SUB_PATH, APPEND],
  '0': [IN_SUB_PATH, APPEND],
  'number': [IN_SUB_PATH, APPEND],
  'ws': [AFTER_ELEMENT],
  ']': [IN_PATH, PUSH]
}

pathStateMachine[AFTER_ELEMENT] = {
  'ws': [AFTER_ELEMENT],
  ']': [IN_PATH, PUSH]
}

/**
 * Determine the type of a character in a keypath.
 *
 * @param {Char} ch
 * @return {String} type
 */

function getPathCharType (ch) {
  if (ch === undefined) {
    return 'eof'
  }

  var code = ch.charCodeAt(0)

  switch (code) {
    case 0x5B: // [
    case 0x5D: // ]
    case 0x2E: // .
    case 0x22: // "
    case 0x27: // '
    case 0x30: // 0
      return ch

    case 0x5F: // _
    case 0x24: // $
      return 'ident'

    case 0x20: // Space
    case 0x09: // Tab
    case 0x0A: // Newline
    case 0x0D: // Return
    case 0xA0:  // No-break space
    case 0xFEFF:  // Byte Order Mark
    case 0x2028:  // Line Separator
    case 0x2029:  // Paragraph Separator
      return 'ws'
  }

  // a-z, A-Z
  if (
    (code >= 0x61 && code <= 0x7A) ||
    (code >= 0x41 && code <= 0x5A)
  ) {
    return 'ident'
  }

  // 1-9
  if (code >= 0x31 && code <= 0x39) {
    return 'number'
  }

  return 'else'
}

/**
 * Parse a string path into an array of segments
 * Todo implement cache
 *
 * @param {String} path
 * @return {Array|undefined}
 */

function parsePath (path) {
  var keys = []
  var index = -1
  var mode = BEFORE_PATH
  var c, newChar, key, type, transition, action, typeMap

  var actions = []
  actions[PUSH] = function () {
    if (key === undefined) {
      return
    }
    keys.push(key)
    key = undefined
  }
  actions[APPEND] = function () {
    if (key === undefined) {
      key = newChar
    } else {
      key += newChar
    }
  }

  function maybeUnescapeQuote () {
    var nextChar = path[index + 1]
    if ((mode === IN_SINGLE_QUOTE && nextChar === "'") ||
        (mode === IN_DOUBLE_QUOTE && nextChar === '"')) {
      index++
      newChar = nextChar
      actions[APPEND]()
      return true
    }
  }

  while (mode != null) {
    index++
    c = path[index]

    if (c === '\\' && maybeUnescapeQuote()) {
      continue
    }

    type = getPathCharType(c)
    typeMap = pathStateMachine[mode]
    transition = typeMap[type] || typeMap['else'] || ERROR

    if (transition === ERROR) {
      return // parse error
    }

    mode = transition[0]
    action = actions[transition[1]]
    if (action) {
      newChar = transition[2]
      newChar = newChar === undefined
        ? c
        : newChar === '*'
          ? newChar + c
          : newChar
      action()
    }

    if (mode === AFTER_PATH) {
      keys.raw = path
      return keys
    }
  }
}

/**
 * Format a accessor segment based on its type.
 *
 * @param {String} key
 * @return {Boolean}
 */

function formatAccessor (key) {
  if (identRE.test(key)) { // identifier
    return '.' + key
  } else if (+key === key >>> 0) { // bracket index
    return '[' + key + ']'
  } else if (key.charAt(0) === '*') {
    return '[o' + formatAccessor(key.slice(1)) + ']'
  } else { // bracket string
    return '["' + key.replace(/"/g, '\\"') + '"]'
  }
}

/**
 * Compiles a getter function with a fixed path.
 * The fixed path getter supresses errors.
 *
 * @param {Array} path
 * @return {Function}
 */

exports.compileGetter = function (path) {
  var body = 'return o' + path.map(formatAccessor).join('')
  return new Function('o', body)
}

/**
 * External parse that check for a cache hit first
 *
 * @param {String} path
 * @return {Array|undefined}
 */

exports.parse = function (path) {
  var hit = pathCache.get(path)
  if (!hit) {
    hit = parsePath(path)
    if (hit) {
      hit.get = exports.compileGetter(hit)
      pathCache.put(path, hit)
    }
  }
  return hit
}

/**
 * Get from an object from a path string
 *
 * @param {Object} obj
 * @param {String} path
 */

exports.get = function (obj, path) {
  path = exports.parse(path)
  if (path) {
    return path.get(obj)
  }
}

/**
 * Set on an object from a path
 *
 * @param {Object} obj
 * @param {String | Array} path
 * @param {*} val
 */

exports.set = function (obj, path, val) {
  var original = obj
  if (typeof path === 'string') {
    path = exports.parse(path)
  }
  if (!path || !_.isObject(obj)) {
    return false
  }
  var last, key
  for (var i = 0, l = path.length; i < l; i++) {
    last = obj
    key = path[i]
    if (key.charAt(0) === '*') {
      key = original[key.slice(1)]
    }
    if (i < l - 1) {
      obj = obj[key]
      if (!_.isObject(obj)) {
        warnNonExistent(path)
        obj = {}
        last.$add(key, obj)
      }
    } else {
      if (_.isArray(obj)) {
        obj.$set(key, val)
      } else if (key in obj) {
        obj[key] = val
      } else {
        warnNonExistent(path)
        obj.$add(key, val)
      }
    }
  }
  return true
}

function warnNonExistent (path) {
  process.env.NODE_ENV !== 'production' && _.warn(
    'You are setting a non-existent path "' + path.raw + '" ' +
    'on a vm instance. Consider pre-initializing the property ' +
    'with the "data" option for more reliable reactivity ' +
    'and better performance.'
  )
}

}).call(this,require('_process'))

},{"../cache":79,"../util":133,"_process":24}],124:[function(require,module,exports){
var _ = require('../util')
var Cache = require('../cache')
var templateCache = new Cache(1000)
var idSelectorCache = new Cache(1000)

var map = {
  _default: [0, '', ''],
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [
    2,
    '<table><tbody></tbody><colgroup>',
    '</colgroup></table>'
  ]
}

map.td =
map.th = [
  3,
  '<table><tbody><tr>',
  '</tr></tbody></table>'
]

map.option =
map.optgroup = [
  1,
  '<select multiple="multiple">',
  '</select>'
]

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>']

map.g =
map.defs =
map.symbol =
map.use =
map.image =
map.text =
map.circle =
map.ellipse =
map.line =
map.path =
map.polygon =
map.polyline =
map.rect = [
  1,
  '<svg ' +
    'xmlns="http://www.w3.org/2000/svg" ' +
    'xmlns:xlink="http://www.w3.org/1999/xlink" ' +
    'xmlns:ev="http://www.w3.org/2001/xml-events"' +
    'version="1.1">',
  '</svg>'
]

/**
 * Check if a node is a supported template node with a
 * DocumentFragment content.
 *
 * @param {Node} node
 * @return {Boolean}
 */

function isRealTemplate (node) {
  return _.isTemplate(node) &&
    node.content instanceof DocumentFragment
}

var tagRE = /<([\w:]+)/
var entityRE = /&\w+;|&#\d+;|&#x[\dA-F]+;/

/**
 * Convert a string template to a DocumentFragment.
 * Determines correct wrapping by tag types. Wrapping
 * strategy found in jQuery & component/domify.
 *
 * @param {String} templateString
 * @return {DocumentFragment}
 */

function stringToFragment (templateString) {
  // try a cache hit first
  var hit = templateCache.get(templateString)
  if (hit) {
    return hit
  }

  var frag = document.createDocumentFragment()
  var tagMatch = templateString.match(tagRE)
  var entityMatch = entityRE.test(templateString)

  if (!tagMatch && !entityMatch) {
    // text only, return a single text node.
    frag.appendChild(
      document.createTextNode(templateString)
    )
  } else {

    var tag = tagMatch && tagMatch[1]
    var wrap = map[tag] || map._default
    var depth = wrap[0]
    var prefix = wrap[1]
    var suffix = wrap[2]
    var node = document.createElement('div')

    node.innerHTML = prefix + templateString.trim() + suffix
    while (depth--) {
      node = node.lastChild
    }

    var child
    /* eslint-disable no-cond-assign */
    while (child = node.firstChild) {
    /* eslint-enable no-cond-assign */
      frag.appendChild(child)
    }
  }

  templateCache.put(templateString, frag)
  return frag
}

/**
 * Convert a template node to a DocumentFragment.
 *
 * @param {Node} node
 * @return {DocumentFragment}
 */

function nodeToFragment (node) {
  // if its a template tag and the browser supports it,
  // its content is already a document fragment.
  if (isRealTemplate(node)) {
    _.trimNode(node.content)
    return node.content
  }
  // script template
  if (node.tagName === 'SCRIPT') {
    return stringToFragment(node.textContent)
  }
  // normal node, clone it to avoid mutating the original
  var clone = exports.clone(node)
  var frag = document.createDocumentFragment()
  var child
  /* eslint-disable no-cond-assign */
  while (child = clone.firstChild) {
  /* eslint-enable no-cond-assign */
    frag.appendChild(child)
  }
  _.trimNode(frag)
  return frag
}

// Test for the presence of the Safari template cloning bug
// https://bugs.webkit.org/show_bug.cgi?id=137755
var hasBrokenTemplate = (function () {
  /* istanbul ignore else */
  if (_.inBrowser) {
    var a = document.createElement('div')
    a.innerHTML = '<template>1</template>'
    return !a.cloneNode(true).firstChild.innerHTML
  } else {
    return false
  }
})()

// Test for IE10/11 textarea placeholder clone bug
var hasTextareaCloneBug = (function () {
  /* istanbul ignore else */
  if (_.inBrowser) {
    var t = document.createElement('textarea')
    t.placeholder = 't'
    return t.cloneNode(true).value === 't'
  } else {
    return false
  }
})()

/**
 * 1. Deal with Safari cloning nested <template> bug by
 *    manually cloning all template instances.
 * 2. Deal with IE10/11 textarea placeholder bug by setting
 *    the correct value after cloning.
 *
 * @param {Element|DocumentFragment} node
 * @return {Element|DocumentFragment}
 */

exports.clone = function (node) {
  if (!node.querySelectorAll) {
    return node.cloneNode()
  }
  var res = node.cloneNode(true)
  var i, original, cloned
  /* istanbul ignore if */
  if (hasBrokenTemplate) {
    var clone = res
    if (isRealTemplate(node)) {
      node = node.content
      clone = res.content
    }
    original = node.querySelectorAll('template')
    if (original.length) {
      cloned = clone.querySelectorAll('template')
      i = cloned.length
      while (i--) {
        cloned[i].parentNode.replaceChild(
          exports.clone(original[i]),
          cloned[i]
        )
      }
    }
  }
  /* istanbul ignore if */
  if (hasTextareaCloneBug) {
    if (node.tagName === 'TEXTAREA') {
      res.value = node.value
    } else {
      original = node.querySelectorAll('textarea')
      if (original.length) {
        cloned = res.querySelectorAll('textarea')
        i = cloned.length
        while (i--) {
          cloned[i].value = original[i].value
        }
      }
    }
  }
  return res
}

/**
 * Process the template option and normalizes it into a
 * a DocumentFragment that can be used as a partial or a
 * instance template.
 *
 * @param {*} template
 *    Possible values include:
 *    - DocumentFragment object
 *    - Node object of type Template
 *    - id selector: '#some-template-id'
 *    - template string: '<div><span>{{msg}}</span></div>'
 * @param {Boolean} clone
 * @param {Boolean} noSelector
 * @return {DocumentFragment|undefined}
 */

exports.parse = function (template, clone, noSelector) {
  var node, frag

  // if the template is already a document fragment,
  // do nothing
  if (template instanceof DocumentFragment) {
    _.trimNode(template)
    return clone
      ? exports.clone(template)
      : template
  }

  if (typeof template === 'string') {
    // id selector
    if (!noSelector && template.charAt(0) === '#') {
      // id selector can be cached too
      frag = idSelectorCache.get(template)
      if (!frag) {
        node = document.getElementById(template.slice(1))
        if (node) {
          frag = nodeToFragment(node)
          // save selector to cache
          idSelectorCache.put(template, frag)
        }
      }
    } else {
      // normal string template
      frag = stringToFragment(template)
    }
  } else if (template.nodeType) {
    // a direct node
    frag = nodeToFragment(template)
  }

  return frag && clone
    ? exports.clone(frag)
    : frag
}

},{"../cache":79,"../util":133}],125:[function(require,module,exports){
var Cache = require('../cache')
var config = require('../config')
var dirParser = require('./directive')
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g
var cache, tagRE, htmlRE, firstChar, lastChar

/**
 * Escape a string so it can be used in a RegExp
 * constructor.
 *
 * @param {String} str
 */

function escapeRegex (str) {
  return str.replace(regexEscapeRE, '\\$&')
}

/**
 * Compile the interpolation tag regex.
 *
 * @return {RegExp}
 */

function compileRegex () {
  config._delimitersChanged = false
  var open = config.delimiters[0]
  var close = config.delimiters[1]
  firstChar = open.charAt(0)
  lastChar = close.charAt(close.length - 1)
  var firstCharRE = escapeRegex(firstChar)
  var lastCharRE = escapeRegex(lastChar)
  var openRE = escapeRegex(open)
  var closeRE = escapeRegex(close)
  tagRE = new RegExp(
    firstCharRE + '?' + openRE +
    '(.+?)' +
    closeRE + lastCharRE + '?',
    'g'
  )
  htmlRE = new RegExp(
    '^' + firstCharRE + openRE +
    '.*' +
    closeRE + lastCharRE + '$'
  )
  // reset cache
  cache = new Cache(1000)
}

/**
 * Parse a template text string into an array of tokens.
 *
 * @param {String} text
 * @return {Array<Object> | null}
 *               - {String} type
 *               - {String} value
 *               - {Boolean} [html]
 *               - {Boolean} [oneTime]
 */

exports.parse = function (text) {
  if (config._delimitersChanged) {
    compileRegex()
  }
  var hit = cache.get(text)
  if (hit) {
    return hit
  }
  text = text.replace(/\n/g, '')
  if (!tagRE.test(text)) {
    return null
  }
  var tokens = []
  var lastIndex = tagRE.lastIndex = 0
  var match, index, value, first, oneTime, twoWay
  /* eslint-disable no-cond-assign */
  while (match = tagRE.exec(text)) {
  /* eslint-enable no-cond-assign */
    index = match.index
    // push text token
    if (index > lastIndex) {
      tokens.push({
        value: text.slice(lastIndex, index)
      })
    }
    // tag token
    first = match[1].charCodeAt(0)
    oneTime = first === 42 // *
    twoWay = first === 64  // @
    value = oneTime || twoWay
      ? match[1].slice(1)
      : match[1]
    tokens.push({
      tag: true,
      value: value.trim(),
      html: htmlRE.test(match[0]),
      oneTime: oneTime,
      twoWay: twoWay
    })
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    tokens.push({
      value: text.slice(lastIndex)
    })
  }
  cache.put(text, tokens)
  return tokens
}

/**
 * Format a list of tokens into an expression.
 * e.g. tokens parsed from 'a {{b}} c' can be serialized
 * into one single expression as '"a " + b + " c"'.
 *
 * @param {Array} tokens
 * @param {Vue} [vm]
 * @return {String}
 */

exports.tokensToExp = function (tokens, vm) {
  if (tokens.length > 1) {
    return tokens.map(function (token) {
      return formatToken(token, vm)
    }).join('+')
  } else {
    return formatToken(tokens[0], vm, true)
  }
}

/**
 * Format a single token.
 *
 * @param {Object} token
 * @param {Vue} [vm]
 * @param {Boolean} single
 * @return {String}
 */

function formatToken (token, vm, single) {
  return token.tag
    ? vm && token.oneTime
      ? '"' + vm.$eval(token.value) + '"'
      : inlineFilters(token.value, single)
    : '"' + token.value + '"'
}

/**
 * For an attribute with multiple interpolation tags,
 * e.g. attr="some-{{thing | filter}}", in order to combine
 * the whole thing into a single watchable expression, we
 * have to inline those filters. This function does exactly
 * that. This is a bit hacky but it avoids heavy changes
 * to directive parser and watcher mechanism.
 *
 * @param {String} exp
 * @param {Boolean} single
 * @return {String}
 */

var filterRE = /[^|]\|[^|]/
function inlineFilters (exp, single) {
  if (!filterRE.test(exp)) {
    return single
      ? exp
      : '(' + exp + ')'
  } else {
    var dir = dirParser.parse(exp)[0]
    if (!dir.filters) {
      return '(' + exp + ')'
    } else {
      return 'this._applyFilters(' +
        dir.expression + // value
        ',null,' +       // oldValue (null for read)
        JSON.stringify(dir.filters) + // filter descriptors
        ',false)'        // write?
    }
  }
}

},{"../cache":79,"../config":84,"./directive":121}],126:[function(require,module,exports){
var _ = require('../util')

/**
 * Append with transition.
 *
 * @param {Element} el
 * @param {Element} target
 * @param {Vue} vm
 * @param {Function} [cb]
 */

exports.append = function (el, target, vm, cb) {
  apply(el, 1, function () {
    target.appendChild(el)
  }, vm, cb)
}

/**
 * InsertBefore with transition.
 *
 * @param {Element} el
 * @param {Element} target
 * @param {Vue} vm
 * @param {Function} [cb]
 */

exports.before = function (el, target, vm, cb) {
  apply(el, 1, function () {
    _.before(el, target)
  }, vm, cb)
}

/**
 * Remove with transition.
 *
 * @param {Element} el
 * @param {Vue} vm
 * @param {Function} [cb]
 */

exports.remove = function (el, vm, cb) {
  apply(el, -1, function () {
    _.remove(el)
  }, vm, cb)
}

/**
 * Remove by appending to another parent with transition.
 * This is only used in block operations.
 *
 * @param {Element} el
 * @param {Element} target
 * @param {Vue} vm
 * @param {Function} [cb]
 */

exports.removeThenAppend = function (el, target, vm, cb) {
  apply(el, -1, function () {
    target.appendChild(el)
  }, vm, cb)
}

/**
 * Append the childNodes of a fragment to target.
 *
 * @param {DocumentFragment} block
 * @param {Node} target
 * @param {Vue} vm
 */

exports.blockAppend = function (block, target, vm) {
  var nodes = _.toArray(block.childNodes)
  for (var i = 0, l = nodes.length; i < l; i++) {
    exports.before(nodes[i], target, vm)
  }
}

/**
 * Remove a block of nodes between two edge nodes.
 *
 * @param {Node} start
 * @param {Node} end
 * @param {Vue} vm
 */

exports.blockRemove = function (start, end, vm) {
  var node = start.nextSibling
  var next
  while (node !== end) {
    next = node.nextSibling
    exports.remove(node, vm)
    node = next
  }
}

/**
 * Apply transitions with an operation callback.
 *
 * @param {Element} el
 * @param {Number} direction
 *                  1: enter
 *                 -1: leave
 * @param {Function} op - the actual DOM operation
 * @param {Vue} vm
 * @param {Function} [cb]
 */

var apply = exports.apply = function (el, direction, op, vm, cb) {
  var transition = el.__v_trans
  if (
    !transition ||
    // skip if there are no js hooks and CSS transition is
    // not supported
    (!transition.hooks && !_.transitionEndEvent) ||
    // skip transitions for initial compile
    !vm._isCompiled ||
    // if the vm is being manipulated by a parent directive
    // during the parent's compilation phase, skip the
    // animation.
    (vm.$parent && !vm.$parent._isCompiled)
  ) {
    op()
    if (cb) cb()
    return
  }
  var action = direction > 0 ? 'enter' : 'leave'
  transition[action](op, cb)
}

},{"../util":133}],127:[function(require,module,exports){
var _ = require('../util')
var queue = []
var queued = false

/**
 * Push a job into the queue.
 *
 * @param {Function} job
 */

exports.push = function (job) {
  queue.push(job)
  if (!queued) {
    queued = true
    _.nextTick(flush)
  }
}

/**
 * Flush the queue, and do one forced reflow before
 * triggering transitions.
 */

function flush () {
  // Force layout
  var f = document.documentElement.offsetHeight
  for (var i = 0; i < queue.length; i++) {
    queue[i]()
  }
  queue = []
  queued = false
  // dummy return, so js linters don't complain about
  // unused variable f
  return f
}

},{"../util":133}],128:[function(require,module,exports){
var _ = require('../util')
var queue = require('./queue')
var addClass = _.addClass
var removeClass = _.removeClass
var transitionEndEvent = _.transitionEndEvent
var animationEndEvent = _.animationEndEvent
var transDurationProp = _.transitionProp + 'Duration'
var animDurationProp = _.animationProp + 'Duration'

var TYPE_TRANSITION = 1
var TYPE_ANIMATION = 2

var uid = 0

/**
 * A Transition object that encapsulates the state and logic
 * of the transition.
 *
 * @param {Element} el
 * @param {String} id
 * @param {Object} hooks
 * @param {Vue} vm
 */

function Transition (el, id, hooks, vm) {
  this.id = uid++
  this.el = el
  this.enterClass = id + '-enter'
  this.leaveClass = id + '-leave'
  this.hooks = hooks
  this.vm = vm
  // async state
  this.pendingCssEvent =
  this.pendingCssCb =
  this.cancel =
  this.pendingJsCb =
  this.op =
  this.cb = null
  this.justEntered = false
  this.entered = this.left = false
  this.typeCache = {}
  // bind
  var self = this
  ;['enterNextTick', 'enterDone', 'leaveNextTick', 'leaveDone']
    .forEach(function (m) {
      self[m] = _.bind(self[m], self)
    })
}

var p = Transition.prototype

/**
 * Start an entering transition.
 *
 * 1. enter transition triggered
 * 2. call beforeEnter hook
 * 3. add enter class
 * 4. insert/show element
 * 5. call enter hook (with possible explicit js callback)
 * 6. reflow
 * 7. based on transition type:
 *    - transition:
 *        remove class now, wait for transitionend,
 *        then done if there's no explicit js callback.
 *    - animation:
 *        wait for animationend, remove class,
 *        then done if there's no explicit js callback.
 *    - no css transition:
 *        done now if there's no explicit js callback.
 * 8. wait for either done or js callback, then call
 *    afterEnter hook.
 *
 * @param {Function} op - insert/show the element
 * @param {Function} [cb]
 */

p.enter = function (op, cb) {
  this.cancelPending()
  this.callHook('beforeEnter')
  this.cb = cb
  addClass(this.el, this.enterClass)
  op()
  this.entered = false
  this.callHookWithCb('enter')
  if (this.entered) {
    return // user called done synchronously.
  }
  this.cancel = this.hooks && this.hooks.enterCancelled
  queue.push(this.enterNextTick)
}

/**
 * The "nextTick" phase of an entering transition, which is
 * to be pushed into a queue and executed after a reflow so
 * that removing the class can trigger a CSS transition.
 */

p.enterNextTick = function () {
  this.justEntered = true
  _.nextTick(function () {
    this.justEntered = false
  }, this)
  var enterDone = this.enterDone
  var type = this.getCssTransitionType(this.enterClass)
  if (!this.pendingJsCb) {
    if (type === TYPE_TRANSITION) {
      // trigger transition by removing enter class now
      removeClass(this.el, this.enterClass)
      this.setupCssCb(transitionEndEvent, enterDone)
    } else if (type === TYPE_ANIMATION) {
      this.setupCssCb(animationEndEvent, enterDone)
    } else {
      enterDone()
    }
  } else if (type === TYPE_TRANSITION) {
    removeClass(this.el, this.enterClass)
  }
}

/**
 * The "cleanup" phase of an entering transition.
 */

p.enterDone = function () {
  this.entered = true
  this.cancel = this.pendingJsCb = null
  removeClass(this.el, this.enterClass)
  this.callHook('afterEnter')
  if (this.cb) this.cb()
}

/**
 * Start a leaving transition.
 *
 * 1. leave transition triggered.
 * 2. call beforeLeave hook
 * 3. add leave class (trigger css transition)
 * 4. call leave hook (with possible explicit js callback)
 * 5. reflow if no explicit js callback is provided
 * 6. based on transition type:
 *    - transition or animation:
 *        wait for end event, remove class, then done if
 *        there's no explicit js callback.
 *    - no css transition:
 *        done if there's no explicit js callback.
 * 7. wait for either done or js callback, then call
 *    afterLeave hook.
 *
 * @param {Function} op - remove/hide the element
 * @param {Function} [cb]
 */

p.leave = function (op, cb) {
  this.cancelPending()
  this.callHook('beforeLeave')
  this.op = op
  this.cb = cb
  addClass(this.el, this.leaveClass)
  this.left = false
  this.callHookWithCb('leave')
  if (this.left) {
    return // user called done synchronously.
  }
  this.cancel = this.hooks && this.hooks.leaveCancelled
  // only need to handle leaveDone if
  // 1. the transition is already done (synchronously called
  //    by the user, which causes this.op set to null)
  // 2. there's no explicit js callback
  if (this.op && !this.pendingJsCb) {
    // if a CSS transition leaves immediately after enter,
    // the transitionend event never fires. therefore we
    // detect such cases and end the leave immediately.
    if (this.justEntered) {
      this.leaveDone()
    } else {
      queue.push(this.leaveNextTick)
    }
  }
}

/**
 * The "nextTick" phase of a leaving transition.
 */

p.leaveNextTick = function () {
  var type = this.getCssTransitionType(this.leaveClass)
  if (type) {
    var event = type === TYPE_TRANSITION
      ? transitionEndEvent
      : animationEndEvent
    this.setupCssCb(event, this.leaveDone)
  } else {
    this.leaveDone()
  }
}

/**
 * The "cleanup" phase of a leaving transition.
 */

p.leaveDone = function () {
  this.left = true
  this.cancel = this.pendingJsCb = null
  this.op()
  removeClass(this.el, this.leaveClass)
  this.callHook('afterLeave')
  if (this.cb) this.cb()
  this.op = null
}

/**
 * Cancel any pending callbacks from a previously running
 * but not finished transition.
 */

p.cancelPending = function () {
  this.op = this.cb = null
  var hasPending = false
  if (this.pendingCssCb) {
    hasPending = true
    _.off(this.el, this.pendingCssEvent, this.pendingCssCb)
    this.pendingCssEvent = this.pendingCssCb = null
  }
  if (this.pendingJsCb) {
    hasPending = true
    this.pendingJsCb.cancel()
    this.pendingJsCb = null
  }
  if (hasPending) {
    removeClass(this.el, this.enterClass)
    removeClass(this.el, this.leaveClass)
  }
  if (this.cancel) {
    this.cancel.call(this.vm, this.el)
    this.cancel = null
  }
}

/**
 * Call a user-provided synchronous hook function.
 *
 * @param {String} type
 */

p.callHook = function (type) {
  if (this.hooks && this.hooks[type]) {
    this.hooks[type].call(this.vm, this.el)
  }
}

/**
 * Call a user-provided, potentially-async hook function.
 * We check for the length of arguments to see if the hook
 * expects a `done` callback. If true, the transition's end
 * will be determined by when the user calls that callback;
 * otherwise, the end is determined by the CSS transition or
 * animation.
 *
 * @param {String} type
 */

p.callHookWithCb = function (type) {
  var hook = this.hooks && this.hooks[type]
  if (hook) {
    if (hook.length > 1) {
      this.pendingJsCb = _.cancellable(this[type + 'Done'])
    }
    hook.call(this.vm, this.el, this.pendingJsCb)
  }
}

/**
 * Get an element's transition type based on the
 * calculated styles.
 *
 * @param {String} className
 * @return {Number}
 */

p.getCssTransitionType = function (className) {
  /* istanbul ignore if */
  if (
    !transitionEndEvent ||
    // skip CSS transitions if page is not visible -
    // this solves the issue of transitionend events not
    // firing until the page is visible again.
    // pageVisibility API is supported in IE10+, same as
    // CSS transitions.
    document.hidden ||
    // explicit js-only transition
    (this.hooks && this.hooks.css === false) ||
    // element is hidden
    isHidden(this.el)
  ) {
    return
  }
  var type = this.typeCache[className]
  if (type) return type
  var inlineStyles = this.el.style
  var computedStyles = window.getComputedStyle(this.el)
  var transDuration =
    inlineStyles[transDurationProp] ||
    computedStyles[transDurationProp]
  if (transDuration && transDuration !== '0s') {
    type = TYPE_TRANSITION
  } else {
    var animDuration =
      inlineStyles[animDurationProp] ||
      computedStyles[animDurationProp]
    if (animDuration && animDuration !== '0s') {
      type = TYPE_ANIMATION
    }
  }
  if (type) {
    this.typeCache[className] = type
  }
  return type
}

/**
 * Setup a CSS transitionend/animationend callback.
 *
 * @param {String} event
 * @param {Function} cb
 */

p.setupCssCb = function (event, cb) {
  this.pendingCssEvent = event
  var self = this
  var el = this.el
  var onEnd = this.pendingCssCb = function (e) {
    if (e.target === el) {
      _.off(el, event, onEnd)
      self.pendingCssEvent = self.pendingCssCb = null
      if (!self.pendingJsCb && cb) {
        cb()
      }
    }
  }
  _.on(el, event, onEnd)
}

/**
 * Check if an element is hidden - in that case we can just
 * skip the transition alltogether.
 *
 * @param {Element} el
 * @return {Boolean}
 */

function isHidden (el) {
  return el.style.display === 'none' ||
    el.style.visibility === 'hidden' ||
    el.hidden
}

module.exports = Transition

},{"../util":133,"./queue":127}],129:[function(require,module,exports){
(function (process){
var _ = require('./index')

/**
 * Check if an element is a component, if yes return its
 * component id.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {String|undefined}
 */

exports.commonTagRE = /^(div|p|span|img|a|br|ul|ol|li|h1|h2|h3|h4|h5|code|pre)$/
exports.checkComponent = function (el, options) {
  var tag = el.tagName.toLowerCase()
  if (tag === 'component') {
    // dynamic syntax
    var exp = el.getAttribute('is')
    el.removeAttribute('is')
    return exp
  } else if (
    !exports.commonTagRE.test(tag) &&
    _.resolveAsset(options, 'components', tag)
  ) {
    return tag
  /* eslint-disable no-cond-assign */
  } else if (tag = _.attr(el, 'component')) {
  /* eslint-enable no-cond-assign */
    return tag
  }
}

/**
 * Set a prop's initial value on a vm and its data object.
 * The vm may have inherit:true so we need to make sure
 * we don't accidentally overwrite parent value.
 *
 * @param {Vue} vm
 * @param {Object} prop
 * @param {*} value
 */

exports.initProp = function (vm, prop, value) {
  if (exports.assertProp(prop, value)) {
    var key = prop.path
    if (key in vm) {
      _.define(vm, key, value, true)
    } else {
      vm[key] = value
    }
    vm._data[key] = value
  }
}

/**
 * Assert whether a prop is valid.
 *
 * @param {Object} prop
 * @param {*} value
 */

exports.assertProp = function (prop, value) {
  // if a prop is not provided and is not required,
  // skip the check.
  if (prop.raw === null && !prop.required) {
    return true
  }
  var options = prop.options
  var type = options.type
  var valid = true
  var expectedType
  if (type) {
    if (type === String) {
      expectedType = 'string'
      valid = typeof value === expectedType
    } else if (type === Number) {
      expectedType = 'number'
      valid = typeof value === 'number'
    } else if (type === Boolean) {
      expectedType = 'boolean'
      valid = typeof value === 'boolean'
    } else if (type === Function) {
      expectedType = 'function'
      valid = typeof value === 'function'
    } else if (type === Object) {
      expectedType = 'object'
      valid = _.isPlainObject(value)
    } else if (type === Array) {
      expectedType = 'array'
      valid = _.isArray(value)
    } else {
      valid = value instanceof type
    }
  }
  if (!valid) {
    process.env.NODE_ENV !== 'production' && _.warn(
      'Invalid prop: type check failed for ' +
      prop.path + '="' + prop.raw + '".' +
      ' Expected ' + formatType(expectedType) +
      ', got ' + formatValue(value) + '.'
    )
    return false
  }
  var validator = options.validator
  if (validator) {
    if (!validator.call(null, value)) {
      process.env.NODE_ENV !== 'production' && _.warn(
        'Invalid prop: custom validator check failed for ' +
        prop.path + '="' + prop.raw + '"'
      )
      return false
    }
  }
  return true
}

function formatType (val) {
  return val
    ? val.charAt(0).toUpperCase() + val.slice(1)
    : 'custom type'
}

function formatValue (val) {
  return Object.prototype.toString.call(val).slice(8, -1)
}

}).call(this,require('_process'))

},{"./index":133,"_process":24}],130:[function(require,module,exports){
(function (process){
/**
 * Enable debug utilities.
 */

if (process.env.NODE_ENV !== 'production') {

  var config = require('../config')
  var hasConsole = typeof console !== 'undefined'

  /**
   * Log a message.
   *
   * @param {String} msg
   */

  exports.log = function (msg) {
    if (hasConsole && config.debug) {
      console.log('[Vue info]: ' + msg)
    }
  }

  /**
   * We've got a problem here.
   *
   * @param {String} msg
   */

  exports.warn = function (msg, e) {
    if (hasConsole && (!config.silent || config.debug)) {
      console.warn('[Vue warn]: ' + msg)
      /* istanbul ignore if */
      if (config.debug) {
        console.warn((e || new Error('Warning Stack Trace')).stack)
      }
    }
  }

  /**
   * Assert asset exists
   */

  exports.assertAsset = function (val, type, id) {
    /* istanbul ignore if */
    if (type === 'directive') {
      if (id === 'with') {
        exports.warn(
          'v-with has been deprecated in ^0.12.0. ' +
          'Use props instead.'
        )
        return
      }
      if (id === 'events') {
        exports.warn(
          'v-events has been deprecated in ^0.12.0. ' +
          'Pass down methods as callback props instead.'
        )
        return
      }
    }
    if (!val) {
      exports.warn('Failed to resolve ' + type + ': ' + id)
    }
  }
}

}).call(this,require('_process'))

},{"../config":84,"_process":24}],131:[function(require,module,exports){
(function (process){
var _ = require('./index')
var config = require('../config')

/**
 * Query an element selector if it's not an element already.
 *
 * @param {String|Element} el
 * @return {Element}
 */

exports.query = function (el) {
  if (typeof el === 'string') {
    var selector = el
    el = document.querySelector(el)
    if (!el) {
      process.env.NODE_ENV !== 'production' && _.warn(
        'Cannot find element: ' + selector
      )
    }
  }
  return el
}

/**
 * Check if a node is in the document.
 * Note: document.documentElement.contains should work here
 * but always returns false for comment nodes in phantomjs,
 * making unit tests difficult. This is fixed byy doing the
 * contains() check on the node's parentNode instead of
 * the node itself.
 *
 * @param {Node} node
 * @return {Boolean}
 */

exports.inDoc = function (node) {
  var doc = document.documentElement
  var parent = node && node.parentNode
  return doc === node ||
    doc === parent ||
    !!(parent && parent.nodeType === 1 && (doc.contains(parent)))
}

/**
 * Extract an attribute from a node.
 *
 * @param {Node} node
 * @param {String} attr
 */

exports.attr = function (node, attr) {
  attr = config.prefix + attr
  var val = node.getAttribute(attr)
  if (val !== null) {
    node.removeAttribute(attr)
  }
  return val
}

/**
 * Insert el before target
 *
 * @param {Element} el
 * @param {Element} target
 */

exports.before = function (el, target) {
  target.parentNode.insertBefore(el, target)
}

/**
 * Insert el after target
 *
 * @param {Element} el
 * @param {Element} target
 */

exports.after = function (el, target) {
  if (target.nextSibling) {
    exports.before(el, target.nextSibling)
  } else {
    target.parentNode.appendChild(el)
  }
}

/**
 * Remove el from DOM
 *
 * @param {Element} el
 */

exports.remove = function (el) {
  el.parentNode.removeChild(el)
}

/**
 * Prepend el to target
 *
 * @param {Element} el
 * @param {Element} target
 */

exports.prepend = function (el, target) {
  if (target.firstChild) {
    exports.before(el, target.firstChild)
  } else {
    target.appendChild(el)
  }
}

/**
 * Replace target with el
 *
 * @param {Element} target
 * @param {Element} el
 */

exports.replace = function (target, el) {
  var parent = target.parentNode
  if (parent) {
    parent.replaceChild(el, target)
  }
}

/**
 * Add event listener shorthand.
 *
 * @param {Element} el
 * @param {String} event
 * @param {Function} cb
 */

exports.on = function (el, event, cb) {
  el.addEventListener(event, cb)
}

/**
 * Remove event listener shorthand.
 *
 * @param {Element} el
 * @param {String} event
 * @param {Function} cb
 */

exports.off = function (el, event, cb) {
  el.removeEventListener(event, cb)
}

/**
 * Add class with compatibility for IE & SVG
 *
 * @param {Element} el
 * @param {Strong} cls
 */

exports.addClass = function (el, cls) {
  if (el.classList) {
    el.classList.add(cls)
  } else {
    var cur = ' ' + (el.getAttribute('class') || '') + ' '
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim())
    }
  }
}

/**
 * Remove class with compatibility for IE & SVG
 *
 * @param {Element} el
 * @param {Strong} cls
 */

exports.removeClass = function (el, cls) {
  if (el.classList) {
    el.classList.remove(cls)
  } else {
    var cur = ' ' + (el.getAttribute('class') || '') + ' '
    var tar = ' ' + cls + ' '
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ')
    }
    el.setAttribute('class', cur.trim())
  }
}

/**
 * Extract raw content inside an element into a temporary
 * container div
 *
 * @param {Element} el
 * @param {Boolean} asFragment
 * @return {Element}
 */

exports.extractContent = function (el, asFragment) {
  var child
  var rawContent
  /* istanbul ignore if */
  if (
    exports.isTemplate(el) &&
    el.content instanceof DocumentFragment
  ) {
    el = el.content
  }
  if (el.hasChildNodes()) {
    exports.trimNode(el)
    rawContent = asFragment
      ? document.createDocumentFragment()
      : document.createElement('div')
    /* eslint-disable no-cond-assign */
    while (child = el.firstChild) {
    /* eslint-enable no-cond-assign */
      rawContent.appendChild(child)
    }
  }
  return rawContent
}

/**
 * Trim possible empty head/tail textNodes inside a parent.
 *
 * @param {Node} node
 */

exports.trimNode = function (node) {
  trim(node, node.firstChild)
  trim(node, node.lastChild)
}

function trim (parent, node) {
  if (node && node.nodeType === 3 && !node.data.trim()) {
    parent.removeChild(node)
  }
}

/**
 * Check if an element is a template tag.
 * Note if the template appears inside an SVG its tagName
 * will be in lowercase.
 *
 * @param {Element} el
 */

exports.isTemplate = function (el) {
  return el.tagName &&
    el.tagName.toLowerCase() === 'template'
}

/**
 * Create an "anchor" for performing dom insertion/removals.
 * This is used in a number of scenarios:
 * - fragment instance
 * - v-html
 * - v-if
 * - component
 * - repeat
 *
 * @param {String} content
 * @param {Boolean} persist - IE trashes empty textNodes on
 *                            cloneNode(true), so in certain
 *                            cases the anchor needs to be
 *                            non-empty to be persisted in
 *                            templates.
 * @return {Comment|Text}
 */

exports.createAnchor = function (content, persist) {
  return config.debug
    ? document.createComment(content)
    : document.createTextNode(persist ? ' ' : '')
}

}).call(this,require('_process'))

},{"../config":84,"./index":133,"_process":24}],132:[function(require,module,exports){
// can we use __proto__?
exports.hasProto = '__proto__' in {}

// Browser environment sniffing
var inBrowser = exports.inBrowser =
  typeof window !== 'undefined' &&
  Object.prototype.toString.call(window) !== '[object Object]'

exports.isIE9 =
  inBrowser &&
  navigator.userAgent.toLowerCase().indexOf('msie 9.0') > 0

exports.isAndroid =
  inBrowser &&
  navigator.userAgent.toLowerCase().indexOf('android') > 0

// Transition property/event sniffing
if (inBrowser && !exports.isIE9) {
  var isWebkitTrans =
    window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  var isWebkitAnim =
    window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  exports.transitionProp = isWebkitTrans
    ? 'WebkitTransition'
    : 'transition'
  exports.transitionEndEvent = isWebkitTrans
    ? 'webkitTransitionEnd'
    : 'transitionend'
  exports.animationProp = isWebkitAnim
    ? 'WebkitAnimation'
    : 'animation'
  exports.animationEndEvent = isWebkitAnim
    ? 'webkitAnimationEnd'
    : 'animationend'
}

/**
 * Defer a task to execute it asynchronously. Ideally this
 * should be executed as a microtask, so we leverage
 * MutationObserver if it's available, and fallback to
 * setTimeout(0).
 *
 * @param {Function} cb
 * @param {Object} ctx
 */

exports.nextTick = (function () {
  var callbacks = []
  var pending = false
  var timerFunc
  function nextTickHandler () {
    pending = false
    var copies = callbacks.slice(0)
    callbacks = []
    for (var i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }
  /* istanbul ignore if */
  if (typeof MutationObserver !== 'undefined') {
    var counter = 1
    var observer = new MutationObserver(nextTickHandler)
    var textNode = document.createTextNode(counter)
    observer.observe(textNode, {
      characterData: true
    })
    timerFunc = function () {
      counter = (counter + 1) % 2
      textNode.data = counter
    }
  } else {
    timerFunc = setTimeout
  }
  return function (cb, ctx) {
    var func = ctx
      ? function () { cb.call(ctx) }
      : cb
    callbacks.push(func)
    if (pending) return
    pending = true
    timerFunc(nextTickHandler, 0)
  }
})()

},{}],133:[function(require,module,exports){
var lang = require('./lang')
var extend = lang.extend

extend(exports, lang)
extend(exports, require('./env'))
extend(exports, require('./dom'))
extend(exports, require('./options'))
extend(exports, require('./component'))
extend(exports, require('./debug'))

},{"./component":129,"./debug":130,"./dom":131,"./env":132,"./lang":134,"./options":135}],134:[function(require,module,exports){
/**
 * Check if a string starts with $ or _
 *
 * @param {String} str
 * @return {Boolean}
 */

exports.isReserved = function (str) {
  var c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5F
}

/**
 * Guard text output, make sure undefined outputs
 * empty string
 *
 * @param {*} value
 * @return {String}
 */

exports.toString = function (value) {
  return value == null
    ? ''
    : value.toString()
}

/**
 * Check and convert possible numeric strings to numbers
 * before setting back to data
 *
 * @param {*} value
 * @return {*|Number}
 */

exports.toNumber = function (value) {
  if (typeof value !== 'string') {
    return value
  } else {
    var parsed = Number(value)
    return isNaN(parsed)
      ? value
      : parsed
  }
}

/**
 * Convert string boolean literals into real booleans.
 *
 * @param {*} value
 * @return {*|Boolean}
 */

exports.toBoolean = function (value) {
  return value === 'true'
    ? true
    : value === 'false'
      ? false
      : value
}

/**
 * Strip quotes from a string
 *
 * @param {String} str
 * @return {String | false}
 */

exports.stripQuotes = function (str) {
  var a = str.charCodeAt(0)
  var b = str.charCodeAt(str.length - 1)
  return a === b && (a === 0x22 || a === 0x27)
    ? str.slice(1, -1)
    : false
}

/**
 * Camelize a hyphen-delmited string.
 *
 * @param {String} str
 * @return {String}
 */

exports.camelize = function (str) {
  return str.replace(/-(\w)/g, toUpper)
}

function toUpper (_, c) {
  return c ? c.toUpperCase() : ''
}

/**
 * Hyphenate a camelCase string.
 *
 * @param {String} str
 * @return {String}
 */

exports.hyphenate = function (str) {
  return str
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * Converts hyphen/underscore/slash delimitered names into
 * camelized classNames.
 *
 * e.g. my-component => MyComponent
 *      some_else    => SomeElse
 *      some/comp    => SomeComp
 *
 * @param {String} str
 * @return {String}
 */

var classifyRE = /(?:^|[-_\/])(\w)/g
exports.classify = function (str) {
  return str.replace(classifyRE, toUpper)
}

/**
 * Simple bind, faster than native
 *
 * @param {Function} fn
 * @param {Object} ctx
 * @return {Function}
 */

exports.bind = function (fn, ctx) {
  return function (a) {
    var l = arguments.length
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
}

/**
 * Convert an Array-like object to a real Array.
 *
 * @param {Array-like} list
 * @param {Number} [start] - start index
 * @return {Array}
 */

exports.toArray = function (list, start) {
  start = start || 0
  var i = list.length - start
  var ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

/**
 * Mix properties into target object.
 *
 * @param {Object} to
 * @param {Object} from
 */

exports.extend = function (to, from) {
  for (var key in from) {
    to[key] = from[key]
  }
  return to
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 *
 * @param {*} obj
 * @return {Boolean}
 */

exports.isObject = function (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 *
 * @param {*} obj
 * @return {Boolean}
 */

var toString = Object.prototype.toString
var OBJECT_STRING = '[object Object]'
exports.isPlainObject = function (obj) {
  return toString.call(obj) === OBJECT_STRING
}

/**
 * Array type check.
 *
 * @param {*} obj
 * @return {Boolean}
 */

exports.isArray = Array.isArray

/**
 * Define a non-enumerable property
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 * @param {Boolean} [enumerable]
 */

exports.define = function (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

/**
 * Debounce a function so it only gets called after the
 * input stops arriving after the given wait period.
 *
 * @param {Function} func
 * @param {Number} wait
 * @return {Function} - the debounced function
 */

exports.debounce = function (func, wait) {
  var timeout, args, context, timestamp, result
  var later = function () {
    var last = Date.now() - timestamp
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      result = func.apply(context, args)
      if (!timeout) context = args = null
    }
  }
  return function () {
    context = this
    args = arguments
    timestamp = Date.now()
    if (!timeout) {
      timeout = setTimeout(later, wait)
    }
    return result
  }
}

/**
 * Manual indexOf because it's slightly faster than
 * native.
 *
 * @param {Array} arr
 * @param {*} obj
 */

exports.indexOf = function (arr, obj) {
  var i = arr.length
  while (i--) {
    if (arr[i] === obj) return i
  }
  return -1
}

/**
 * Make a cancellable version of an async callback.
 *
 * @param {Function} fn
 * @return {Function}
 */

exports.cancellable = function (fn) {
  var cb = function () {
    if (!cb.cancelled) {
      return fn.apply(this, arguments)
    }
  }
  cb.cancel = function () {
    cb.cancelled = true
  }
  return cb
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 *
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 */

exports.looseEqual = function (a, b) {
  /* eslint-disable eqeqeq */
  return a == b || (
    exports.isObject(a) && exports.isObject(b)
      ? JSON.stringify(a) === JSON.stringify(b)
      : false
  )
  /* eslint-enable eqeqeq */
}

},{}],135:[function(require,module,exports){
(function (process){
var _ = require('./index')
var config = require('../config')
var extend = _.extend

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 *
 * All strategy functions follow the same signature:
 *
 * @param {*} parentVal
 * @param {*} childVal
 * @param {Vue} [vm]
 */

var strats = config.optionMergeStrategies = Object.create(null)

/**
 * Helper that recursively merges two data objects together.
 */

function mergeData (to, from) {
  var key, toVal, fromVal
  for (key in from) {
    toVal = to[key]
    fromVal = from[key]
    if (!to.hasOwnProperty(key)) {
      to.$add(key, fromVal)
    } else if (_.isObject(toVal) && _.isObject(fromVal)) {
      mergeData(toVal, fromVal)
    }
  }
  return to
}

/**
 * Data
 */

strats.data = function (parentVal, childVal, vm) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && _.warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.'
      )
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        childVal.call(this),
        parentVal.call(this)
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : undefined
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

/**
 * El
 */

strats.el = function (parentVal, childVal, vm) {
  if (!vm && childVal && typeof childVal !== 'function') {
    process.env.NODE_ENV !== 'production' && _.warn(
      'The "el" option should be a function ' +
      'that returns a per-instance value in component ' +
      'definitions.'
    )
    return
  }
  var ret = childVal || parentVal
  // invoke the element factory if this is instance merge
  return vm && typeof ret === 'function'
    ? ret.call(vm)
    : ret
}

/**
 * Hooks and param attributes are merged as arrays.
 */

strats.created =
strats.ready =
strats.attached =
strats.detached =
strats.beforeCompile =
strats.compiled =
strats.beforeDestroy =
strats.destroyed =
strats.props = function (parentVal, childVal) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : _.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

/**
 * 0.11 deprecation warning
 */

strats.paramAttributes = function () {
  /* istanbul ignore next */
  process.env.NODE_ENV !== 'production' && _.warn(
    '"paramAttributes" option has been deprecated in 0.12. ' +
    'Use "props" instead.'
  )
}

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */

function mergeAssets (parentVal, childVal) {
  var res = Object.create(parentVal)
  return childVal
    ? extend(res, guardArrayAssets(childVal))
    : res
}

config._assetTypes.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})

/**
 * Events & Watchers.
 *
 * Events & watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */

strats.watch =
strats.events = function (parentVal, childVal) {
  if (!childVal) return parentVal
  if (!parentVal) return childVal
  var ret = {}
  extend(ret, parentVal)
  for (var key in childVal) {
    var parent = ret[key]
    var child = childVal[key]
    if (parent && !_.isArray(parent)) {
      parent = [parent]
    }
    ret[key] = parent
      ? parent.concat(child)
      : [child]
  }
  return ret
}

/**
 * Other object hashes.
 */

strats.methods =
strats.computed = function (parentVal, childVal) {
  if (!childVal) return parentVal
  if (!parentVal) return childVal
  var ret = Object.create(parentVal)
  extend(ret, childVal)
  return ret
}

/**
 * Default strategy.
 */

var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
}

/**
 * Make sure component options get converted to actual
 * constructors.
 *
 * @param {Object} options
 */

function guardComponents (options) {
  if (options.components) {
    var components = options.components =
      guardArrayAssets(options.components)
    var def
    var ids = Object.keys(components)
    for (var i = 0, l = ids.length; i < l; i++) {
      var key = ids[i]
      if (_.commonTagRE.test(key)) {
        process.env.NODE_ENV !== 'production' && _.warn(
          'Do not use built-in HTML elements as component ' +
          'id: ' + key
        )
        continue
      }
      def = components[key]
      if (_.isPlainObject(def)) {
        def.id = def.id || key
        components[key] = def._Ctor || (def._Ctor = _.Vue.extend(def))
      }
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 *
 * @param {Object} options
 */

function guardProps (options) {
  var props = options.props
  if (_.isPlainObject(props)) {
    options.props = Object.keys(props).map(function (key) {
      var val = props[key]
      if (!_.isPlainObject(val)) {
        val = { type: val }
      }
      val.name = key
      return val
    })
  } else if (_.isArray(props)) {
    options.props = props.map(function (prop) {
      return typeof prop === 'string'
        ? { name: prop }
        : prop
    })
  }
}

/**
 * Guard an Array-format assets option and converted it
 * into the key-value Object format.
 *
 * @param {Object|Array} assets
 * @return {Object}
 */

function guardArrayAssets (assets) {
  if (_.isArray(assets)) {
    var res = {}
    var i = assets.length
    var asset
    while (i--) {
      asset = assets[i]
      var id = asset.id || (asset.options && asset.options.id)
      if (!id) {
        process.env.NODE_ENV !== 'production' && _.warn(
          'Array-syntax assets must provide an id field.'
        )
      } else {
        res[id] = asset
      }
    }
    return res
  }
  return assets
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 *
 * @param {Object} parent
 * @param {Object} child
 * @param {Vue} [vm] - if vm is present, indicates this is
 *                     an instantiation merge.
 */

exports.mergeOptions = function merge (parent, child, vm) {
  guardComponents(child)
  guardProps(child)
  var options = {}
  var key
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = merge(parent, child.mixins[i], vm)
    }
  }
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!(parent.hasOwnProperty(key))) {
      mergeField(key)
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 *
 * @param {Object} options
 * @param {String} type
 * @param {String} id
 * @return {Object|Function}
 */

exports.resolveAsset = function resolve (options, type, id) {
  var camelizedId = _.camelize(id)
  var pascalizedId = camelizedId.charAt(0).toUpperCase() + camelizedId.slice(1)
  var assets = options[type]
  var asset = assets[id] || assets[camelizedId] || assets[pascalizedId]
  while (
    !asset &&
    options._parent &&
    (!config.strict || options._repeat)
  ) {
    options = (options._context || options._parent).$options
    assets = options[type]
    asset = assets[id] || assets[camelizedId] || assets[pascalizedId]
  }
  return asset
}

}).call(this,require('_process'))

},{"../config":84,"./index":133,"_process":24}],136:[function(require,module,exports){
var _ = require('./util')
var extend = _.extend

/**
 * The exposed Vue constructor.
 *
 * API conventions:
 * - public API methods/properties are prefiexed with `$`
 * - internal methods/properties are prefixed with `_`
 * - non-prefixed properties are assumed to be proxied user
 *   data.
 *
 * @constructor
 * @param {Object} [options]
 * @public
 */

function Vue (options) {
  this._init(options)
}

/**
 * Mixin global API
 */

extend(Vue, require('./api/global'))

/**
 * Vue and every constructor that extends Vue has an
 * associated options object, which can be accessed during
 * compilation steps as `this.constructor.options`.
 *
 * These can be seen as the default options of every
 * Vue instance.
 */

Vue.options = {
  replace: true,
  directives: require('./directives'),
  elementDirectives: require('./element-directives'),
  filters: require('./filters'),
  transitions: {},
  components: {},
  partials: {}
}

/**
 * Build up the prototype
 */

var p = Vue.prototype

/**
 * $data has a setter which does a bunch of
 * teardown/setup work
 */

Object.defineProperty(p, '$data', {
  get: function () {
    return this._data
  },
  set: function (newData) {
    if (newData !== this._data) {
      this._setData(newData)
    }
  }
})

/**
 * Mixin internal instance methods
 */

extend(p, require('./instance/init'))
extend(p, require('./instance/events'))
extend(p, require('./instance/scope'))
extend(p, require('./instance/compile'))
extend(p, require('./instance/misc'))

/**
 * Mixin public API methods
 */

extend(p, require('./api/data'))
extend(p, require('./api/dom'))
extend(p, require('./api/events'))
extend(p, require('./api/child'))
extend(p, require('./api/lifecycle'))

module.exports = _.Vue = Vue

},{"./api/child":72,"./api/data":73,"./api/dom":74,"./api/events":75,"./api/global":76,"./api/lifecycle":77,"./directives":93,"./element-directives":108,"./filters":111,"./instance/compile":112,"./instance/events":113,"./instance/init":114,"./instance/misc":115,"./instance/scope":116,"./util":133}],137:[function(require,module,exports){
(function (process){
var _ = require('./util')
var config = require('./config')
var Dep = require('./observer/dep')
var expParser = require('./parsers/expression')
var batcher = require('./batcher')
var uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 *
 * @param {Vue} vm
 * @param {String} expression
 * @param {Function} cb
 * @param {Object} options
 *                 - {Array} filters
 *                 - {Boolean} twoWay
 *                 - {Boolean} deep
 *                 - {Boolean} user
 *                 - {Boolean} sync
 *                 - {Boolean} lazy
 *                 - {Function} [preProcess]
 * @constructor
 */

function Watcher (vm, expOrFn, cb, options) {
  // mix in options
  if (options) {
    _.extend(this, options)
  }
  var isFn = typeof expOrFn === 'function'
  this.vm = vm
  vm._watchers.push(this)
  this.expression = isFn ? expOrFn.toString() : expOrFn
  this.cb = cb
  this.id = ++uid // uid for batching
  this.active = true
  this.dirty = this.lazy // for lazy watchers
  this.deps = Object.create(null)
  this.newDeps = null
  this.prevError = null // for async error stacks
  // parse expression for getter/setter
  if (isFn) {
    this.getter = expOrFn
    this.setter = undefined
  } else {
    var res = expParser.parse(expOrFn, this.twoWay)
    this.getter = res.get
    this.setter = res.set
  }
  this.value = this.lazy
    ? undefined
    : this.get()
  // state for avoiding false triggers for deep and Array
  // watchers during vm._digest()
  this.queued = this.shallow = false
}

/**
 * Add a dependency to this directive.
 *
 * @param {Dep} dep
 */

Watcher.prototype.addDep = function (dep) {
  var id = dep.id
  if (!this.newDeps[id]) {
    this.newDeps[id] = dep
    if (!this.deps[id]) {
      this.deps[id] = dep
      dep.addSub(this)
    }
  }
}

/**
 * Evaluate the getter, and re-collect dependencies.
 */

Watcher.prototype.get = function () {
  this.beforeGet()
  var vm = this.vm
  var value
  try {
    value = this.getter.call(vm, vm)
  } catch (e) {
    if (
      process.env.NODE_ENV !== 'production' &&
      config.warnExpressionErrors
    ) {
      _.warn(
        'Error when evaluating expression "' +
        this.expression + '". ' +
        (config.debug
          ? ''
          : 'Turn on debug mode to see stack trace.'
        ), e
      )
    }
  }
  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  if (this.deep) {
    traverse(value)
  }
  if (this.preProcess) {
    value = this.preProcess(value)
  }
  if (this.filters) {
    value = vm._applyFilters(value, null, this.filters, false)
  }
  this.afterGet()
  return value
}

/**
 * Set the corresponding value with the setter.
 *
 * @param {*} value
 */

Watcher.prototype.set = function (value) {
  var vm = this.vm
  if (this.filters) {
    value = vm._applyFilters(
      value, this.value, this.filters, true)
  }
  try {
    this.setter.call(vm, vm, value)
  } catch (e) {
    if (
      process.env.NODE_ENV !== 'production' &&
      config.warnExpressionErrors
    ) {
      _.warn(
        'Error when evaluating setter "' +
        this.expression + '"', e
      )
    }
  }
}

/**
 * Prepare for dependency collection.
 */

Watcher.prototype.beforeGet = function () {
  Dep.target = this
  this.newDeps = Object.create(null)
}

/**
 * Clean up for dependency collection.
 */

Watcher.prototype.afterGet = function () {
  Dep.target = null
  var ids = Object.keys(this.deps)
  var i = ids.length
  while (i--) {
    var id = ids[i]
    if (!this.newDeps[id]) {
      this.deps[id].removeSub(this)
    }
  }
  this.deps = this.newDeps
}

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 *
 * @param {Boolean} shallow
 */

Watcher.prototype.update = function (shallow) {
  if (this.lazy) {
    this.dirty = true
  } else if (this.sync || !config.async) {
    this.run()
  } else {
    // if queued, only overwrite shallow with non-shallow,
    // but not the other way around.
    this.shallow = this.queued
      ? shallow
        ? this.shallow
        : false
      : !!shallow
    this.queued = true
    // record before-push error stack in debug mode
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.debug) {
      this.prevError = new Error('[vue] async stack trace')
    }
    batcher.push(this)
  }
}

/**
 * Batcher job interface.
 * Will be called by the batcher.
 */

Watcher.prototype.run = function () {
  if (this.active) {
    var value = this.get()
    if (
      value !== this.value ||
      // Deep watchers and Array watchers should fire even
      // when the value is the same, because the value may
      // have mutated; but only do so if this is a
      // non-shallow update (caused by a vm digest).
      ((_.isArray(value) || this.deep) && !this.shallow)
    ) {
      // set new value
      var oldValue = this.value
      this.value = value
      // in debug + async mode, when a watcher callbacks
      // throws, we also throw the saved before-push error
      // so the full cross-tick stack trace is available.
      var prevError = this.prevError
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' &&
          config.debug && prevError) {
        this.prevError = null
        try {
          this.cb.call(this.vm, value, oldValue)
        } catch (e) {
          _.nextTick(function () {
            throw prevError
          }, 0)
          throw e
        }
      } else {
        this.cb.call(this.vm, value, oldValue)
      }
    }
    this.queued = this.shallow = false
  }
}

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */

Watcher.prototype.evaluate = function () {
  // avoid overwriting another watcher that is being
  // collected.
  var current = Dep.target
  this.value = this.get()
  this.dirty = false
  Dep.target = current
}

/**
 * Depend on all deps collected by this watcher.
 */

Watcher.prototype.depend = function () {
  var depIds = Object.keys(this.deps)
  var i = depIds.length
  while (i--) {
    this.deps[depIds[i]].depend()
  }
}

/**
 * Remove self from all dependencies' subcriber list.
 */

Watcher.prototype.teardown = function () {
  if (this.active) {
    // remove self from vm's watcher list
    // we can skip this if the vm if being destroyed
    // which can improve teardown performance.
    if (!this.vm._isBeingDestroyed) {
      this.vm._watchers.$remove(this)
    }
    var depIds = Object.keys(this.deps)
    var i = depIds.length
    while (i--) {
      this.deps[depIds[i]].removeSub(this)
    }
    this.active = false
    this.vm = this.cb = this.value = null
  }
}

/**
 * Recrusively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 *
 * @param {Object} obj
 */

function traverse (obj) {
  var key, val, i
  for (key in obj) {
    val = obj[key]
    if (_.isArray(val)) {
      i = val.length
      while (i--) traverse(val[i])
    } else if (_.isObject(val)) {
      traverse(val)
    }
  }
}

module.exports = Watcher

}).call(this,require('_process'))

},{"./batcher":78,"./config":84,"./observer/dep":118,"./parsers/expression":122,"./util":133,"_process":24}]},{},[1])


//# sourceMappingURL=all.js.map
