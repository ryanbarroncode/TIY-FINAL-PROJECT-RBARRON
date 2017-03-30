var React = require('react');
var Backbone = require('backbone');

var User = require('../models/users.js').User;

class Header extends React.Component{
  constructor(props){
    super(props);
    this.logOut = this.logOut.bind(this);
  }
  logOut(e){
    e.preventDefault();

    //ajax call to parse logout endpoint
    User.logout();

    // Clear local storage
    localStorage.clear();

    Backbone.history.navigate('signup/', {trigger: true});
  }
  render(){
    var user = User.current();
    return(
      <nav className="navbar top-header navbar-default navbar-static-top">
        <div className="container-fluid">
          <div className="navbar-header bodytext">
            <a className="navbar-brand " href="#generate/">RandoMovies</a>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li><a className="bodytext" href="#">TV Shows <span className="sr-only">(current)</span></a></li>
              <li className="bodytext"><a  href="#generate/">Movies</a></li>
            </ul>

            <ul className="nav navbar-nav navbar-right">
              <li><a href="#signup/" onClick={this.logOut}>Logout</a></li>
              <li className="dropdown">
                <a href="#account/" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{user.get('name')}</a>
                <ul className="dropdown-menu">
                  <li><a href="#">Action</a></li>
                  <li><a href="#">Another action</a></li>
                  <li><a href="#">Something else here</a></li>
                  <li role="separator" className="divider"></li>
                  <li><a href="#">Separated link</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

      </nav>
    )
  }
}

module.exports = {
  Header
};
