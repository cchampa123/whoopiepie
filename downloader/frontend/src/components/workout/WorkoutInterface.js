import React from 'react';
import axios from 'axios';
import Section from './WorkoutInterfaceHelpers/Section';
import WorkoutSharer from './WorkoutInterfaceHelpers/WorkoutSharer'
import DatePicker from 'react-datepicker';
import {nonTimestampDate} from '../common/getDate'
import 'react-datepicker/dist/react-datepicker.css';

class WorkoutInterface extends React.Component {
  constructor() {
    super()
    this.state = {
      sections:[],
      start_time:null,
      end_time:null,
      scheduled_for:new Date()
    }
    this.addSection = this.addSection.bind(this)
    this.handleAddNewSection = this.handleAddNewSection.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    axios.get('/api/workout/workout/'+String(this.props.workout_id)+'/').then(res => {
      this.setState({...this.State,
                     sections:res.data.sections,
                     start_time:res.data.start_time,
                     end_time:res.data.end_time})
      })
  }

  componentDidUpdate(prevProps, prevState) {
    axios.patch('/api/workout/workout/'+String(this.props.workout_id)+'/',
      {
        scheduled_for:nonTimestampDate(this.state.scheduled_for),
        start_time:this.state.start_time,
        end_time:this.state.end_time
      }
      )
  }

  addSection() {
    axios.post('/api/workout/section/',
    {
      'metric_type':'For Time',
      'rounds':1,
      'workout':this.props.workout_id,
      'time':'00:00:00',
      'movements':[]
    }).then(res => this.setState({...this.state, sections:this.state.sections.concat(res.data.id)}))
  }

  handleAddNewSection(data) {
    this.setState({
                    ...this.state,
                    added_new_section:false,
                    sections:this.state.sections.concat(data.id)
                  })
  }

  handleChange(event) {
    this.setState({
      [event.target.name]:new Date()
    })
  }

  render() {
    const sections = this.state.sections.map(function(section, index) {
      return (
        <Section
          key={index}
          section_id={section}
          workout_id={this.props.workout_id}
        />
      )
    }, this)

    const start_stop_button = this.state.start_time===null ?
      <div>
        <button
          className='btn btn-success btn-sm'
          name='start_time'
          onClick={(event) => this.handleChange(event)}
        >
          Start Workout
        </button>
      </div>
    :
      <div>
        <button
          className='btn btn-danger btn-sm'
          name='end_time'
          onClick={(event) => this.handleChange(event)}
        >
          End Workout
        </button>
      </div>

    const workout_options = (this.state.end_time !== null & this.state.start_time !== null) ?
      <div className='btn btn-warning disabled'>
        Workout completed on {this.state.end_time.toLocaleString()}
      </div>
    :
      <div className='row'>
        <div>
          <DatePicker disableClock={true} className='form-control form-control-sm' selected={this.state.scheduled_for} onChange={date => this.setState({...this.State, scheduled_for:date})} />
        </div>
        {start_stop_button}
        <WorkoutSharer workout_id={this.props.workout_id}/>
      </div>

    return (
      <div>
        {workout_options}
        <div>
          {sections}
          <button className='btn btn-primary btn-block' onClick={this.addSection}>Add Section</button>
          <button className='btn btn-block btn-info' onClick={this.props.reset_function}>Back to Workout Home</button>
        </div>
      </div>
    )
  }
}

export default WorkoutInterface;
