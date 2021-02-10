import React from 'react';
import Movement from './Movement';
import axios from 'axios';
import TimeField from 'react-simple-timefield'
import SectionAdder from './SectionAdder'

class Section extends React.Component {

  constructor() {
    super()
    this.state = {
      id:-1,
      metric_type:"For Time",
      rounds:1,
      time:'00:00:00',
      workout:'',
      movements:[],
      show_editor:false
    }
    this.addMovement = this.addMovement.bind(this)
    this.updateSectionInfo = this.updateSectionInfo.bind(this)
  }

  componentDidMount() {
    axios.get('/api/workout/section/'+this.props.section_id+'/').then(res => {
      this.setState({
        id:res.data.id,
        metric_type:res.data.metric_type,
        rounds:res.data.rounds,
        time:res.data.time,
        workout:res.data.workout,
        movements:res.data.movements
      })
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
      movements:this.state.movements
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
    ).then(res => {this.setState({
            ...this.state,
            movements:this.state.movements.concat(res.data.id)}
          )})
  }

  handleChange(value, name) {
    this.setState({
      ...this.state,
      [name]:value,
    })
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
    this.setState({
      ...this.state,
      metric_type:data.metric_type,
      rounds:data.rounds,
      time:data.time,
      workout:data.workout,
    })
  }

  render() {
    const movements = this.state.movements.map(function(x, index) {
                    if (x) {
                      return <Movement
                                key={index}
                                movement_id={x}
                                section_id={this.props.section_id}
                              />
                    } else {
                      return null
                    }
                    }, this)

    return (
      <div className="card">
        {this.state.show_editor ?
        <SectionAdder
          data={this.state}
          updateSectionInfo={this.updateSectionInfo}
          finishEditing={() => this.handleChange(false, 'show_editor')}
        /> :
        <div/>
        }
        <div className='card-header'>
          <h4>{this.createText()}</h4>
          <button className='btn btn-warning btn-sm' onClick={() => this.handleChange(true, 'show_editor')}>Edit Information</button>
        </div>
        <div className='card-body'>
        {movements}
        </div>
        <div className='card-footer'>
        <button className='btn btn-secondary btn-sm' onClick={this.addMovement}>Add Movement</button>
        </div>
      </div>
      )
  }
}


export default Section;
