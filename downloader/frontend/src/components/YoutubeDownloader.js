import React from 'react';
import axios from 'axios';

class YoutubeDownloader extends React.Component {
  constructor() {
    super()
    this.state = {
      youtube_url:"",
      artist:"",
      album:"",
      title:"",
      loading:false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.setState((prevState) => ({...prevState, loading: true}))
    axios.post('/api/downloader/youtube_url/',
      {
        'youtube_url':this.state.youtube_url,
        'artist':this.state.artist,
        'album':this.state.album,
        'title':this.state.album,
      },
      {
        headers:{
          'Authorization':'Token '+this.props.token
        }
      }
    )
    .then(response =>
      this.setState({
        youtube_url:"",
        artist:"",
        album:"",
        title:"",
        loading:false
      })
    )
  }

  render() {
    if (this.state.loading) {
      return (<h2>Loading...</h2>)
    } else {
      return (
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Youtube URL</label>
            <div>
              <input
                type="text"
                name="youtube_url"
                placeholder="Insert URL"
                onChange={this.handleChange}
                value = {this.state.youtube_url}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Artist</label>
            <div>
              <input
                type="text"
                name="artist"
                placeholder="Insert Artist"
                onChange={this.handleChange}
                value = {this.state.artist}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Album</label>
            <div>
              <input
                type="text"
                name="album"
                placeholder="Insert Album"
                onChange={this.handleChange}
                value = {this.state.album}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Title</label>
            <div>
              <input
                type="text"
                name="title"
                placeholder="Insert Title"
                onChange={this.handleChange}
                value = {this.state.title}
              />
            </div>
          </div>
          <div>
            <button type="submit">Download</button>
          </div>
        </form>
      )
    }
  }
}

export default YoutubeDownloader;
