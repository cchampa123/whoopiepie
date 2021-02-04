import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect, useHistory } from "react-router-dom";

import PrivateRoute from './common/PrivateRoute'
import Login from './Login';
import Logout from './Logout';
import YoutubeDownloader from './YoutubeDownloader';
import WorkoutTracker from './WorkoutTracker'
import Navbar from './common/Navbar'
import Home from './Home'

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      authenticated: false,
      token: null,
      user: null
    }
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin(loginInfo) {
    this.setState({
      token:loginInfo.token,
      user: loginInfo.user,
      authenticated: true,
      }
    )
  }

  handleLogout() {
    this.setState({
      authenticated: false,
      token:null,
      user:null
    })
}

  render() {
    const nav = [
      {link: '/youtube', text: 'Youtube Downloader'},
      {link: '/workout', text: 'Workout Tracker'},
      {link: '/logout', text: 'Log Out'}
    ]
    return (
      <div id={'outer-container'}>
        <Router>
        {this.state.authenticated ? <Navbar link_list={nav} pageWrapID={'page-wrap'} outerContainerID={'outer-container'}/> : <div/>}
          <div className="container" id={'page-wrap'}>
            <Switch>
              <PrivateRoute
                exact
                path='/'
                isAuthenticated={this.state.authenticated}
                token={this.state.token}
                comp={Home}
              />
              <PrivateRoute
                exact
                path="/youtube"
                isAuthenticated={this.state.authenticated}
                token={this.state.token}
                comp={YoutubeDownloader}
              />
              <PrivateRoute
                exact
                path="/workout"
                isAuthenticated={this.state.authenticated}
                token={this.state.token}
                comp={WorkoutTracker}
              />
              <Route
                exact path='/login'
                render={() => <Login handleLogin={this.handleLogin} authenticated={this.state.authenticated}/>}
              />
              <Route
                exact path='/logout'
                render={() => <Logout handleLogout={this.handleLogout} token={this.state.token}/>}
              />
            </Switch>
          </div>
        </Router>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
