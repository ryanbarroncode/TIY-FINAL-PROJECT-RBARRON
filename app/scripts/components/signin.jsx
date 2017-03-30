var $ = require('jquery');
var React = require('react');
var Backbone = require('backbone');

var User = require('../models/users.js').User;
var parse = require('../parse.js')
/* This is the main container that holds the page together */

class LogInContainer extends React.Component{
  constructor(props){
    super(props);

    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
  }

  login(formData){
    // console.log('trying to login', formData);
    User.login(formData, function(){
      Backbone.history.navigate('generate/', {trigger: true});
    });
  }

  signup(formData){
   var user = new User(formData);
   user.save().then(function(data){
     localStorage.setItem('user', JSON.stringify(data));
     Backbone.history.navigate('generate/', {trigger: true});
   });
  }

  render(){
    return(
      <div className="container ">
        <div className="row ">
          <div className="col-md-12 ">
            <div >
              <ul className="flexcontainer">
            <li><a href="#generate/"><h1>RandoMovie</h1></a></li>
            <li><a href="#generate/"></a><h2>Est. 2017</h2></li>
            </ul>
            </div>
          </div>

          <LoginForm action={this.login}/>
          <SignUpForm action={this.signup}/>





        </div>
      </div>

    )
  }
};

class SignUpForm extends React.Component{
  constructor(props){
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);

    this.state = {
      username: '',
      password: '',
      name: ''
    };
  }



      handleSubmit(e){
       e.preventDefault();
       // input data.... this.state
       this.props.action(this.state);
      }

      handleEmailChange(e){
       this.setState({username: e.target.value});

      }

      handlePasswordChange(e){
        this.setState({password: e.target.value});
      }

      handleNameChange(e){
        this.setState({name: e.target.value});
      }

  render(){
    return(
      <div className="col-md-4 well-form-right">
        <h1>Signup</h1>
        <form className="well" onSubmit={this.handleSubmit} id="signup">
          <div className="form-group">
            <label id="signup-email" htmlFor="email">Email</label>
            <input onChange={this.handleEmailChange} className="form-control" name="email" id="email-signup" type="email" placeholder="Email" />
          </div>
          <div className="form-group">
            <label id="signup-password" htmlFor="password">Password</label>
            <input onChange={this.handlePasswordChange} className="form-control" name="password" id="password-signup" type="password" placeholder="Password" />
          </div>
          <div className="form-group">
            <label id="signup-name" htmlFor="name">RandoName</label>
            <input onChange={this.handleNameChange} className="form-control" name="name" id="name-signup" type="name" placeholder="Nickname" />
          </div>

          <input className="btn btn-primary" type="submit" value="signup"/>

        </form>
      </div>
    )
  }
};



class LoginForm extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      username: '',
      password: ''
    };

  }

  handleLoginSubmit(e){
   e.preventDefault();
   // input data.... this.state
   this.props.action(this.state);
  }

  handleLoginUsernameChange(e){
    // console.log(e.target.value);
    this.setState({username: e.target.value});
  }

  handleLoginPasswordChange(e){
    this.setState({password: e.target.value})
  }

  render(){
    return(
      <div className="col-md-6 ">
        <h1>Login</h1>
          <form className="well" onSubmit={this.handleLoginSubmit.bind(this)} id="login">
            <div className="form-group">
              <label htmlFor="email-login">Email</label>
              <input onChange={this.handleLoginUsernameChange.bind(this)} className="form-control" name="username" id="email-login" type="username" placeholder="Email" />
            </div>
            <div className="form-group">
              <label htmlFor="password-login">Password</label>
              <input onChange={this.handleLoginPasswordChange.bind(this)} className="form-control" name="password" id="password-login" type="password" placeholder="Password" />
            </div>
            <input className="btn btn-primary" type="submit" value="Login" />
              <p>Need an Account? <a href="#signup/">Signup</a></p>

          </form>
      </div>
    )
  }
};



module.exports = {
  LogInContainer
};
