import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect, useHistory } from "react-router-dom";

import PrivateRoute from './common/PrivateRoute'
import Login from './Login';
import Logout from './Logout';
import YoutubeDownloader from './YoutubeDownloader';
import WorkoutTracker from './WorkoutTracker'
import Navbar from './common/Navbar'
import Home from './Home'
import { AuthContext } from './common/auth.js'



function App(props){
  console.log(localStorage.getItem('tokens'))
  const existingTokens=localStorage.getItem('tokens')
  const [authTokens, setAuthTokens] = useState(existingTokens)

  const setTokens = (data) => {
    localStorage.setItem('tokens', data);
    setAuthTokens(data)
  }

  const nav = [
    {link: '/youtube', text: 'Youtube Downloader'},
    {link: '/workout', text: 'Workout Tracker'}
    //{link: '/logout', text: 'Log Out'}
  ]
  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens:setTokens }}>
    <div id={'outer-container'}>
      <Router>
        {authTokens ? <Navbar logout={() => setTokens()} link_list={nav} pageWrapID={'page-wrap'} outerContainerID={'outer-container'}/> : <div/>}
        <div className="container" id={'page-wrap'}>
          <Switch>
            <PrivateRoute
              exact
              path='/'
              comp={Home}
            />
            <PrivateRoute
              exact
              path="/youtube"
              comp={YoutubeDownloader}
            />
            <PrivateRoute
              exact
              path="/workout"
              comp={WorkoutTracker}
            />
            <Route
              exact path='/login'
              render={() => <Login/>}
            />
          </Switch>
        </div>
      </Router>
    </div>
    </AuthContext.Provider>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
