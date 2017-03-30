var React = require('react');
var Backbone = require('backbone');

var User = require('../models/users').User;
var Header = require('../layouts/header.jsx').Header;
var ParseFile = require('../parse').ParseFile;

class AccountContainer extends React.Component{
constructor(props){
  super(props)

  var user = new User();
  var userId = JSON.parse(localStorage.getItem('user')).objectId;

  user.set('objectId', userId);
  user.fetch().then(()=>{
    this.setState({ user: user })
  })

  this.state = {
    pic: null,
    preview: null
  }

  this.handleDeleteMovie = this.handleDeleteMovie.bind(this);
  this.clearList = this.clearList.bind(this);
  this.handlePicChange = this.handlePicChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  this.deleteUser = this.deleteUser.bind(this);
}

componentWillMount() {

  var user = User.current();

  // var localUser = JSON.parse(localStorage.getItem('user'));
  // console.log('here two',localUser.objectId);
  // var user = new User();
  //
  // user.set('objectId', localUser.objectId);
  // user.fetch().then(() => {
  //   this.setState({ user: user, watchedList: user.get('watchedList') });
  // });
}

handlePicChange(e){
  var file = e.target.files[0];
  this.setState({pic: file});

  var reader = new FileReader();
  reader.onloadend = () => {
    this.setState({preview: reader.result});
  }
  reader.readAsDataURL(file);
}

handleSubmit(e){
  e.preventDefault();
  var pic = this.state.pic;
  var fileUpload = new ParseFile(pic);
  fileUpload.save({}, {
    data: pic
  }).then((response)=>{
    var imageUrl = response.url;
    var user = this.state.user;
    user.set({
      profilePic: {
        name: this.state.pic.name,
        url: imageUrl
      }
    });
    console.log('user', user)
    // user.save().then(()=>{
    //   this.setState({ user })
    // });

  });
}

clearList() {
  this.state.user.set({watchedList: []});
  // Push that change to the API
  var updatedUser = this.state.user;
  this.state.user.save().then( (data) => {
    this.setState({ watchedList: [] });
  });
  // Force the view to update with the new watchedList state
  // this.forceUpdate();
}

handleDeleteMovie(index){
  console.log('delete', this.state.watchedList[index]);
  // pull the object at this index from the watched list
  this.state.watchedList.splice(index, 1)
  console.log('updated watched list', this.state.watchedList);
  // Like a jQuery PUT
  this.state.user.set({watchedList: this.state.watchedList});
  // Push that change to the API
  this.state.user.save();
  // Force the view to update with the new watchedList state
  this.forceUpdate();
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

    if(user) {
      watchedList = user.get('watchedList').map((movie, index) => {
        return(
          <li key={index}>
            {movie.title}
            <button className="btn-danger" onClick={(e) => { this.handleDeleteMovie(index) }}>Remove from list</button>
            <hr/>
          </li>
        )//create a button, the button runs a function that the movie is passed into. remove from the colletion and update the state.
      });

      rejectedList = user.get('rejectedList').map((movie, index) => {
        return(
          <li key={index}>
            {movie.title}
            <button className="btn-danger" onClick={(e) => { this.handleDeleteMovie(index) }}>Remove from list</button>
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
          <ul>
            { rejectedList }
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
          <img src={this.state.preview} />
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
