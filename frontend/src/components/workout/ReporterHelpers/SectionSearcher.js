import React from 'react';
import axios from 'axios'
import {Typeahead} from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import {Section as SectionQuickView} from '../WorkoutQuickView'

class SectionSearcher extends React.Component {

  constructor() {
    super()
    this.state={
      section_type:'',
      movements:[],
      filtered_movements:[],
      sections:[],
      loading:true
    }
    this.handleChange = this.handleChange.bind(this)
    this.changeTypeaheadSelected = this.changeTypeaheadSelected.bind(this)
  }

  componentDidMount() {
    axios.get('/api/workout/movement_class/').then(res => this.setState(prevState => ({
      ...prevState,
      movements:res.data,
      loading:false
    })))
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.filtered_movements !== prevState.filtered_movements && this.state.filtered_movements.length!==0) {
      axios.get('/api/workout/section/',
      {params:{
        movement:this.state.filtered_movements.map(x=>x.id).join(),
        section_type:this.state.section_type
      }}
    ).then(res=>this.setState(prevState => ({...prevState, sections:res.data})))
    }
  }

  handleChange(name, value) {
    this.setState(prevState => ({...prevState, [name]:value}))
  }

  changeTypeaheadSelected(selected) {
    if (selected.length===0) {
      this.setState(prevState => ({...prevState, filtered_movements:[], sections:[]}))
    } else {
      this.setState(prevState => ({...prevState, filtered_movements:selected}))
    }
  }

  render() {
    return (
      <div>
      {
      this.state.loading ?
      <div/>
      :
      <div>
        <div>
          <h5>Search</h5>
          <div>
            <select
              name='section_type'
              className='custom-select'
              value={this.state.section_type}
              onChange={(event) => this.handleChange(event.target.name, event.target.value)}
            >
              <option value='Strength'>Strength</option>
              <option value='MetCon'>MetCon</option>
              <option value='Conditioning'>Conditioning</option>
            </select>
            <Typeahead
              id='movementSearcher'
              labelKey='name'
              multiple
              onChange={(selected) => this.changeTypeaheadSelected(selected)}
              options={this.state.movements}
              placeholder='Search for movements'
              selected={this.state.filtered_movements}
            />
          </div>
        </div>
        <div className='container'>
          {this.state.sections.map(x=><SectionQuickView key={x.id} section_id={x.id}/>)}
        </div>
      </div>
      }
      </div>
    )
  }

}

export default SectionSearcher;
