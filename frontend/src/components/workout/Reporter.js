import React from 'react';
import MovementLibrary from './ReporterHelpers/MovementLibrary'
import SectionSearcher from './ReporterHelpers/SectionSearcher'

class Reporter extends React.Component {

  constructor() {
    super()
    this.state = {
      selected_item:'Movement Library'
    }
    this.changeSelected = this.changeSelected.bind(this)
  }

  changeSelected(event) {
    debugger
    this.setState({selected_item:event.target.name})
  }

  render() {

    const links = [
      'Movement Library',
      'Section Browser'
    ]

    let selected_component

    if (this.state.selected_item==='Movement Library') {
      selected_component = <MovementLibrary/>
    } else if (this.state.selected_item==='Section Browser'){
      selected_component = <SectionSearcher/>
    }

    return(
      <div>
          <ul className='nav nav-pills nav-fill'>
            {links.map(x => (
              <li
                key={x}
                name={x}
                className={'nav-item'}
                onClick={() => this.setState({selected_item:x})}
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
