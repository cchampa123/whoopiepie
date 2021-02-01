import React from 'react';
import axios from 'axios';
import Section from './WorkoutInterfaceHelpers/Section';
import SectionAdder from './WorkoutInterfaceHelpers/SectionAdder';
import MovementAdder from './WorkoutInterfaceHelpers/MovementAdder';

class WorkoutInterface extends React.Component {
  constructor() {
    super()
    this.state = {
      sections:[],
      added_new_movement:false,
      added_new_section:false
    }
    this.addSection = this.addSection.bind(this)
    this.handleAddNewSection = this.handleAddNewSection.bind(this)
  }

  componentDidMount() {
    axios.get('/api/workout/workout/'+String(this.props.workout_id)+'/').then(res => {
      this.setState({...this.State, sections:res.data.sections})
      })
  }

  addSection() {
    this.setState({...this.state, added_new_section:true})
  }

  handleAddNewSection(data) {
    this.setState({
                    ...this.state,
                    added_new_section:false,
                    sections:this.state.sections.concat(data.id)
                  })
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
                                workout_id={this.props.workout_id}
                                completion={this.handleAddNewSection}
                                /> :
                                <div/>

    const sections = this.state.sections.map(function(section, index) {
      return (
        <Section
          key={index}
          section_id={section}
          workout_id={this.props.workout_id}
        />
      )
    }, this)
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

export default WorkoutInterface;
