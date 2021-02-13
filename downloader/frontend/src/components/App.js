import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect, useHistory } from "react-router-dom";
import axios from "axios";

import PrivateRoute from './common/PrivateRoute'
import Login from './Login';
import Logout from './Logout';
import YoutubeDownloader from './YoutubeDownloader';
import WorkoutTracker from './WorkoutTracker'
import Navbar from './common/Navbar'
import Home from './Home'
import { AuthContext } from './common/auth.js'



function App(props){
  const existingTokens=localStorage.getItem('tokens')
  const [authTokens, setAuthTokens] = useState(existingTokens)

  const setTokens = (data) => {
    localStorage.setItem('tokens', data);
    setAuthTokens(data)
  }

  axios.interceptors.request.use(function(config) {
      if (authTokens) {
        const token = "Token "+authTokens;
        config.headers.Authorization = token;
      }
      return config;
    }
  )

  axios.interceptors.response.use((response) => {
    return response
  }, function(error) {
    const originalRequest = error.config;
    if (error.response.status===401) {
      localStorage.setItem('tokens', '')
      window.location.reload(false)
    }
  })

  const nav = [
    {link: '/youtube', text: 'Youtube Downloader'},
    {link: '/workout', text: 'Workout Tracker'},
    {link: '/', text:'WhoopiePie'}
  ]
  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens:setTokens }}>
    <div id={'outer-container'}>
      <Router>
        {authTokens && authTokens !== 'undefined' ?
            <Navbar
                logout={() => {
                  setTokens('');
                  window.location.reload(false);
                  }}
                link_list={nav}
                pageWrapID={'page-wrap'}
                outerContainerID={'outer-container'}
              /> :
              <div/>
            }
        <div className="container" style={{paddingTop:'60px'}} id={'page-wrap'}>
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
