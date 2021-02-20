import React from 'react';
import MovementLibrary from './ReporterHelpers/MovementLibrary'

class Reporter extends React.Component {

  constructor() {
    super()
    this.state = {
      selected_item:'Movement Library'
    }
    this.changeSelected = this.changeSelected.bind(this)
  }

  changeSelected(event) {
    this.setState({selected:event.target.name})
  }

  render() {

    const links = [
      'Movement Library'
    ]

    let selected_component

    if (this.state.selected_item==='Movement Library') {
      selected_component = <MovementLibrary/>
    }

    return(
      <div>
          <ul className='nav nav-pills nav-fill'>
            {links.map(x => (
              <li
                key={x}
                name={x}
                className={'nav-item'}
                onClick={this.changeSelected}
              >
                <a className={this.state.selected_item===x?'nav-link active':'nav-link'}>
                {x}
                </a>
              </li>
            ))}
          </ul>
        {selected_component}
      </div>
    )
  }

}

export default Reporter;
