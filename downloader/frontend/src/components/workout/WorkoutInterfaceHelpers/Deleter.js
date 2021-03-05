import React from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';

class Deleter extends React.Component {

  constructor() {
    super()
    this.state = {
      confirmation:false
    }
    this.delete = this.delete.bind(this)
  }

  delete() {
    axios.delete('/api/workout/'+this.props.type_of_object+'/'+this.props.object_id).then(() => {
      this.setState({confirmation:false})
      this.props.callback()
    })
  }

  render() {
    return (
      <div>
        <Modal show={this.state.confirmation}>
          <Modal.Body>
            Are you sure you want to delete this object?
          </Modal.Body>
          <Modal.Footer>
            <button onClick={this.delete} className={'btn btn-danger'}>Confirm</button>
            <button onClick={() => this.setState({confirmation:false})} className={'btn btn-primary'}>Cancel</button>
          </Modal.Footer>
        </Modal>
        <button onClick={() => this.setState({confirmation:true})} className={'btn btn-danger btn-block btn-'+this.props.size}>{this.props.text}</button>
      </div>
    )
  }

}

export default Deleter
