import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect, useHistory } from "react-router-dom";

import PrivateRoute from './common/PrivateRoute'
import Login from './Login';
import Logout from './Logout';
import YoutubeDownloader from './YoutubeDownloader';
import Navbar from './Navbar'

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
      {id:1, link: '/logout', text: 'Log Out'},
      {id:2, link: '/login', text: 'Log In'}
    ]
    return (
      <div>
        <Router>
        <h1>WhoopiePie</h1>
        <Navbar list={nav} />
          <div className="container">
            <Switch>
              <PrivateRoute
                exact
                path="/"
                isAuthenticated={this.state.authenticated}
                token={this.state.token}
                comp={YoutubeDownloader}
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
