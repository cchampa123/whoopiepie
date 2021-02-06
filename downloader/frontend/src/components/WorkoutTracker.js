import React from 'react';
import WorkoutManager from './workout/WorkoutManager'

class WorkoutTracker extends React.Component {

  render() {
    return(
      <div>
      <h1> Workout Tracker </h1>
      <WorkoutManager/>
      </div>
    )
  }
}

export default WorkoutTracker;
