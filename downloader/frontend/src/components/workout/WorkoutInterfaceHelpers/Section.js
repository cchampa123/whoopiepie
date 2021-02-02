import React from 'react';
import Movement from './Movement';
import axios from 'axios';
import TimeField from 'react-simple-timefield'

class Section extends React.Component {

  constructor() {
    super()
    this.state = {
      id:-1,
      metric_type:'',
      rounds:'',
      time:'00:00:00',
      workout:'',
      movements:[],
      added_movement:false,
      fetch_data:false,
      update_section_data:false
    }
    this.addMovement = this.addMovement.bind(this)
    this.update_section_data = this.update_section_data.bind(this)
  }

  update_section_data() {
    return (
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
    )
  }

  componentDidMount() {
    this.update_section_data()
  }

  componentDidUpdate() {
    if (this.state.fetch_data) {
      this.update_section_data().then(
        this.setState({...this.state, fetch_data:false})
      )
    }
    if (this.state.update_section_data && this.state.rounds !== '') {
      axios.patch('/api/workout/section/'+String(this.props.section_id)+'/',
          {
            'metric_type':this.state.metric_type,
            'rounds':this.state.rounds,
            'time':this.state.time
          }
      ).then(
        this.setState({...this.state, update_section_data:false})
      )
    }
  }

  addMovement () {
    axios.post('/api/workout/movement_instance/',
      {
        'metric_type_value':0,
        'metric_value':0,
        'name':1,
        'section':this.props.section_id
      }
    ).then(this.setState({...this.state, fetch_data:true}))
  }

  handleChange(value, name) {
    this.setState({
      ...this.state,
      [name]:value,
      update_section_data:true
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
      <div className="border">
        <form onSubmit={event => this.handleSubmit(event)}>
          <div className='input-group'>
            <div>
              <label>Type of Section</label>
              <select name='metric_type' value={this.state.metric_type} onChange={event => this.handleChange(event.target.value, event.target.name)}>
                <option value='AMRAP'>AMRAP</option>
                <option value='For Time'>For Time</option>
              </select>
            </div>
            <div>
              <label>Rounds</label>
              <input name='rounds' type='text' value={this.state.rounds} onChange={event => this.handleChange(event.target.value, event.target.name)}/>
            </div>
            <div>
              <label>Time</label>
              <TimeField name='time' style={{width: 170}} value={this.state.time} showSeconds='true' onChange={(event, value) => this.handleChange(value, 'time')}/>
            </div>
          </div>
        </form>
        {movements}
        <button onClick={this.addMovement}>Add Movement</button>
      </div>
      )
  }
}


export default Section;
