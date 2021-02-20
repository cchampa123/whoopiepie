import React from 'react';
import axios from 'axios';
import MovementViewer from './MovementViewer'

class MovementLibrary extends React.Component {

  constructor() {
    super()
    this.state = {
      movements:[],
      loading:true
    }
  }

  componentDidMount() {
    axios.get('/api/workout/movement_class/').then(res => this.setState({movements:res.data, loading:false})
    )
  }

  render() {
    return (
      <div>
        {this.state.loading?
          <div/>:
          this.state.movements.map(x =>
          <MovementViewer key={x.id} movement={x}/>
        )}
      </div>
    )
  }
}

export default MovementLibrary
