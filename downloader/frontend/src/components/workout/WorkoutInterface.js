import React from 'react';
import axios from 'axios';
import Section from './WorkoutInterfaceHelpers/Section';
import SectionAdder from './WorkoutInterfaceHelpers/SectionAdder';
import MovementAdder from './WorkoutInterfaceHelpers/MovementAdder';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class WorkoutInterface extends React.Component {
  constructor() {
    super()
    this.state = {
      sections:[],
      start_time:null,
      end_time:null,
      scheduled_for:new Date(),
      added_new_section:false
    }
    this.addSection = this.addSection.bind(this)
    this.handleAddNewSection = this.handleAddNewSection.bind(this)
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
        scheduled_for:this.state.scheduled_for
      }
      )
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
        <div className='input-group'>
          <label className='control-label'>Scheduled For</label>
          <DatePicker className='form-control form-control-sm' selected={this.state.scheduled_for} onChange={date => this.setState({...this.State, scheduled_for:date})} />
        </div>
        {section_options}
        <div>
          {sections}
          <button className='btn btn-primary btn-sm' onClick={this.addSection}>Add Section</button>
        </div>
      </div>
    )
  }
}

export default WorkoutInterface;
