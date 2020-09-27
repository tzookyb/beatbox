// OUTSOURCE IMPORT
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player/youtube'
import { withRouter } from 'react-router-dom';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import Slider from '@material-ui/core/Slider';
import { CircleLoading } from 'react-loadingg';
// LOCAL IMPORT
import { socketService } from '../services/socketService'
import { userService } from '../services/userService'
import { changeSong, updateProgress, togglePlay, updateSongTime } from '../store/actions/playerActions';

class _Player extends Component {
    state = {
        isFirstJoin: true,
        isReady: false,
        muted: false,
        seeking: false,
        volume: 0.35,
        duration: undefined,
        secPlayed: 0,

    }

    componentDidMount() {
        socketService.setup();
        socketService.on('update song time', this.onSeek);
    }
    ref = player => {
        this.player = player
    }

    componentDidUpdate(prevProps) {
        const newBox = this.props.currBox;
        if (prevProps.currBox?._id !== newBox?._id) {
            this.setState({ isFirstJoin: true });
            this.socketSetup();
            return;
        }
    }

    socketSetup = () => {
        const minimalUser = userService.getMinimalUser();
        const boxInfo = {
            boxId: this.props.currBox._id,
            user: minimalUser
        }
        socketService.emit('join box', boxInfo);
    }

    togglePlay = () => {
        this.props.togglePlay(this.props.currSong);
    }
    skipToSong = (skip) => {
        const { currBox, currSong } = this.props;
        const currSongIdx = currBox.songs.findIndex(song => song.id === currSong.id);
        const lastSongIdx = currBox.songs.length - 1

        var nextSongIdx = currSongIdx + skip;
        if (nextSongIdx === -1) nextSongIdx = lastSongIdx;
        else if (nextSongIdx > lastSongIdx) nextSongIdx = 0;

        const nextSongId = currBox.songs[nextSongIdx].id
        this.props.changeSong(nextSongId);
    }

    handleSeekMouseDown = () => {
        this.setState({ seeking: true })
    }

    handleSeekChange = (ev, value) => {
        this.setState({ secPlayed: value });
    }

    handleSeekMouseUp = () => {
        this.setState({ seeking: false }, () => {
            this.props.updateSongTime(this.state.secPlayed)
            this.player.seekTo(this.state.secPlayed);
        });
    }

    onSeek = (secPlayed) => {
        this.player.seekTo(secPlayed);
    }

    handleProgress = state => {
        if (!this.state.seeking) {
            this.props.updateProgress(state.playedSeconds);
        }
    }

    handleEnded = () => {
        this.skipToSong(1);
    }

    handleDuration = (duration) => {
        this.setState({ duration })
    }

    play = () => {
        this.setState({ playing: true });
    }

    onReady = () => {
        this.setState({ isReady: true });
        if (this.state.isFirstJoin) {
            socketService.emit('get song time');
            this.setState({ isFirstJoin: false });
        }
    }

    handleVolumeChange = (ev, value) => {
        this.setState({ volume: value })
    }

    toggleMute = () => {
        this.setState({ muted: !this.state.muted })
    }

    ref = player => {
        this.player = player
    }

    render() {
        const { currBox, currSong } = this.props;
        if (!currBox || !currSong) return null;

        const { isReady, volume, muted, duration } = this.state;
        const { isPlaying } = currSong;

        const song = currBox.songs.find(song => song.id === currSong.id);
        if (!song) return null;

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
            <ReactPlayer
                ref={this.ref}
                className="player hidden"
                url={`https://www.youtube.com/watch?v=${song?.youtubeId}`}
                playing={currSong.isPlaying}
                controls={false}
                volume={volume}
                muted={muted}
                onPlay={this.handlePlay}
                onReady={this.onReady}
                onEnded={this.handleEnded}
                onProgress={this.handleProgress}
                onDuration={this.handleDuration}
            />
            <div className="player-container flex justify-center align-center">
                <div className={`player-capsule flex align-center space-between ${isPlaying ? 'is-playing' : 'paused'}`}>


                    <img className="player-thumbnail" src={song.imgUrl} title={song.title} alt="song thumbnail" />

                    {!isReady ? <CircleLoading color="#ac0aff" /> :
                        <React.Fragment>
                            <span className="player-title">{song.title}</span>

                            <div className="song-time flex align-center space-between">
                                <span className="player-time">{showTime(currSong.secPlayed)}</span>

                                <Slider
                                    style={{
                                        flexGrow: 1,
                                        width: '70px',
                                        color: 'white',
                                        margin: '0 15px'
                                    }}
                                    name="played"
                                    min={0}
                                    max={duration}
                                    onMouseDown={this.handleSeekMouseDown}
                                    onMouseUp={this.handleSeekMouseUp}
                                    onChange={this.handleSeekChange}
                                    value={currSong.secPlayed}
                                />

                                {duration && <span className="player-time">{showTime(duration + 1)}</span>}
                            </div>
                        </React.Fragment>
                    }

                    <div className="player-controls flex align-center">
                        <button className="player-ctrl-btn flex align-center" title="Previous" onClick={() => this.skipToSong(-1)}><SkipPreviousIcon /></button>
                        <button className="player-ctrl-btn flex align-center" title={isPlaying ? 'Pause' : 'Play'} onClick={this.togglePlay}>{isPlaying ? <PauseIcon /> : <PlayArrowIcon />}</button>
                        <button className="player-ctrl-btn flex align-center" title="Next" onClick={() => this.skipToSong(1)}><SkipNextIcon /></button>


                        <Slider
                            style={{
                                height: '50px',
                                color: muted ? '#292929' : 'white'
                            }}
                            value={volume}
                            min={0}
                            step={0.05}
                            max={1}
                            orientation="vertical"
                            onChange={this.handleVolumeChange}
                        />
                        <button className="player-ctrl-btn flex align-center" title={muted ? 'Unmute' : 'Mute'} onClick={this.toggleMute}>{muted ? <VolumeMuteIcon /> : <VolumeUpIcon />}</button>
                        <img
                            style={{ visibility: (this.props.location.pathname === `/box/details/${currBox._id}`) ? 'hidden' : 'visible' }}
                            className="back-to-box"
                            src={require('../assets/img/box.png')}
                            title="Back to box"
                            alt="Back to box"
                            onClick={() => this.props.history.push(`/box/details/${currBox._id}`)} />
                    </div>
                </div >
            </div >
        </React.Fragment >
    }
}



const mapStateToProps = state => {
    return {
        currBox: state.boxReducer.currBox,
        currSong: state.boxReducer.currSong,
    }
}

const mapDispatchToProps = {
    changeSong,
    togglePlay,
    updateSongTime,
    updateProgress
}

export const Player = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Player));