import React from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal'
import TimeField from 'react-simple-timefield'

class SectionAdder extends React.Component {

  constructor(props){
    super()
    this.state = {
      metric_type:"For Time",
      rounds:1,
      time:'00:00:00',
      workout:'',
      section_type:'Strength',
      movements:[]
    }
  }

  componentDidMount () {
    this.setState({
      metric_type:this.props.data.metric_type,
      rounds:this.props.data.rounds,
      time:this.props.data.time,
      workout:this.props.data.workout,
      movements:this.props.data.movements,
      section_type:this.props.data.section_type
    })
  }

  componentWillUnmount(){
      this.props.updateSectionInfo(this.state)
    }

  handleChange(value, name) {
    this.setState(prevState => ({
      ...prevState,
      [name]:value,
    }))
  }

  render() {
    return (
      <Modal show={this.props.data.show_editor}>
        <Modal.Header>
              Enter Section Information
        </Modal.Header>
        <Modal.Body>
          <div className='form-group'>
            <label>Metric Type</label>
            <div>
              <select
                name='metric_type'
                className='custom-select'
                onChange={event => this.handleChange(event.target.value, event.target.name)}
                value={this.state.metric_type}
              >
              <option value='For Time'>For Time</option>
              <option value='AMRAP'>AMRAP</option>
              </select>
            </div>
          </div>
          <div className='form-group'>
            <label>Rounds</label>
            <div>
              <input
                name='rounds'
                className='form-control'
                onChange={event => this.handleChange(event.target.value, event.target.name)}
                value={this.state.rounds}
              />
            </div>
          </div>
          <div className='form-group'>
            <label>Time</label>
            <div>
              <TimeField
                name='time'
                className='form-control'
                style={{width: 170}}
                value={this.state.time}
                showSeconds='true'
                onChange={(event, value) => this.handleChange(value, 'time')}
              />
            </div>
          </div>
          <div className='form-group'>
            <label className='control-label'>Section Type</label>
            <div>
              <select
                name='section_type'
                className='custom-select'
                value={this.state.section_type}
                onChange={event => this.handleChange(event.target.value, event.target.name)}
              >
                <option value="Strength">Strength</option>
                <option value="MetCon">MetCon</option>
                <option value="Conditioning">Conditioning</option>
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-primary' onClick={this.props.finishEditing}>Submit Section</button>
        </Modal.Footer>
    </Modal>
    )
  }
}

export default SectionAdder;
