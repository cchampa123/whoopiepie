import React from 'react';
import axios from 'axios';
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts';
import moment from 'moment';

class MovementViewer extends React.Component {

  constructor() {
    super()
    this.state = {
      movement_history:[],
      loading:true
    }
    this.customTooltip = this.customTooltip.bind(this)
  }

  componentDidMount() {
    axios.get(
      '/api/workout/movement_instance/',
      {params:{
        'name':this.props.movement.id,
        'section__workout__end_time__isnull':false,
        'agg_column':'metric_value',
        'agg_func':'max',
        'group_columns':'section__workout__end_time,metric_type_value'
      }}
    ).then(res => this.setState({
                    movement_history:res.data.map(x=>({
                        ...x, completed_on:new Date(x.section__workout__end_time).getTime()
                      })),
                    loading:false
                  })
            )
  }

  customTooltip(e){
    if (e.active && e.payload != null && e.payload[0]!=null){
      return (
        <div className='card'>
          <p>{moment(e.payload[0].payload['completed_on']).format('MMM DD, YYYY')}</p>
          <p>{e.payload[0].payload['metric_type_value'] + ' '+this.props.movement.metric_type+' at '+e.payload[0].payload['value']}</p>
        </div>
      )
    } else {
      return ""
    }
  }

  render() {
    // if (this.state.movement_history.length > 0) {
    //   debugger
    // }
    const chartData=this.state.movement_history.length === 0 ? {} :
    this.state.movement_history.reduce((movementsByMetricTypeValue, object) => {
      const value = object['metric_type_value']
      movementsByMetricTypeValue[value] = (movementsByMetricTypeValue[value] || []).concat(object)
      return movementsByMetricTypeValue
    }, {})
    return(
      <div className='card'>
        <div className='card-header'>
          <h5>{this.props.movement.name}</h5>
        </div>
        <div className='card-body'>
          {
          this.state.loading ?
            <p>Loading...</p>
            :
            <LineChart width={300} height={300}>
              <CartesianGrid stroke="#ccc"/>
              <XAxis
                dataKey='completed_on'
                type='number'
                domain={['auto', 'auto']}
                tickCount={5}
                tickFormatter={number => (moment(number).format('M/D'))}/>
              <YAxis />
              <Tooltip content={this.customTooltip}/>
              {Object.entries(chartData).map(x => <Line key={x[0]} data={x[1]} dataKey='value'/>)}
            </LineChart>
          }
        </div>

      </div>
    )
  }

}

export default MovementViewer
