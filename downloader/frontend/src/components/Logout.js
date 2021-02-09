import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { useAuth } from './common/auth'

function Logout() {

  const setAuthTokens = useAuth()

  axios.post('/api/auth/logout')
  setAuthTokens(null)

  return (
    <div>
      <h2>You have been logged out.</h2>
    </div>
  )
}


export default Logout;
