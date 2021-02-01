import React from 'react';
import axios from 'axios';
import WorkoutManager from './workout/WorkoutManager'

class WorkoutTracker extends React.Component {

  render() {
    return(
      <div>
      <h1> Workout Tracker </h1>
      <WorkoutManager token={this.props.token}/>
      </div>
    )
  }
}

export default WorkoutTracker;
