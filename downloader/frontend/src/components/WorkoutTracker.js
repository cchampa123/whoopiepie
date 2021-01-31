import React from 'react';
import axios from 'axios';
import WorkoutInterface from './workout/WorkoutInterface'

class WorkoutTracker extends React.Component {

  render() {
    return(
      <div>
      <h1> Workout Tracker </h1>
      <WorkoutInterface token={this.props.token}/>
      </div>
    )
  }
}

export default WorkoutTracker;
