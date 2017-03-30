var Backbone = require('backbone');
var $ = require('jquery');

var ApiCollection = require('./models/api');

// Lets the router do its job
require('./router');

// Dom Ready
$(function(){
  Backbone.history.start();
});
