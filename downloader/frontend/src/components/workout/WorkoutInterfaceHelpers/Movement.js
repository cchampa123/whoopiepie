import React from 'react';
import axios from 'axios';
import { Typeahead } from 'react-bootstrap-typeahead'
import MovementAdder from './MovementAdder'

class Movement extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        added_new_movement:false,
        new_movement_name:'',
        selected:[props.selected_movement]
      }
      this.completeNewMovementAddition=this.completeNewMovementAddition.bind(this)
      this.handleUpdateMovementWithCheckForNew = this.handleUpdateMovementWithCheckForNew.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selected_movement.id !== this.props.selected_movement.id) {
      this.setState({
        added_new_movement:false,
        new_movement_name:'',
        selected:[this.props.selected_movement]
      })
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.props.movement_id === -1) {
        axios.post('/api/workout/movement_instance/',
                    {
                      'name':this.props.selected_movement.id,
                      'metric_value':this.props.selected_movement.metric_value,
                      'metric_type_value':this.props.selected_movement.metric_type_value,
                      'section':this.props.section_id
                    }).then(res => this.props.handleSubmit)
    } else {
      axios.put('/api/workout/movement_instance/'+this.props.movement_id+'/',
                  {
                    'name':this.props.selected_movement.id,
                    'metric_value':this.props.selected_movement.metric_value,
                    'metric_type_value':this.props.selcted_movement.metric_type_value,
                    'section':this.props.section_id
                  })
    }
  }

  handleUpdateMovementWithCheckForNew(selected) {
    if(selected.length > 0 && 'customOption' in selected[0]) {
      this.setState({
        added_new_movement:true,
        new_movement_name:selected[0].name
      })
    } else {
      this.props.handleUpdateMovementName(selected, this.props.section_id, this.props.id)
    }
  }

  completeNewMovementAddition(data) {
    console.log(data)
    this.props.handleUpdateMovementName([data], this.props.section_id, this.props.id)
    this.setState({...this.state, added_new_movement:false})
  }

  render() {
    const button_text = this.props.movement_id === -1 ? "Confirm" : "Update"
    if (this.state.added_new_movement) {
      return (
        <MovementAdder
          movement_name={this.state.new_movement_name}
          completion={this.completeNewMovementAddition}
        />
      )
    } else {
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <div className='input-group'>
              <Typeahead
                allowNew
                newSelectionPrefix='Add a new movement: '
                labelKey='name'
                options={this.props.possible_movements}
                id='movementTypeahead'
                onChange={(selected) => this.handleUpdateMovementWithCheckForNew(selected)}
                selected={this.state.selected_movement}
                size='sm'
                placeholder='Movement'/>
              <input
                className='rbt-input-main'
                type='text'
                name='metric_type_value'
                placeholder={this.props.selected_movement.metric_type_value}
                onChange={(event) => this.props.handleUpdateMovementData(event.target.name, event.target.value, this.props.section_id, this.props.id)}/>
              <input
                className='rbt-input-main'
                type='text'
                name='metric_value'
                placeholder={this.props.selected_movement.metric_value}
                onChange={(event) => this.props.handleUpdateMovementData(event.target.name, event.target.value, this.props.section_id, this.props.id)}/>
              <button type='submit'>{button_text}</button>
            </div>
          </form>
        </div>
      )
    }
  }
}

export default Movement;
