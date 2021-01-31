import React from 'react';
import axios from 'axios';

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
      'workout':this.props.workout_id
    }).then(res => this.props.completion(res.data))
  }

  render() {
    return (
      <form  onSubmit={this.handleSubmit}>
        <div className='form-group'>
          <label>Metric Type</label>
          <div>
            <select name='newSectionMetricType' onChange={this.handleNewSectionChange} value={this.state.newSectionMetricType}>
            <option value='For Time'>For Time</option>
            <option value='AMRAP'>AMRAP</option>
            </select>
          </div>
          <label>Metric Value</label>
          <div>
            <input name='newSectionRounds' onChange={this.handleNewSectionChange} value={this.state.newSectionRounds}/>
          </div>
        </div>
        <div>
          <button type='submit'>Submit Section</button>
        </div>
      </form>
    )
  }
}

export default SectionAdder;
