
var $ = require('jquery');
var Backbone = require('backbone');

var parse = require('../parse.js');

var User = parse.ParseModel.extend({
  idAttribute: 'objectId',
  urlRoot: 'https://ryanbarroncode.herokuapp.com/users'
  },{
  login: function(credentials, callback){
    var url = 'https://ryanbarroncode.herokuapp.com' + '/login?' + $.param(credentials)
    $.get(url).then(data => {
     var user = new User(data);
     User.store(user);
     callback();
   });
 },

 signup: function(credentials, callback){
    var newUser = new User(credentials);
    newUser.save().then(() => {
      User.store(newUser);
      callback(newUser);
    });
    return newUser;
  },

  logout: function(){
      var url = 'https://ryanbarroncode.herokuapp.com' + '/logout?';
      $.post(url).then(event=>console.log('logged out'));
  },

  store: function(user){
    localStorage.setItem('user', JSON.stringify(user.toJSON()));
  },
  current: function(){
    var user = localStorage.getItem('user');

    // if no user in local storage, bail
    if(!user){
      return false;
    }

    user = new User(JSON.parse(user));

    // If we don't have a token, bail
    if(!user.get('sessionToken')){
      return false;
    }

    return user;
  }
});

module.exports = {
  User
};
