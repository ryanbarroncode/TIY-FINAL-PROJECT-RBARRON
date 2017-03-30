var $ = require('jquery');
var Backbone = require('backbone');

var API_KEY = 'c1c07dfc1b57c4feebc37d588f5dd964'

var Api = Backbone.Model.extend({
  urlRoot: 'https://api.themoviedb.org/3'
})

var ApiCollection = Backbone.Collection.extend({
  urlString: '',
  initialize: function(options) {
    var defaults = {
      api_key_string: 'c1c07dfc1b57c4feebc37d588f5dd964',
    }
    $.extend(this, defaults, options);
  },

  url: function() {
    var url = 'https://api.themoviedb.org/3';

    if(this.urlString.length > 0) {
      url += this.urlString;
      this.urlString = '';
    }

    return url;
  },

  sync: function(method, collection, options) {
   options.dataType = "jsonp";
   return Backbone.sync(method, collection, options);
  },

  parseGenres: function() {
    this.urlString = '/genre/movie/list?api_key=' + this.api_key_string;
    return this;
  },

  parseGenreSelection: function(key) {
    this.urlString = '/discover/movie?with_genres=' + key + '&sort_by=vote_average.desc&vote_count.gte=10&api_key=' + this.api_key_string;
    return this;
  }

});

module.exports = {
  ApiCollection,
  Api
}
