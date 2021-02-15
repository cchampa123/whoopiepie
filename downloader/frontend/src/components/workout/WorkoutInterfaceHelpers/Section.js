import React from 'react';
import Movement from './Movement';
import axios from 'axios';
import TimeField from 'react-simple-timefield'
import SectionAdder from './SectionAdder'
import Deleter from './Deleter'
import Modal from 'react-bootstrap/Modal'

class Section extends React.Component {

  constructor() {
    super()
    this.state = {
      id:-1,
      metric_type:"For Time",
      rounds:1,
      time:'00:00:00',
      section_type:'Strength',
      workout:'',
      movements:[],
      show_editor:false,
      movements_to_delete:[],
      editing_movements:false,
      confirmDeleteMovements:false
    }
    this.addMovement = this.addMovement.bind(this)
    this.updateSectionInfo = this.updateSectionInfo.bind(this)
    this.reset_function=this.reset_function.bind(this)
    this.changeMovementDeletionStatus = this.changeMovementDeletionStatus.bind(this)
  }

  componentDidMount() {
    axios.get('/api/workout/section/'+this.props.section_id+'/').then(res => {
      this.setState(prevState => ({
        ...prevState,
        id:res.data.id,
        metric_type:res.data.metric_type,
        rounds:res.data.rounds,
        time:res.data.time,
        workout:res.data.workout,
        movements:res.data.movements,
        section_type:res.data.section_type
      }))
    })
  }

  componentDidUpdate() {
    axios.put('/api/workout/section/'+this.props.section_id+'/',
    {
      id:this.state.id,
      metric_type:this.state.metric_type,
      rounds:this.state.rounds,
      time:this.state.time,
      workout:this.state.workout,
      movements:this.state.movements,
      section_type:this.state.section_type
    }
    )
  }

  addMovement () {
    axios.post('/api/workout/movement_instance/',
      {
        'metric_type_value':0,
        'metric_value':0,
        'name':1,
        'section':this.props.section_id
      }
    ).then(res => {this.setState(prevState => ({
            ...prevState,
            movements:this.state.movements.concat(res.data.id)})
          )})
  }

  handleChange(value, name) {
    this.setState(prevState => ({
      ...prevState,
      [name]:value,
    }))
  }

  createText(){
    const round_or_rounds = this.state.rounds > 1 ? "rounds" : "round"
    if (this.state.metric_type === 'AMRAP'){
      return "AMRAP "+this.state.time+" - "+this.state.rounds+' '+round_or_rounds+":"
    } else {
      return this.state.rounds+' '+round_or_rounds+' for time:'
    }
  }

  updateSectionInfo(data) {
    this.setState(prevState => ({
      ...prevState,
      metric_type:data.metric_type,
      rounds:data.rounds,
      time:data.time,
      workout:data.workout,
      section_type:data.section_type
    }))
  }

  reset_function() {
    this.props.section_remover(this.props.section_id)
  }

  changeMovementDeletionStatus(x) {
    if (this.state.movements_to_delete.indexOf(x) > -1) {
      this.setState(prevState => ({
        ...prevState,
        movements_to_delete:this.state.movements_to_delete.filter(y=>y!==x)
      }))
    } else {
      this.setState(prevState => ({
        ...prevState,
        movements_to_delete:this.state.movements_to_delete.concat(x)
      }))
    }
  }

  deleteMovements(){
    const promiseArray = this.state.movements_to_delete.map(x => axios.delete('/api/workout/movement_instance/'+x+'/'))
    this.setState(prevState => ({
      ...prevState,
      movements:prevState.movements.filter(x => prevState.movements_to_delete.indexOf(x) <= -1),
      movements_to_delete:[],
      editing_movements:false,
      confirmDeleteMovements:false
    }))
    Promise.all(promiseArray)
  }

  render() {
    const movements = this.state.movements.map(function(x, index) {
                    if (x) {
                      return(
                              <Movement
                                  key={x}
                                  checked={this.state.movements_to_delete.indexOf(x) > -1}
                                  editing_movements={this.state.editing_movements}
                                  onChangeCallback={() => this.changeMovementDeletionStatus(x)}
                                  movement_id={x}
                                  section_id={this.props.section_id}
                                />
                            )
                    } else {
                      return null
                    }
                    }, this)

    return (
      <div className="card d-flex">
        {this.state.show_editor ?
        <SectionAdder
          data={this.state}
          updateSectionInfo={this.updateSectionInfo}
          finishEditing={() => this.handleChange(false, 'show_editor')}
        /> :
        <div/>
        }
        <div className='card-header'>
          <h4>{this.state.section_type}</h4>
          <h5>{this.createText()}</h5>
          <div className='row'>
            <button className='btn btn-warning btn' onClick={() => this.handleChange(true, 'show_editor')}>Edit Information</button>
            <Deleter
              type_of_object='section'
              object_id={this.props.section_id}
              callback={this.reset_function}
              text='Delete Section'
            />
            {this.state.editing_movements ?
              <div>
              <button className='btn btn-secondary' onClick={() => this.setState(prevState => ({...prevState, editing_movements:false}))}>Stop editing</button>
              <button className='btn btn-danger' onClick={() => this.setState(prevState => ({...prevState, confirmDeleteMovements:true}))}>Delete Movements</button>
              <Modal show={this.state.confirmDeleteMovements}>
                <Modal.Body>
                  Are you sure you want to delete these movements?
                </Modal.Body>
                <Modal.Footer>
                  <button className='btn btn-danger' onClick={() => this.deleteMovements()}>Confirm</button>
                  <button className='btn btn-secondary' onClick={() => this.setState(prevState => ({...prevState, editing_movements:false, confirmDeleteMovements:false}))}>Cancel</button>
                </Modal.Footer>
              </Modal>
              </div>
              :
              <button className='btn btn-secondary' onClick={() => this.setState(prevState => ({...prevState, editing_movements:true}))}>Edit Movements</button>}
          </div>
        </div>
        <div className='card-body'>
        {movements}
        </div>
        <div className='card-footer'>
        <button className='btn btn-secondary' onClick={this.addMovement}>Add Movement</button>
        </div>
      </div>
      )
  }
}


export default Section;
