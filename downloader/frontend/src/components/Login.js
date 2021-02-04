import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      username:"",
      password:"",
      invalid_credentials:false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    axios.post('/api/auth/login', this.state)
    .then(res => {
      this.props.handleLogin(res.data)
      }
    )
    .catch(error => {
      this.setState({
        username:"",
        password:"",
        invalid_credentials:true
      })
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
          <h1>WhoopiePie</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <div>
                <input
                  type="text"
                  name="username"
                  onChange={this.handleChange}
                  value={this.state.username}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div>
                <input
                  type="password"
                  name="password"
                  onChange={this.handleChange}
                  value={this.state.password}
                />
              </div>
            </div>
            <div>
              <button type="submit">Log In</button>
            </div>
          </form>
          {this.state.invalid_credentials &&
            <div className="alert alert-danger">Invalid Credentials</div>}
        </div>
      )
    }
  }
}

export default Login;
