import React from 'react';
import Movement from './Movement';
import axios from 'axios';

class Section extends React.Component {

  constructor() {
    super()
    this.state = {
      id:-1,
      metric_type:'',
      rounds:'',
      time:'',
      workout:'',
      movements:[],
      added_movement:false,
      fetch_data:false
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
      <div>
        {movements}
        <button onClick={this.addMovement}>Add Movement</button>
      </div>
      )
  }
}


export default Section;
