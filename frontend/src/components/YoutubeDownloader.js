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
      audio_video:"audio",
      tv_show:"",
      season:"",
      episode:"",
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
        'title':this.state.title,
        'tv_show':this.state.tv_show,
        'season':this.state.season,
        'episode':this.state.episode,
        'audio_video':this.state.audio_video
      }
    )
    .then(response =>
      this.setState({
        youtube_url:"",
        artist:"",
        album:"",
        title:"",
        tv_show:"",
        season:"",
        episode:"",
        audio_video:"audio",
        loading:false
      })
    )
  }

  render() {
    let form_options;
    if (this.state.loading) {
      return (<h2>Loading...</h2>)
    } else if (this.state.audio_video === "audio") {
      form_options = (
          <div>
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
          </div>
      )
    } else {
      form_options = (
        <div>
          <div className="form-group">
            <label>TV Show</label>
            <div>
              <input
                type="text"
                name="tv_show"
                placeholder="Insert Show Title"
                onChange={this.handleChange}
                value = {this.state.tv_show}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Season</label>
            <div>
              <input
                type="text"
                name="season"
                placeholder="Insert Season Number"
                onChange={this.handleChange}
                value = {this.state.season}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Episode</label>
            <div>
              <input
                type="text"
                name="episode"
                placeholder="Insert Episode Number"
                onChange={this.handleChange}
                value = {this.state.episode}
              />
            </div>
          </div>
        </div>
      )
    }
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
          <label>Audio or Video?</label>
          <div>
            <select
              name="audio_video"
              onChange={this.handleChange}
              value = {this.state.audio_video}
            >
            <option value="audio">Audio</option>
            <option value="video">Video</option>
            </select>
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
        {form_options}
        <div>
          <button type="submit">Download</button>
        </div>
      </form>
      )
    }
  }

export default YoutubeDownloader;
