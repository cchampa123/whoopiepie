import React from 'react';
import axios from 'axios';

class Movement extends React.Component {

  constructor() {
    super()
    this.state = {
      movement_data:{
        id:null,
        metric_type_value:null,
        metric_value:null,
        name:null
      },
      movement_class_data:{
        id:null,
        name:'',
        metric_type:'',
        metric:''
      }
    }
  }

  componentDidMount() {
    axios.get('/api/workout/movement_instance/'+String(this.props.movement_id)+'/').then(resA =>
      Promise.all([
        resA,
        axios.get('/api/workout/movement_class/'+String(resA.data.name)+'/')
      ])
    ).then(([resA, resB]) => {this.setState({
                                  movement_data:{
                                    id:resA.data.id,
                                    metric_type_value:resA.data.metric_type_value,
                                    metric_value:resA.data.metric_value,
                                    name:resA.data.name
                                  },
                                  movement_class_data:{
                                    id:resB.data.id,
                                    name:resB.data.name,
                                    metric_type:resB.data.metric_type,
                                    metric:resB.data.metric
                                  }
                                })
                            })
  }

  render(){
    const text = this.state.movement_class_data.name+' : '+this.state.movement_data.metric_type_value+'@'+this.state.movement_data.metric_value
    return (
      <p style={{margin:0,paddingTop:0}}>{text}</p>
    )
  }
}

class Section extends React.Component {

  constructor() {
    super()
    this.state = {
      id:null,
      metric_type:'',
      rounds:null,
      time:null,
      movements:[]
    }
  }

  componentDidMount() {
    axios.get('/api/workout/section/'+String(this.props.section_id)+'/').then(
      res => {this.setState({
        id:res.data.id,
        metric_type:res.data.metric_type,
        rounds:res.data.rounds,
        time:res.data.time,
        movements:res.data.movements
      })}
    )
  }

  createText(){
    const round_or_rounds = this.state.rounds > 1 ? "rounds" : "round"
    if (this.state.metric_type === 'AMRAP'){
      return "AMRAP "+this.state.time+" - "+this.state.rounds+' '+round_or_rounds+":"
    } else {
      return this.state.rounds+' '+round_or_rounds+' for time:'
    }
  }

  render() {
    const movements = this.state.movements.map(x => <Movement key={x} movement_id={x}/>)
    const text = this.createText()
    return(
      <li className='list-group-item'>
        <p>{text}</p>
        {movements}
      </li>
    )
  }

}

class WorkoutQuickView extends React.Component {

  constructor() {
    super()
    this.state = {
      id:null,
      start_time:null,
      end_time:null,
      scheduled_for:null,
      sections:[]
    }
  }

  componentDidMount() {
    axios.get('/api/workout/workout/'+String(this.props.workout_id)).then((res) => {
      this.setState({
        id:res.data.id,
        start_time:res.data.start_time,
        end_time:res.data.end_time,
        scheduled_for:res.data.scheduled_for,
        sections:res.data.sections
      })
    })
  }

  render () {
    const sections = this.state.sections.map(x => <Section key={x} section_id={x}/>)
    return(
      <div className='card mb-3' style={{maxWidth: '20rem'}} onClick={this.props.onClick}>
        <div className='card-body'>
          <ul className='list-group list-group-flush'>
            {sections}
          </ul>
        </div>
      </div>
    )
  }
}

export default WorkoutQuickView;
