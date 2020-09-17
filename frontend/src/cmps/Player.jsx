import React, { Component } from 'react';
import ReactPlayer from 'react-player/youtube'
import { connect } from 'react-redux';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

class _Player extends Component {
    state = {
        playerBox: null,
        song: '',
        playing: false,
        muted: false,
        volume: 0.35,
        played: 0,
    }

    componentDidMount() {
        this.setState({ currBox: this.props.playerBox }, console.log(this.state.playerBox));
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.playerBox === this.props.playerBox) return;
        console.log('inside', this.state.playerBox)
        const { playerBox } = this.props;
        this.setState({ playerBox: playerBox }, () => this.load(playerBox.currSongIdx));
    }

    load = (currSongIdx = 0) => {
        const song = this.state.playerBox.songs[currSongIdx];
        this.setState({ song });
        this.play();
    }
    play = () => {
        this.setState({ playing: true });
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
        const { song, playing, volume, muted, played, loaded, duration } = this.state

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

        return song && <div className={`player-container flex align-center space-between ${playing ? 'is-playing' : ''}`}>
            <ReactPlayer
                ref={this.ref}
                className="player"
                url={`https://www.youtube.com/watch?v=${song.id}`}
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
                <img className="player-thumbnail" src={song.imgUrl.url} alt="song thumbnail" />
                <p>{song.title}</p>
            </div>

            <div className="player-controls">
                {/* {playing ? <img className="playing-animation" src={require('../assets/img/fxVE.gif')} alt="play animation" /> : ''} */}
                <button class="player-ctrl" onClick={() => this.skipToSong(-1)}><SkipPreviousIcon /></button>
                <button class="player-ctrl" onClick={this.togglePlay}>{playing ? <PauseIcon /> : <PlayArrowIcon />}</button>
                <button class="player-ctrl" onClick={() => this.skipToSong(1)}><SkipNextIcon /></button>
                <button class="player-ctrl" onClick={this.toggleMute}>{muted ? <VolumeMuteIcon /> : <VolumeUpIcon />}</button>
                <span>{showTime(this.state.played)}</span>
                <input type="range" name="" value="" />
                {this.state.duration && <span>{showTime(this.state.duration)}</span>}
                <input type="range" name="" value="" />
            </div>
            <div></div>

        </div>
    }
}


const mapStateToProps = state => {
    return {
        playerBox: state.playerReducer.playerBox
    }
}

const mapDispatchToProps = {

}

export const Player = connect(mapStateToProps, mapDispatchToProps)(_Player);