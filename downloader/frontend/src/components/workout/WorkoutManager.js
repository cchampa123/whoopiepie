import React from 'react';
import WorkoutInterface from './WorkoutInterface';
import axios from 'axios';

class WorkoutManager extends React.Component {

  constructor() {
    super()
    this.state = {
      selected_workout:''
    }
    this.handleStartWorkout=this.handleStartWorkout.bind(this)
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

  render() {
    if (this.state.selected_workout!=='') {
      return(
        <WorkoutInterface
          token={this.props.token}
          workout_id={this.state.selected_workout}
        />
      )
    } else {
      return(
        <button onClick={this.handleStartWorkout}>
          Start Workout
        </button>
      )
    }
  }
}

export default WorkoutManager;
