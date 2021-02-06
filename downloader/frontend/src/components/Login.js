import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { useAuth } from './common/auth'

function Login() {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuth();

  function postLogin() {
    axios.post('/api/auth/login',
    {
      'username':userName,
      'password':password
    }).then(result => {
      console.log('hello')
      setAuthTokens(result.data.token);
      setLoggedIn(true);
    }).catch(e => {
      setIsError(true);
    });
  }

  if (isLoggedIn) {
    return <Redirect to='/'/>
  }

  return (
    <div>
      <h1>WhoopiePie</h1>
        <div className="form-group">
          <label>Username</label>
          <div>
            <input
              className='form-control'
              type="text"
              name="username"
              onChange={e => {setUserName(e.target.value)}}
              value={userName}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Password</label>
          <div>
            <input
              className='form-control'
              type="password"
              name="password"
              onChange={e => {setPassword(e.target.value)}}
              value={password}
            />
          </div>
        </div>
        <div>
          <button className='btn btn-primary' onClick={postLogin}>Log In</button>
        </div>
    </div>
  )
}


export default Login;
