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
          metric_type_value:'',
          metric_value:'',
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
        duplicate:1,
        added_new_movement:false,
        new_movement_name:''
      }
    this.completeAddNewMovement = this.completeAddNewMovement.bind(this)

  }

  updateMovementData() {
    const options_holder = axios.get('/api/workout/movement_class/')
    const movement_data_holder = axios.get('/api/workout/movement_instance/'+this.props.movement_id+'/')
    Promise.all([options_holder, movement_data_holder]).then(responses =>
      this.setState(prevState => ({
          ...prevState,
          possible_options:responses[0].data.filter(x => x.id !== 1),
          movement_data:responses[1].data
        }))
      ).then(() => {
          axios.get('/api/workout/movement_class/'+this.state.movement_data.name+'/').then(res =>
            this.setState(prevState => ({...prevState, movement_class_data:res.data}))
      )
    })
  }

  componentDidMount() {
    this.updateMovementData()
  }

  componentDidUpdate() {
    if (this.state.movement_data.metric_type_value !== '' && this.state.movement_data.metric_value !== '') {
    axios.put('/api/workout/movement_instance/'+String(this.props.movement_id)+'/',
            this.state.movement_data
        )
    }
  }

  changeSelectedMovement(selected) {
    if (selected.length > 0 && 'customOption' in selected[0]) {
      this.setState(prevState => ({...prevState,
                      added_new_movement:true,
                      new_movement_name:selected[0].name}))
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
    this.setState(prevState => ({...prevState, added_new_movement:false, new_movement_name:''}))
  }

  changeMovementData(event) {
    event.persist()
    this.setState(prevState => ({
      ...prevState,
      movement_data:{
        ...prevState.movement_data,
        [event.target.name]:event.target.value
      }
    }))
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
          <div className='row row-cols-3'>
          {this.props.editing_movements &&
            <input
              className='form-check-input'
              type='checkbox'
              checked={this.props.checked}
              onChange={this.props.onChangeCallback}
            />}
            <Typeahead
              allowNew
              newSelectionPrefix='Add a new movement: '
              labelKey='name'
              options={this.state.possible_options}
              id='movementTypeahead'
              className='col'
              style={{paddingLeft:0, paddingRight:0}}
              onChange={(selected) => this.changeSelectedMovement(selected)}
              onInputChange={(value) => this.setState(prevState => ({...prevState, movement_class_data:{...this.state.movement_class_data, name:value}}))}
              selected={[this.state.movement_class_data]}
              placeholder='Movement'/>
            <input
              className='form-control col'
              type='number'
              name='metric_type_value'
              value={this.state.movement_data.metric_type_value}
              placeholder={this.state.movement_class_data.metric_type}
              onChange={(event) => this.changeMovementData(event)}/>
            <input
              className='form-control col'
              type='number'
              name='metric_value'
              value={this.state.movement_data.metric_value}
              placeholder={this.state.movement_class_data.metric}
              onChange={(event) => this.changeMovementData(event)}/>
          </div>
      )
    }
  }
}

export default Movement;
