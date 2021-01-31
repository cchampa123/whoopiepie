import React from 'react';
import axios from 'axios';

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

    }).then((res) => this.props.completion(res.data))
  }

  render() {
    return (
      <form  onSubmit={this.handleSubmit}>
        <div className='form-group'>
          <label>Metric Type</label>
          <div>
            <select name='newMovementMetricType' onChange={this.handleNewMovementChange} value={this.state.newMovementMetricType}>
            <option value='Reps'>Reps</option>
            <option value='Distance'>Distance</option>
            <option value='Calories'>Calories</option>
            </select>
          </div>
          <label>Metric Value</label>
          <div>
            <select name='newMovementMetric' onChange={this.handleNewMovementChange} value={this.state.newMovementMetric}>
            <option value='Weight'>Weight</option>
            <option value='Time'>Time</option>
            </select>
          </div>
        </div>
        <div>
          <button type='submit'>Add Movement</button>
        </div>
      </form>
    )
  }
}

export default MovementAdder;
