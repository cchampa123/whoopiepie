import React from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { Typeahead } from 'react-bootstrap-typeahead'

class WorkoutSharer extends React.Component {

  constructor() {
    super()
    this.state={
      users:[],
      share_confirm:false,
      final_confirm:false,
      selected_user:{}
    }
    this.confirm = this.confirm.bind(this)
    this.reject=this.confirm.bind(this)
  }

  componentDidMount() {
    axios.get('/api/auth/user').then(res => this.setState({...this.state, users:res.data}))
  }

  confirm(){
    axios.put('api/workout/workout/'+this.props.workout_id+'/', {},
      {params:{
        'user_to_share_with':this.state.selected_user.id
      }}
    ).then(() => this.setState({users:[], share_confirm:false, final_confirm:false, selected_user:{}}))
  }

  reject(){
    this.setState({
      users:[],
      share_confirm:false,
      final_confirm:false,
      selected_user:{}
    })
  }

  render() {
    const typeahead = this.state.share_confirm ?
      <Typeahead
        allowNew
        labelKey='username'
        options={this.state.users}
        id='userTypeahead'
        onChange={(selected) => {this.setState({...this.state, selected_user:selected[0], final_confirm:true})}}
        placeholder='Share with...'
      />
      :
      <button
        className='btn btn-info btn-block w-100 h-100'
        name='share_workout'
        onClick={() => this.setState({...this.state, share_confirm:true})}
      >Share Workout</button>
    return (
      <div className='h-100 w-100'>
        {typeahead}
        <Modal show={this.state.final_confirm}>
          <Modal.Header>Confirm choice</Modal.Header>
          <Modal.Body>
            Are you sure you want to share this workout with {this.state.selected_user.username}?
          </Modal.Body>
          <Modal.Footer>
            <button className='btn btn-success' onClick={this.confirm}>Yes</button>
            <button className='btn btn-danger' onClick={this.reject}>No</button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default WorkoutSharer;
