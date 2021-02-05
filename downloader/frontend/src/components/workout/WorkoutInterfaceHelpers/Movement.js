import React from 'react';
import axios from 'axios';
import { Typeahead } from 'react-bootstrap-typeahead'
import MovementAdder from './MovementAdder'

class Movement extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
        movement_data:{
          id:-1,
          metric_type_value:0,
          metric_value:0,
          name:1,
          section:this.props.section_id
        },
        movement_class_data:{
          id:1,
          metric_type:"Reps",
          metric_value:"Weight",
          name:''
        },
        possible_options:[],
        added_new_movement:false,
        new_movement_name:''
      }
    this.completeAddNewMovement = this.completeAddNewMovement.bind(this)

  }

  updateMovementData() {
    const options_holder = axios.get('/api/workout/movement_class/')
    const movement_data_holder = axios.get('/api/workout/movement_instance/'+this.props.movement_id+'/')
    axios.all([options_holder, movement_data_holder]).then(axios.spread((...responses) =>
      this.setState({
          ...this.state,
          possible_options:responses[0].data.filter(x => x.id !== 1),
          movement_data:responses[1].data
        })
      )).then(() => {
          axios.get('/api/workout/movement_class/'+this.state.movement_data.name+'/').then(res =>
            this.setState({...this.state, movement_class_data:res.data})
      )
    })
  }

  componentDidMount() {
    this.updateMovementData()
  }

  componentDidUpdate() {
    axios.put('/api/workout/movement_instance/'+String(this.props.movement_id)+'/',
            this.state.movement_data
        )
  }

  changeSelectedMovement(selected) {
    console.log(selected)
    if (selected.length > 0 && 'customOption' in selected[0]) {
      this.setState({...this.state,
                      added_new_movement:true,
                      new_movement_name:selected[0].name})
    } else if (selected.length > 0) {
      axios.patch('/api/workout/movement_instance/'+this.props.movement_id+'/',
                {
                  name:selected[0].id
                }
              ).then(() => this.updateMovementData())
      }
    }

  completeAddNewMovement() {
    this.updateMovementData()
    this.setState({...this.state, added_new_movement:false, new_movement_name:''})
  }

  changeMovementData(event) {
    this.setState({
      ...this.state,
      movement_data:{
        ...this.state.movement_data,
        [event.target.name]:event.target.value
      }
    })
  }

  render() {
    if (this.state.added_new_movement) {
      return (
        <MovementAdder
          movement_name={this.state.new_movement_name}
          movement_id={this.props.movement_id}
          completion={this.completeAddNewMovement}
        />
      )
    } else {
      return (
          <div className='input-group'>
            <Typeahead
              allowNew
              newSelectionPrefix='Add a new movement: '
              labelKey='name'
              options={this.state.possible_options}
              id='movementTypeahead'
              onChange={(selected) => this.changeSelectedMovement(selected)}
              onInputChange={(value) => this.setState({...this.state, movement_class_data:{...this.state.movement_class_data, name:value}})}
              selected={[this.state.movement_class_data]}
              size='sm'
              placeholder='Movement'/>
            <input
              className='form-control form-control-sm'
              type='text'
              name='metric_type_value'
              placeholder={this.state.movement_class_data.metric_type}
              onChange={(event) => this.changeMovementData(event)}/>
            <input
              className='form-control form-control-sm'
              type='text'
              name='metric_value'
              placeholder={this.state.movement_class_data.metric}
              onChange={(event) => this.changeMovementData(event)}/>
          </div>
      )
    }
  }
}

export default Movement;
