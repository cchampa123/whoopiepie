import React from 'react';
import WorkoutInterface from './WorkoutInterface';
import WorkoutQuickView from './WorkoutQuickView';
import axios from '../common/axiosConfig';
import {getCurrentDate} from '../common/getDate';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {nonTimestampDate} from '../common/getDate';

class WorkoutManager extends React.Component {

  constructor() {
    super()
    this.state = {
      selected_workout:'',
      scheduled_workouts:[],
      scheduled_day_to_view:new Date(),
      random_workouts:[],
      previous_workouts:[]
    }
    this.handleStartWorkout=this.handleStartWorkout.bind(this)
    this.loadWorkout=this.loadWorkout.bind(this)
    this.resetWorkout=this.resetWorkout.bind(this)
  }

  updateData() {
    const scheduled = axios.get('/api/workout/workout/',
      {params:{
          'scheduled_for':getCurrentDate(),
          'end_time__isnull':true
      }}
    )

    const previous = axios.get('/api/workout/workout/',
      {params:{
        'scheduled_for':nonTimestampDate(this.state.scheduled_day_to_view)
      }}
    )

    Promise.all([scheduled, previous]).then(responses =>
      this.setState({
        ...this.state,
        scheduled_workouts:responses[0].data.map(x => x.id),
        previous_workouts:responses[1].data.map(x => x.id)
      })
    )
  }
  componentDidMount() {
    this.updateData()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selected_workout !== prevState.selected_workout && this.state.selected_workout==='') {
      this.updateData()
    } else if (this.state.scheduled_day_to_view != prevState.scheduled_day_to_view) {
      axios.get('/api/workout/workout/',
        {params:{
          'scheduled_for':nonTimestampDate(this.state.scheduled_day_to_view)
        }}
      ).then(res =>
        this.setState({...this.state, previous_workouts:res.data.map(x=>x.id)})
      )
    }
  }

  handleStartWorkout(event) {
    axios.post(
      '/api/workout/workout/',
      {
        'start_time':null,
        'end_time':null,
        'scheduled_for':null,
        'sections':[]
      },
    ).then(res => {
      this.setState({
        ...this.state,
        selected_workout: res.data['id'],
      })
    })
  }

  loadWorkout (workout) {
    this.setState({
      ...this.state,
      selected_workout:workout
    })
  }

  resetWorkout() {
    this.setState({...this.state, selected_workout:''})
  }

  render() {
    if (this.state.selected_workout!=='') {
      return(
        <WorkoutInterface
          workout_id={this.state.selected_workout}
          reset_function={this.resetWorkout}
        />
      )
    } else {
     const scheduled_workout = this.state.scheduled_workouts.length===0 ?
              <p>You have no workout scheduled. Enjoy!</p> : (
              <div>
                <p>You have {this.state.scheduled_workouts.length} {this.state.scheduled_workouts.length === 1?'workout':'workouts'} scheduled for today. Check {this.state.scheduled_workouts.length===1 ? "it":"them"} out:</p>
                {this.state.scheduled_workouts.map(x => <WorkoutQuickView key={x} workout_id={x} onClick={() => this.loadWorkout(x)}/>)}
              </div>
            )

      const previous_workout = this.state.previous_workouts.length===0 ? <div/> :
            <div>
              {this.state.previous_workouts.map(x => <WorkoutQuickView key={x} workout_id={x} onClick={() => this.loadWorkout(x)}/>)}
            </div>

      return(
        <div>
        {scheduled_workout}
        <div className='jumbotron'>
          <DatePicker
            disableClock={true}
            className='form-control form-control-sm'
            selected={this.state.scheduled_day_to_view}
            onChange={date => this.setState({...this.state, scheduled_day_to_view:date})}
          />
          {previous_workout}
        </div>
        <div style={{paddingTop:'15px'}}>
          <button className='btn btn-primary btn-sm' onClick={this.handleStartWorkout}>
            Plan New Workout
          </button>
        </div>
        </div>
      )
    }
  }
}

export default WorkoutManager;
