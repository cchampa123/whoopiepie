import React, {useState, useContext, useMemo} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import axios from "axios";

import {Navbar, Nav} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

import PrivateRoute from './components/common/PrivateRoute'
import Login from './components/Login';
import YoutubeDownloader from './components/YoutubeDownloader';
import WorkoutTracker from './components/WorkoutTracker'
import Reporter from './components/workout/Reporter'
import Home from './components/Home'
import { AuthContext } from './components/common/auth'
import './components/common/Navbar.css'

function App(props){
  const [user, setUser] = useState(null)
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  function logout() {
    axios.post('/api/auth/logout').then(()=>setUser(null))
  }

  const {REACT_APP_BASEURL} = process.env
  console.log(REACT_APP_BASEURL)

  axios.interceptors.request.use(function(config) {
      if (user) {
        const token = "Token "+user.token;
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
      window.location.reload(false)
    }
  })

  const nav = [
    {link: '/youtube', text: 'Youtube Downloader'},
    {link: '/workout', text: 'Workout Tracker'},
    {link: '/reporter', text: 'Workout Reports'},
    {link: '/', text:'Home'},
  ]
  return (
    <AuthContext.Provider value={value}>
      <Router>
        {user ?
          <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect={true}>
          <LinkContainer to='/'>
            <Navbar.Brand style={{color:`rgb(170,170,170)`}}>WhoopiePie</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='mr-auto'>
              {nav.map(function(x, index) {return(
                <LinkContainer to={x.link} key={index}>
                  <Nav.Link>{x.text}</Nav.Link>
                </LinkContainer>
                )
              })}
              <Nav.Link onClick={()=>logout()}>Log Out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        :
        <div/>}
        <div className='container' style={{paddingTop:30}}>
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
            <PrivateRoute
              exact
              path='/reporter'
              comp={Reporter}
            />
            <Route
              exact path='/login'
              render={() => <Login/>}
            />
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App;
