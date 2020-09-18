import React, { Component } from 'react';
import ReactPlayer from 'react-player/youtube'
import { connect } from 'react-redux';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import { updatePlayerBox } from '../store/actions/playerActions';
import Slider from '@material-ui/core/Slider';

class _Player extends Component {
    state = {
        isSmall: false,
        playerBox: null,
        song: '',
        playing: true,
        muted: false,
        volume: 0.35,
        played: 0,
        duration: undefined
    }

    componentDidMount() {
        console.log('hi')
        this.setState({ currBox: this.props.playerBox });
    }

    componentDidUpdate(prevProps, prevState) {
        const { playerBox } = this.props;
        // Prevent loop:
        if (prevProps.playerBox === playerBox) return;

        if (!this.state.playerBox) {
            this.setState({ playerBox }, () => this.load(0));
            return;
        }

        // if same box id, just update playerbox in state
        if (prevProps.playerBox._id === playerBox._id) {
            this.setState({ playerBox });
            return;
        }
        // if different box -> setstate and load song idx 0 to player.
        if (prevProps.playerBox && prevProps.playerBox._id !== playerBox._id) {
            this.setState({ playerBox }, () => this.load(0));
        }
    }

    load = (currSongIdx = 0) => {
        const newBox = { ...this.state.playerBox, currSongIdx }
        this.props.updatePlayerBox(newBox)
        this.play();
    }

    play = () => {
        this.setState({ playing: true });
    }

    skipToSong = (skip) => {
        const { currSongIdx } = this.state.playerBox;
        const songsIdxLength = this.state.playerBox.songs.length - 1

        var nextSongIdx = currSongIdx + skip;
        if (nextSongIdx === -1) nextSongIdx = songsIdxLength;
        else if (nextSongIdx > songsIdxLength) nextSongIdx = 0;

        const updatedBox = { ...this.state.playerBox, currSongIdx: nextSongIdx };
        this.props.updatePlayerBox(updatedBox);
        this.load(nextSongIdx);
        this.play();
    }


    togglePlay = () => {
        this.setState({ playing: !this.state.playing });
    }

    handleStop = () => {
        this.setState({ url: null, playing: false })
    }

    handleVolumeChange = (ev, value) => {
        this.setState({ volume: value })
    }

    toggleMute = () => {
        this.setState({ muted: !this.state.muted })
    }

    handleSeekMouseDown = (ev, value) => {
        this.setState({ seeking: true })
    }

    handleSeekChange = (ev, value) => {
        if (value > this.state.duration) {
            value = this.state.duration - 5
        }
        this.setState({ played: value });
    }

    handleSeekMouseUp = (ev, value) => {
        this.setState({ seeking: false });
        this.player.seekTo(this.state.played);
    }

    handleProgress = state => {
        if (!this.state.seeking) {
            this.setState({ played: state.playedSeconds });
        }
    }

    handleEnded = () => {
        this.skipToSong(1);
    }

    handleDuration = (duration) => {
        this.setState({ duration })
    }

    ref = player => {
        this.player = player
    }

    render() {
        const { playerBox, playing, volume, muted, duration } = this.state
        if (!playerBox) return null;
        const song = playerBox.songs[playerBox.currSongIdx]

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

        return <React.Fragment>

            {
                song && <div className={`player-container flex align-center space-between ${playing ? 'is-playing' : ''}`}>
                    <ReactPlayer
                        ref={this.ref}
                        className="player"
                        url={`https://www.youtube.com/watch?v=${song.id}`}
                        playing={playing}
                        controls={false}
                        volume={volume}
                        muted={muted}
                        onPlay={this.handlePlay}
                        onPause={this.handlePause}
                        onEnded={this.handleEnded}
                        onProgress={this.handleProgress}
                        onDuration={this.handleDuration}
                    />
                    <div className="player-song-details flex align-center">
                        <img className="player-thumbnail" src={song.imgUrl.url} alt="song thumbnail" />
                        <p className="player-title">{song.title}</p>
                    </div>

                    <span>{showTime(this.state.played)}</span>
                    <Slider
                        style={{
                            width: '70px',
                            color: 'white'
                        }}
                        name="played"
                        min={0}
                        max={duration}
                        onMouseDown={this.handleSeekMouseDown}
                        onMouseUp={this.handleSeekMouseUp}
                        onChange={this.handleSeekChange}
                        value={this.state.played}
                    />
                    {duration && <span>{showTime(duration)}</span>}

                    <div className="player-controls flex align-center">
                        <button className="player-ctrl" onClick={() => this.skipToSong(-1)}><SkipPreviousIcon /></button>
                        <button className="player-ctrl" onClick={this.togglePlay}>{playing ? <PauseIcon /> : <PlayArrowIcon />}</button>
                        <button className="player-ctrl" onClick={() => this.skipToSong(1)}><SkipNextIcon /></button>


                        <Slider
                            style={{
                                height: '50px',
                                color: 'white'
                            }}
                            value={volume}
                            min={0}
                            step={0.05}
                            max={1}
                            orientation="vertical"
                            onChange={this.handleVolumeChange}
                        />
                        <button className="player-ctrl" onClick={this.toggleMute}>{muted ? <VolumeMuteIcon /> : <VolumeUpIcon />}</button>

                    </div>

                </div>
            }
        </React.Fragment>
    }
}


const mapStateToProps = state => {
    return {
        playerBox: state.playerReducer.playerBox
    }
}

const mapDispatchToProps = {
    updatePlayerBox
}

export const Player = connect(mapStateToProps, mapDispatchToProps)(_Player);