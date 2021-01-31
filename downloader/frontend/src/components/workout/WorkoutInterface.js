import React from 'react';
import axios from 'axios';
import Section from './WorkoutInterfaceHelpers/Section';
import SectionAdder from './WorkoutInterfaceHelpers/SectionAdder';
import MovementAdder from './WorkoutInterfaceHelpers/MovementAdder';

class WorkoutInterface extends React.Component {
  constructor() {
    super()
    this.state = {
      workout_id: '',
      movements:{},
      sections:[],
      added_new_movement:false,
      added_new_section:false
    }
    this.handleStartWorkout = this.handleStartWorkout.bind(this)
    this.addSection = this.addSection.bind(this)
    this.handleAddNewSection = this.handleAddNewSection.bind(this)
    this.handleUpdateMovementName = this.handleUpdateMovementName.bind(this)
    this.handleUpdateMovementData = this.handleUpdateMovementData.bind(this)
    this.addMovement = this.addMovement.bind(this)
  }

  componentDidMount() {
    axios.get('/api/workout/movement_class/').then(res => {
      this.setState({...this.State, movements:res.data})
      })
  }

  handleStartWorkout(event) {
    axios.post(
      '/api/workout/workout/',
      {},
      {
        headers:{
          'Content-Type': 'application/json',
          'Authorization':'Token '+this.props.token
        }
      }
    ).then(res => {
      this.setState({
        ...this.state,
        'workout_id': res.data['id'],
      })
    })
  }

  addSection() {
    this.setState({...this.state, added_new_section:true})
  }

  handleAddNewSection(data) {
    this.setState({
                    ...this.state,
                    added_new_section:false,
                    section:this.state.section_data.concat(data.id)
                  })
  }

  addMovement(section_id) {
    this.setState({
      ...this.state,
      section_data:this.state.section_data.map((x) => {
        if(x.section_id===section_id){
          return {id:x.id,
                  movements:x.movements.concat({
                    metric_type_value:'',
                    metric_value:'',
                    name:'',
                    movement_id:-1
                  })
          };
        } else {
          return x;
        }
      })
    })
  }

  handleUpdateMovementName(selected, section_id, id) {
    axios.get('/api/workout/movement_class/').then(res => {
      this.setState({...this.state, movements:res.data})})
    this.setState({
      ...this.state,
      section_data:this.state.section_data.map((x) => {
        if (x.id===section_id) {
          console.log('found the right section - it is '+String(section_id))
          return {
            id:x.id,
            movements:x.movements.map(function(y, index) {
              if (index===id) {
                console.log('found the right movement - it is '+String(id))
                return {
                  ...y,
                  'name':selected[0].name,
                  'movement_id':selected[0].id
                }
              } else {
                return y
              }
            }, this)
          }
        } else {
          return x
        }
      })
    })
  }

  handleUpdateMovementData(attribute, value, section_id, id) {
    this.setState({
      ...this.state,
      section_data:this.state.section_data.map((x) => {
        if (x.id===section_id) {
          return {
            id:x.id,
            movements:x.movements.map(function(y, index) {
              if (index===id) {
                return {
                  ...y,
                  [attribute]:value
                }
              } else {
                return y
              }
            }, this)
          }
        } else {
          return x
        }
      })
    })
  }

  handleInfoAdd(event) {
    // this.setState({
    //   ...this.state,
    //   section_data:this.state.section_data.map(x => {
    //     if(x.id===''){
    //       [event.target.name]: event.target.value
    //     }
    //   })
    // })
  }

  render() {
    const movement_options = this.state.added_new_movement===true ?
                                  <MovementAdder
                                      movement_name={this.state.added_new_movement}
                                      completion={this.handleAddNewMovement}
                                    /> :
                                    <div/>
    const section_options = this.state.added_new_section===true ?
                              <SectionAdder
                                workout_id={this.state.workout_id}
                                completion={this.handleAddNewSection}
                                /> :
                                <div/>

    const sections = this.state.section_data.map(function(section, index) {
      return (
        <Section
          key={index}
          section_id={section.id}
          possible_movements={this.state.movements}
          movements={section.movements}
          addMovement={this.addMovement}
          handleUpdateMovementName={this.handleUpdateMovementName}
          handleUpdateMovementData={this.handleUpdateMovementData}
          workout_id={this.state.workout_id}
        />
      )
    }, this)
    if (this.state.workout_id==='') {
      return(
        <button onClick={this.handleStartWorkout}>
          Start Workout
        </button>
      )
    } else {
      return (
        <div>
        {section_options}
        {movement_options}
          <div>
            {sections}
            <button onClick={this.addSection}>Add Section</button>
          </div>
        </div>
      )
    }
  }
}

export default WorkoutInterface;
