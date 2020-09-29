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
import { CircleLoading } from 'react-loadingg';
// LOCAL IMPORT
import { changeSong, updateProgress, togglePlay } from '../store/actions/playerActions';
import { socketService } from '../services/socketService';

class _Player extends Component {
    state = {
        isSyncing: false,
        isReady: false,
        muted: false,
        seeking: false,
        volume: 0.75,
        duration: undefined,
        secPlayed: 0
    }
    ref = player => {
        this.player = player;
    }
    componentDidMount() {
        setTimeout(() => {
            socketService.on('got seek update', this.seekTo);
        }, 1)
    }

    componentDidUpdate(prevProps) {
        if (this.props.currBox?._id !== prevProps.currBox?._id)
            this.waitForSync(this.props.currSong)
    }

    waitForSync = (currSong) => {
        if (this.props.currSong === currSong) setTimeout(this.waitForSync, 500);
        else if (this.props.currSong?.secPlayed) {
            this.setState({ isSyncing: true });
            console.log('waiting for ready, status:', this.state.isReady)
            if (this.state.isReady) {
                socketService.emit('sync song time');
                this.setState({ isSyncing: false });
            }
            else setTimeout(this.waitForSync, 1000)
        }
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

    seekTo = (secPlayed) => {
        this.player.seekTo(secPlayed);
    }

    handleSeekMouseDown = () => {
        this.setState({ seeking: true });
    }

    handleSeekChange = ({ target }) => {
        this.setState({ secPlayed: (parseInt(target.value)) });
    }

    handleSeekMouseUp = () => {
        this.setState({ seeking: false });
        socketService.emit('update player seek', this.state.secPlayed);
    }

    handleProgress = state => {
        if (!this.state.seeking && !this.state.isSyncing) {
            this.setState({ secPlayed: state.playedSeconds })
            this.props.updateProgress(state.playedSeconds);
        }
    }

    handleEnded = () => {
        this.skipToSong(1);
    }

    handleDuration = (duration) => {
        this.setState({ duration })
    }

    onReady = () => {
        this.setState({ isReady: true });
    }

    handleVolumeChange = ({ target }) => {
        this.setState({ volume: target.value })
    }

    toggleMute = () => {
        this.setState({ muted: !this.state.muted })
    }

    render() {
        const { secPlayed, isSyncing } = this.state;
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
                onReady={this.onReady}
                onEnded={this.handleEnded}
                onProgress={this.handleProgress}
                onDuration={this.handleDuration}
            />
            <div className="player-container flex justify-center align-center">
                <div className={`player-capsule flex align-center justify-center ${isPlaying ? 'is-playing' : 'paused'}`}>


                    <img className="player-thumbnail" src={song.imgUrl} title={song.title} alt="song thumbnail" />

                    {!isReady ? <CircleLoading color="#ac0aff" /> :
                        <React.Fragment>
                            <span className="player-title">{song.title}</span>

                            <div className="song-time flex align-center space-between">
                                <span className="player-time">{isSyncing ? 'Syncing play...' : showTime(secPlayed)}</span>

                                <input
                                    className="duration-slider"
                                    style={{

                                    }}
                                    type="range"
                                    name="played"
                                    min={0}
                                    max={duration}
                                    onMouseDown={this.handleSeekMouseDown}
                                    onMouseUp={this.handleSeekMouseUp}
                                    onChange={this.handleSeekChange}
                                    onTouchEnd={this.handleSeekMouseUp}
                                    value={secPlayed}
                                />

                                {duration && <span className="player-time">{showTime(duration + 1)}</span>}
                            </div>
                        </React.Fragment>
                    }

                    <div className="player-controls flex align-center">
                        <button className="player-ctrl-btn flex align-center" title="Previous" onClick={() => this.skipToSong(-1)}><SkipPreviousIcon /></button>
                        <button className="player-ctrl-btn flex align-center" title={isPlaying ? 'Pause' : 'Play'} onClick={this.togglePlay}>{isPlaying ? <PauseIcon /> : <PlayArrowIcon />}</button>
                        <button className="player-ctrl-btn flex align-center" title="Next" onClick={() => this.skipToSong(1)}><SkipNextIcon /></button>

                        <input
                            className={`volume-slider ${muted ? 'muted' : ''}`}
                            type="range"
                            value={volume}
                            min={0}
                            step={0.05}
                            max={1}
                            onChange={this.handleVolumeChange}
                        />
                        <button className="player-ctrl-btn flex justify-center align-center" title={muted ? 'Unmute' : 'Mute'} onClick={this.toggleMute}>{muted ? <VolumeMuteIcon /> : <VolumeUpIcon />}</button>
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
    updateProgress,
}

export const Player = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Player));