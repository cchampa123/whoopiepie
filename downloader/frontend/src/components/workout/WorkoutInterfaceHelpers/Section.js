import React from 'react';
import Movement from './Movement'

class Section extends React.Component {

  constructor() {
    super()
    this.state = {}
    this.addMovementLocal = this.addMovementLocal.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.movements !== this.props.movements) {
      this.setState({})
    }
  }

  addMovementLocal () {
    this.props.addMovement(this.props.id)
  }

  render() {
    const movements = this.props.movements.map(function(x, index) {
                    const filtered = this.props.possible_movements.filter(y => y.id===x.id)
                    const movement_to_render = filtered.length > 0 ? filtered[0] : {id:-1, name:'', metric_type:'Reps', metric_type_value:'Weight'}
                    return (<Movement
                              key={index}
                              id={index}
                              possible_movements={this.props.possible_movements}
                              section_id={this.props.section_id}
                              selected_movement={movement_to_render}
                              handleUpdateMovementName={this.props.handleUpdateMovementName}
                              handleUpdateMovementData={this.props.handleUpdateMovementData}
                            />
                          )
                    }, this)

    return (
      <div>
        {movements}
        <button onClick={this.addMovementLocal}>Add Movement</button>
      </div>
      )
  }
}


export default Section;
