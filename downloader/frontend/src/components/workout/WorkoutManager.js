import React from 'react';
import WorkoutInterface from './WorkoutInterface';
import WorkoutQuickView from './WorkoutQuickView';
import axios from 'axios';
import getCurrentDate from '../common/getDate';

class WorkoutManager extends React.Component {

  constructor() {
    super()
    this.state = {
      selected_workout:'',
      scheduled_workouts:[],
      random_workouts:[]
    }
    this.handleStartWorkout=this.handleStartWorkout.bind(this)
    this.loadWorkout=this.loadWorkout.bind(this)
  }

  componentDidMount() {
    axios.get('/api/workout/workout',
      {params:{
          'scheduled_for__date':getCurrentDate()
      }}
    ).then(res=>this.setState({...this.state, scheduled_workouts:res.data.map(x => x.id)}))
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
      {
        headers:{
          'Content-Type': 'application/json',
          'Authorization':'Token '+this.props.token
        }
      }
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

  render() {
    if (this.state.selected_workout!=='') {
      return(
        <WorkoutInterface
          token={this.props.token}
          workout_id={this.state.selected_workout}
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
      return(
        <div>
        {scheduled_workout}
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
