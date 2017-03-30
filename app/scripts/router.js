var React = require('react')
var ReactDOM = require('react-dom');
var Backbone = require('backbone');
var $ = require('jquery');

var User = require('./models/users').User;
var parse = require('./parse');
// Controllers
// var MarketingContainer = require('./components/index.jsx').MarketingContainer;
var LogInContainer = require('./components/signin.jsx').LogInContainer;
var GenerateTitleContainer = require('./components/generate_title.jsx').GenerateTitleContainer;
var AccountContainer = require('./components/account.jsx').AccountContainer;

var AppRouter = Backbone.Router.extend({
  routes:{
    '': 'index',
    'signup/': 'signup',
    'generate/': 'generate',
    'account/': 'account'
},

initialize: function(){
   var user = User.current();

   if(user){
    //  If user is logged in, create a session token to store their info
     parse.parse.initialize({
       sessionId: user.get('sessionToken'),
       BASE_API_URL: 'https://ryanbarroncode.herokuapp.com'
     });
   } else {
     parse.parse.initialize({
       BASE_API_URL: 'https://ryanbarroncode.herokuapp.com'
     });
   }

 },
  index: function(){
   ReactDOM.render(
     React.createElement(LogInContainer),
     document.getElementById('app')
   )
 },

 generate :function(){
   ReactDOM.render(
     React.createElement(GenerateTitleContainer),
     document.getElementById('app')
   )
 },

 signup: function(){
   ReactDOM.render(
     React.createElement(LogInContainer),
     document.getElementById('app')
   )
 },

 account: function(){
   ReactDOM.render(
     React.createElement(AccountContainer),
     document.getElementById('app')
   )
 }

 });



var appRouter = new AppRouter();

module.exports = {
  appRouter
}
