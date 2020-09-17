import React, { Component } from 'react';
import ReactPlayer from 'react-player/youtube'
import { connect } from 'react-redux';
// https://www.youtube.com/watch?v=SmM0653YvXU
class _Player extends Component {
    state = {
        currBox: null,
        songs: [],
        song: '',
        url: '',
        img: '',
        playing: false,
        muted: false,
        volume: 0.35,
        played: 0,
    }

    componentDidMount() {
        this.setState({ songs: this.props.currBox })
    }

    componentDidUpdate(prevProps) {
        if (prevProps === this.props) return;
        if (this.props.currBox) {
            const { currBox } = this.props;
            this.setState({ currBox: currBox, songs: currBox.songs }, () => this.load(0));
        }
        // if (!currBox) return;
        // if (!prevProps.currBox || prevProps.currBox._id !== currBox._id) {
    }

    load = (currSong) => {
        const song = this.state.songs[currSong];
        this.setState({ song })
    }

    skipToSong = (step) => {
        this.load(this.state.currSong + step);
        this.togglePlay();
    }

    togglePlay = () => {
        this.setState({ playing: !this.state.playing });
    }

    handleStop = () => {
        this.setState({ url: null, playing: false })
    }

    handleVolumeChange = (ev) => {
        this.setState({ volume: parseFloat(ev.target.value) })
    }

    toggleMute = () => {
        this.setState({ muted: !this.state.muted })
    }

    handleSeekMouseDown = (ev) => {
        this.setState({ seeking: true })
    }

    handleSeekChange = (ev) => {
        this.setState({ played: parseFloat(ev.target.value) })
    }

    handleSeekMouseUp = (ev) => {
        this.setState({ seeking: false })
        this.player.seekTo(parseFloat(ev.target.value))
    }

    handleProgress = state => {
        console.log('onProgress', state)
        if (!this.state.seeking) {
            this.setState({ played: state.playedSeconds })
        }
    }

    handleEnded = () => {
        console.log('onEnded')
        this.setState({ playing: this.state.loop })
    }

    ref = player => {
        this.player = player
    }

    handleDuration = (duration) => {
        console.log('onDuration', duration)
        this.setState({ duration })
    }

    render() {
        const { song, songs, url, playing, volume, muted, played, loaded, duration } = this.state

        function showTime(seconds) {
            var mins;
            var secs;
            if (seconds >= 60) {
                mins = (parseInt(seconds / 60)).toString();
                secs = (parseInt(seconds - mins * 60)).toString().padStart(2, '0');
            } else {
                mins = '0';
                secs = (parseInt(seconds)).toString().padStart(2, '0');
            }
            return `${mins}:${secs}`
        }

        return song && <div className="player-container flex align-center">
            <ReactPlayer
                ref={this.ref}
                className="player"
                url={url}
                playing={playing}
                controls={false}
                volume={volume}
                muted={muted}
                onReady={() => console.log('onReady')}
                onStart={() => console.log('onStart')}
                onPlay={this.handlePlay}
                onPause={this.handlePause}
                onBuffer={() => console.log('onBuffer')}
                onSeek={e => console.log('onSeek', e)}
                onEnded={this.handleEnded}
                onError={e => console.log('onError', e)}
                onProgress={this.handleProgress}
                onDuration={this.handleDuration}
            />
            <div className="player-song-details flex align-center">
                <img src={song.imgUrl} alt="song thumbnail" />
                <p>{song.title}</p>
            </div>

            <div className="player-controls">
                <span>playing gif</span>
                <button class="player-ctrl" onClick={() => this.skipToSong(-1)}>previous</button>
                <button class="player-ctrl" onClick={this.togglePlay}>{playing ? 'pause' : 'play'}</button>
                <button class="player-ctrl" onClick={() => this.skipToSong(1)}>next</button>
                <button class="player-ctrl" onClick={this.toggleMute}>Mute</button>
                <span>{showTime(this.state.played)}</span>
                <input type="range" name="" value="" />
                {this.state.duration && <span>{showTime(this.state.duration)}</span>}
                <input type="range" name="" value="" />
            </div>
        </div>
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