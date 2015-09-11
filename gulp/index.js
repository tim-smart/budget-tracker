'use strict';

var fs      = require('fs');
var path    = require('path');
var scripts = require('./util/script-filter.js');
var tasks   = fs.readdirSync(path.join(__dirname, 'tasks')).filter(scripts);

tasks.forEach(function(task) {
    require('./tasks/' + task);
});
