import React from 'react';
import axios from 'axios';
import Section from './WorkoutInterfaceHelpers/Section';
import WorkoutSharer from './WorkoutInterfaceHelpers/WorkoutSharer'
import DatePicker from 'react-date-picker';
import Deleter from './WorkoutInterfaceHelpers/Deleter'

class WorkoutInterface extends React.Component {
  constructor() {
    super()
    this.state = {
      sections:[],
      start_time:null,
      end_time:null,
      scheduled_for:null
    }
    this.addSection = this.addSection.bind(this)
    this.handleAddNewSection = this.handleAddNewSection.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.removeSection = this.removeSection.bind(this)
  }

  componentDidMount() {
    axios.get('/api/workout/workout/'+String(this.props.workout_id)+'/').then(res => {
      const scheduled_date = new Date(Date.parse(res.data.scheduled_for)).getUTCDate()
      const scheduled_year = new Date(Date.parse(res.data.scheduled_for)).getUTCFullYear()
      const scheduled_month = new Date(Date.parse(res.data.scheduled_for)).getUTCMonth()+1
      const scheduled_for_date = scheduled_date ? scheduled_year+'-'+scheduled_month+'-'+scheduled_date : null
      this.setState(prevState => ({...prevState,
                     sections:res.data.sections,
                     start_time:res.data.start_time,
                     end_time:res.data.end_time,
                     scheduled_for:scheduled_for_date})
      )})
  }

  componentDidUpdate(prevProps, prevState) {
    axios.patch('/api/workout/workout/'+String(this.props.workout_id)+'/',
      {
        scheduled_for:this.state.scheduled_for,
        start_time:this.state.start_time,
        end_time:this.state.end_time
      }
      )
  }

  removeSection(section_id) {
    this.setState({
      ...this.state,
      sections:this.state.sections.filter(x=>x!==section_id)
    })
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
          section_remover={this.removeSection}
        />
      )
    }, this)

    const start_stop_button = this.state.start_time===null ?
      <div>
        <button
          className='btn btn-success'
          name='start_time'
          onClick={(event) => this.handleChange(event)}
        >
          Start Workout
        </button>
      </div>
    :
      <div>
        <button
          className='btn btn-danger'
          name='end_time'
          onClick={(event) => this.handleChange(event)}
        >
          End Workout
        </button>
      </div>

    const workout_options = (this.state.end_time !== null & this.state.start_time !== null) ?
      <div className='row'>
        <div className='btn btn-warning disabled'>
          Workout completed on {this.state.end_time.toLocaleString()}
        </div>
        <Deleter
          type_of_object='workout'
          object_id={this.props.workout_id}
          callback={this.props.reset_function}
          text='Delete Workout'
        />
      </div>
    :
      <div className='row'>
        <div>
          <DatePicker
            disableClock={true}
            className='form-control'
            value={this.state.scheduled_for ? new Date(this.state.scheduled_for.split('-')[0],
                                                       this.state.scheduled_for.split('-')[1]-1,
                                                       this.state.scheduled_for.split('-')[2]):
                                              null}
            onChange={date => this.setState(prevState => ({
              ...prevState,
              scheduled_for:date ? date.getUTCFullYear()+'-'+String(date.getUTCMonth()+1)+'-'+date.getUTCDate() : null
            }))}
          />
        </div>
        {start_stop_button}
        <WorkoutSharer workout_id={this.props.workout_id}/>
        <Deleter
          type_of_object='workout'
          object_id={this.props.workout_id}
          callback={this.props.reset_function}
          text='Delete Workout'
        />
      </div>

    return (
      <div className='container'>
          {workout_options}
          <div>
            {sections}
          </div>
          <div className='row'>
            <button className='btn btn-primary btn-block' onClick={this.addSection}>Add Section</button>
          </div>
          <div className='row'>
            <button className='btn btn-block btn-info' onClick={this.props.reset_function}>Back to Workout Home</button>
          </div>
      </div>
    )
  }
}

export default WorkoutInterface;
