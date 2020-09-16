import React, { Component } from 'react'
import ReactPlayer from 'react-player'


export class Player extends Component {
    state = {
        playing: null
    }

    onStart = (ev) => {
        console.log('hi', ev)
        this.setState({ playing: !this.state.playing })
    }

    render() {
        return (
            <div>
                <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' playing={this.state.playing} />
                <button onClick={this.onStart}>Play</button>
            </div>
        )
    }
}
