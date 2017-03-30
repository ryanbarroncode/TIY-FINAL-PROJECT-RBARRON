var React = require('react');
var Backbone = require('backbone');

var User = require('../models/users').User;
var Header = require('../layouts/header.jsx').Header;
var ParseFile = require('../parse').ParseFile;

var parse = require('../parse');

class AccountContainer extends React.Component{
constructor(props){
  super(props)

  var user = new User();
  var userId = JSON.parse(localStorage.getItem('user')).objectId;

  user.set('objectId', userId);
  user.fetch().then(()=>{
    this.setState({ user: user });

    console.log('after fetch', user);
    if(user.get('imageUrl')) {
      console.log('firing state change');
      this.setState({ image: true });
      this.setState({ preview: user.get('imageUrl')})
    }
  })

  this.state = {
    pic: null,
    preview: null,
    image: false
  }

  this.handlePicChange = this.handlePicChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  this.deleteUser = this.deleteUser.bind(this);
  this.removeFromWatchedList = this.removeFromWatchedList.bind(this);
  this.removeFromRejectedList = this.removeFromRejectedList.bind(this);
}

handlePicChange(e){
  var file = e.target.files[0];
  this.setState({ pic: file });

  var reader = new FileReader();
  reader.onloadend = () => {
    this.setState({ preview: reader.result });
  }
  reader.readAsDataURL(file);
}

handleSubmit(e){
  e.preventDefault();
  var user = this.state.user;
  parse.parse.initialize();
  if(this.state.preview && this.state.pic) {
    var pic = this.state.pic;
    var image = new ParseFile(pic);
    image.save({}, {
      data: pic
    }).then((response) => {
      var imageUrl = response.url;
      user.set({ 'imageUrl' : imageUrl });
      user.save();
      return
    });
  }
}

removeFromWatchedList(index) {
  console.log('rejectedList');
  var user = this.state.user;
  var rejectedList = user.get('watchedList');
  rejectedList.splice(index, 1);
  user.set({rejectedList: rejectedList});
  user.save().then(()=>{
    this.setState({user})
  })
}

removeFromRejectedList(index) {
  console.log('rejectedList');
  var user = this.state.user;
  var rejectedList = user.get('rejectedList');
  rejectedList.splice(index, 1);
  user.set({rejectedList: rejectedList});
  user.save().then(()=>{
    this.setState({user})
  })
}

deleteUser() {
  this.state.user.destroy({success: function(model, response) {
    console.log('deleted', model)
  }});
}
 // delete(movie) {remove movie from user.get('watchedList'), save user, update user on state }


  render(){

    var user = this.state.user;
    var watchedList, rejectedList;
    var image = this.state.image;
    console.log('user now', user);

    if(user) {
      console.log('image here', user.get('imageUrl'));
      watchedList = user.get('watchedList').map((movie, index) => {
        return(
          <li key={index}>
            {movie.title}
            <button className="btn-danger" onClick={(e) => { this.removeFromWatchedList(index) }}>Remove from list</button>
            <hr/>
          </li>
        )//create a button, the button runs a function that the movie is passed into. remove from the colletion and update the state.
      });

      rejectedList = user.get('rejectedList').map((movie, index) => {
        return(
          <li key={index}>
            {movie.title}
            <button className="btn-danger" onClick={(e) => { this.removeFromRejectedList(index) }}>Remove from list</button>
            <hr/>
          </li>
        )
      });
    }
    return(
      <div className="wrapper">
        <Header />

        <div className="col-md-6">
          <h2>Watched Movie List</h2>
          <button className="btn-danger" onClick={this.clearList}>Clear list</button>
          <ul>
            { watchedList }
          </ul>
        </div>

        <div className="col-md-6">
          <h2>Rejected Movie List</h2>
          <button className="btn-danger">Clear list</button>
          <ul>
            { rejectedList }
          </ul>
        </div>

        <form onSubmit={this.handleSubmit} >
          <input onChange={this.handlePicChange} type="file"/>
          <img src={ this.state.preview} />
          <input className="btn btn-danger" type="submit" value="Upload"/>
        </form>

        <button onClick={this.deleteUser}>Delete Account</button>

      </div>

    )
  }
}

module.exports = {
  AccountContainer
};
