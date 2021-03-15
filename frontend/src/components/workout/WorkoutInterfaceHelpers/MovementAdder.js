import React from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';

class MovementAdder extends React.Component {

  constructor(){
    super()
    this.state = {newMovementMetricType:'Reps',
                  newMovementMetric:'Weight'}
    this.handleNewMovementChange = this.handleNewMovementChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleNewMovementChange(event) {
    this.setState({...this.state, [event.target.name]:event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    axios.post('/api/workout/movement_class/',
    {
      'name':this.props.movement_name,
      'metric_type':this.state.newMovementMetricType,
      'metric':this.state.newMovementMetric
    }).then((res) => axios.patch('/api/workout/movement_instance/'+String(this.props.movement_id)+'/',
            {
              'name':res.data.id
            }
          ).then(res => this.props.completion()))
  }

  render() {
    return (
      <Modal show={true}>
        <form  onSubmit={this.handleSubmit}>
        <Modal.Header>Enter Movement Information</Modal.Header>
        <Modal.Body>
          <div className='form-group'>
            <label>Metric Type</label>
            <div>
              <select name='newMovementMetricType' className='custom-select' onChange={this.handleNewMovementChange} value={this.state.newMovementMetricType}>
              <option value='Reps'>Reps</option>
              <option value='Distance'>Distance</option>
              <option value='Calories'>Calories</option>
              </select>
            </div>
            <label>Metric Value</label>
            <div>
              <select className='custom-select' name='newMovementMetric' onChange={this.handleNewMovementChange} value={this.state.newMovementMetric}>
              <option value='Weight'>Weight</option>
              <option value='Time'>Time</option>
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-primary' type='submit'>Add Movement</button>
        </Modal.Footer>
        </form>
      </Modal>
    )
  }
}

export default MovementAdder;
