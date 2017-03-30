/**
 * Parse API setup utility
 */
var $ = require('jquery');
var Backbone = require('backbone');

var User = require('./models/users').User

var parse = {
  serverURL: '',
  initialize: function(config){
    config = config || {};

    if(config.serverURL){
      this.serverURL = config.serverURL;
    }

    $.ajaxSetup({
      beforeSend: function(xhr){
        xhr.setRequestHeader("X-Parse-Application-Id", "tiyryan");
        xhr.setRequestHeader("X-Parse-REST-API-Key", "slumber");

        if(config.sessionId){
          xhr.setRequestHeader("X-Parse-Session-Token", config.sessionId);
        }
      }
    });
  },
  deinitialize: function(){
    $.ajaxSetup({
      beforeSend: function(xhr){
        xhr.setRequestHeader("X-Parse-Application-Id", null);
        xhr.setRequestHeader("X-Parse-REST-API-Key", null);
        xhr.setRequestHeader("X-Parse-Session-Token", null);
      }
    });
  }
}

var ParseModel = Backbone.Model.extend({
  idAttribute: 'objectId',
  sync: function(){
    var User = require('./models/users').User;
    var user = User.current();

    if(user){
      parse.initialize({sessionId: user.get('sessionToken')});
    }else{
      parse.initialize();
    }

    var xhr = Backbone.Model.prototype.sync.apply(this, arguments);

    parse.deinitialize();

    return xhr;
  },
  save: function(key, val, options){
    delete this.attributes.createdAt;
    delete this.attributes.updatedAt;

    return Backbone.Model.prototype.save.apply(this, arguments);
  },
  setPointer: function(field, parseClass, objectId){
    var pointerObject = {
      "__type": "Pointer",
      "className": parseClass,
      "objectId": objectId
    };

    this.set(field, pointerObject);

    return this;
  }
});

var ParseCollection = Backbone.Collection.extend({
  whereClause: {},
  parseWhere: function(field, value, objectId){
    // If an objectId is passed in then we are building a pointer where
    if(objectId){
      value = {
        field: field,
        className: value,
        objectId: objectId,
        '__type': 'Pointer'
      };
    }

    // // Check if the field has a search option set
    // if(field.indexOf('$') !== -1){
    //   var search = field.split('$');
    //   field = search[0];
    //   var comparison = '$' + search[1];
    //
    //   var clause = {};
    //   clause[comparison] = value;
    //   value = clause;
    // }

    this.whereClause[field] = value;

    return this;
  },
  url: function(){
    var url = this.baseUrl;

    if(Object.keys(this.whereClause).length > 0){
      url += '?where=' + JSON.stringify(this.whereClause);
      this.whereClause = {};
    }

    return url;
  },
  parse: function(data){
    return data.results;
  },
  sync: function(){
    var User = require('./models/users').User;
    var user = User.current();

    if(user){
      parse.initialize({sessionId: user.get('sessionToken')});
    }else{
      parse.initialize();
    }

    var xhr = Backbone.Collection.prototype.sync.apply(this, arguments);

    parse.deinitialize();

    return xhr;
  },
});


module.exports = {
  parse,
  ParseModel,
  ParseCollection
};
