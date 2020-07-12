import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Logout extends React.Component {

  componentDidMount() {
    axios.post('/api/auth/logout',
      {},
      {headers: {'Authorization': 'Token '+this.props.token}}
    )
    .then(res => {
      this.props.handleLogout()
      }
    )
  }

  render() {
    if (this.props.authenticated) {
      return (
        <Redirect to='/' />
      )
    } else {
      return (
        <div>
          <h2>You have been logged out.</h2>
        </div>
      )
    }
  }
}

export default Logout;
