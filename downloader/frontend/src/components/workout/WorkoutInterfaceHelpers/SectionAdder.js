import React from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal'

class SectionAdder extends React.Component {

  constructor(){
    super()
    this.state = {newSectionMetricType:'For Time',
                  newSectionRounds:1}
    this.handleNewSectionChange = this.handleNewSectionChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleNewSectionChange(event) {
    this.setState({...this.state, [event.target.name]:event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    axios.post('/api/workout/section/',
    {
      'metric_type':this.state.newSectionMetricType,
      'rounds':this.state.newSectionRounds,
      'workout':this.props.workout_id,
      'time':'00:00:00',
      'movements':[]
    }).then(res => this.props.completion(res.data))
  }

  render() {
    return (
      <Modal show={true}>
      <form onSubmit={this.handleSubmit}>
        <Modal.Header>
              Enter Section Information
        </Modal.Header>
        <Modal.Body>
          <div className='form-group'>
            <label>Metric Type</label>
            <div>
              <select name='newSectionMetricType' className='custom-select' onChange={this.handleNewSectionChange} value={this.state.newSectionMetricType}>
              <option value='For Time'>For Time</option>
              <option value='AMRAP'>AMRAP</option>
              </select>
            </div>
          </div>
          <div className='form-group'>
            <label>Metric Value</label>
            <div>
              <input name='newSectionRounds' className='form-control' onChange={this.handleNewSectionChange} value={this.state.newSectionRounds}/>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-primary' type='submit'>Submit Section</button>
        </Modal.Footer>
      </form>
    </Modal>
    )
  }
}

export default SectionAdder;
