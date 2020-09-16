import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player/youtube'

class _Player extends Component {
    state = {
        url: null,
        pip: false,
        playing: true,
        light: false,
        volume: 0.8,
        muted: false,
        played: 0,
        loaded: 0,
        duration: 0,
        playbackRate: 1.0,
        loop: false
    }

    componentDidMount() {
        this.setState({ url: this.props.url })
    }

    load = url => {
        this.setState({
            url,
            played: 0,
            loaded: 0,
            pip: false
        })
    }

    handlePlayPause = () => {
        this.setState({ playing: !this.state.playing })
    }

    handleStop = () => {
        this.setState({ url: null, playing: false })
    }

    handleToggleLight = () => {
        this.setState({ light: !this.state.light })
    }

    handleToggleLoop = () => {
        this.setState({ loop: !this.state.loop })
    }

    handleVolumeChange = e => {
        this.setState({ volume: parseFloat(e.target.value) })
    }

    handleToggleMuted = () => {
        this.setState({ muted: !this.state.muted })
    }

    handleSetPlaybackRate = e => {
        this.setState({ playbackRate: parseFloat(e.target.value) })
    }

    handleTogglePIP = () => {
        this.setState({ pip: !this.state.pip })
    }

    handlePlay = () => {
        console.log('onPlay')
        this.setState({ playing: true })
    }

    handleEnablePIP = () => {
        console.log('onEnablePIP')
        this.setState({ pip: true })
    }

    handleDisablePIP = () => {
        console.log('onDisablePIP')
        this.setState({ pip: false })
    }

    handlePause = () => {
        console.log('onPause')
        this.setState({ playing: false })
    }

    handleSeekMouseDown = e => {
        this.setState({ seeking: true })
    }

    handleSeekChange = e => {
        this.setState({ played: parseFloat(e.target.value) })
    }

    handleSeekMouseUp = e => {
        this.setState({ seeking: false })
        this.player.seekTo(parseFloat(e.target.value))
    }

    handleProgress = state => {
        console.log('onProgress', state)
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
            this.setState(state)
        }
    }

    handleEnded = () => {
        console.log('onEnded')
        this.setState({ playing: this.state.loop })
    }

    handleDuration = (duration) => {
        console.log('onDuration', duration)
        this.setState({ duration })
    }

    renderLoadButton = (url, label) => {
        return (
            <button onClick={() => this.load(url)}>
                {label}
            </button>
        )
    }

    ref = player => {
        this.player = player
    }

    handleInput = ({ target }) => {
        const field = target.name;
        const value = target.value;

        this.setState({ [field]: value });
    }

    render() {
        return (this.state.url) ? null : (
            <div className="player-container">
                <input type="text" name="url" value={this.state.url} onChange={this.handleInput} />
                <ReactPlayer
                    url={this.state.url}
                    playing={this.state.playing}
                />

                <div className="player-song-preview">
                    song image
                    song artist
                    song title
                    </div>
                <div className="player-controls">
                    <button>play</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        currBox: state.boxReducer.currBox
    }
}

const mapDispatchToProps = {

}

export const Player = connect(mapStateToProps, mapDispatchToProps)(_Player);