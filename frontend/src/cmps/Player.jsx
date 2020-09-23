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
import { updateBox } from '../store/actions/boxAction';
import { socketService } from '../services/socketService'
import { loadSong, updateSongPlay, updateSongTime } from '../store/actions/playerActions';

class _Player extends Component {
    state = {
        isReady: false,
        isShrunk: false,
        secPlayed: 0,
        muted: false,
        volume: 0.35,
        duration: undefined
    }

    componentDidMount() {
        socketService.setup();
<<<<<<< HEAD
        socketService.on('update song time',  this.onSeek);
=======
        socketService.on('update song time', (secPlayed) => {
            // REMEMBER! UPDATED ONLY AT CLIENT PLAYER -  WITHOUT STORE
            this.onSeek(secPlayed)
        });
>>>>>>> 838d244b5d1441d0a6af5d213c6f170827293adb
    }

    componentDidUpdate(prevProps) {
        const newBox = this.props.currBox;
        if (prevProps.currBox?._id !== newBox?._id) {
            this.socketSetup();
            if (newBox.songs.length) this.props.loadSong(newBox.songs[0].id);
        }
    }

    socketSetup = () => {
        socketService.emit('join box', this.props.currBox._id);
    }

    loadSongToPlayer = (currSongIdx = 0) => {
        this.setState({ isReady: false });
        const { currBox } = this.props;
        // If no songs in box, do nothing.
        if (!currBox.songs.length) return;

        const song = currBox.songs[currSongIdx];

        const currSong = {
            id: song.id,
            isPlaying: true,
            secPlayed: 0
        }

        const newBox = { ...currBox, currSong };
        this.props.updateBox(newBox);
        // if (this.state.isReady) this.play();
    }

    togglePlay = () => {
        this.setState({ isPlaying: !this.state.isPlaying }, () => this.onUpdateBox());
    }

    onUpdateBox = () => {
        const { currBox } = this.props;
        const currSong = { ...currBox.currSong, isPlaying: this.state.isPlaying, secPlayed: this.state.secPlayed };
        const newBox = { ...currBox, currSong };
        this.props.updateBox(newBox);
        console.log("onUpdateBox -> currSong", currSong)
        socketService.emit('set currSong', currSong);
    }

    skipToSong = (skip) => {
        const { currBox } = this.props;
        const currSongIdx = currBox.songs.findIndex(song => song.id === currBox.currSong.id);
        const lastSongIdx = currBox.songs.length - 1

        var nextSongIdx = currSongIdx + skip;
        if (nextSongIdx === -1) nextSongIdx = lastSongIdx;
        else if (nextSongIdx > lastSongIdx) nextSongIdx = 0;

        const nextSongId = currBox.songs[nextSongIdx].id
        this.props.loadSong(nextSongId);
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
            this.setState({ secPlayed: parseInt(state.playedSeconds) });
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

    onToggleShrink = () => {
        this.setState({ isShrunk: !this.state.isShrunk });
    }

    render() {
        const { currBox } = this.props;
        if (!currBox || !currBox.currSong) return null;

        const { isReady, volume, muted, duration, isShrunk } = this.state;
        const { isPlaying } = currBox.currSong;

        const song = currBox.songs.find(song => song.id === currBox.currSong.id);
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
                className="player"
                url={`https://www.youtube.com/watch?v=${song.youtubeId}`}
                playing={isPlaying}
                controls={false}
                volume={volume}
                muted={muted}
                onPlay={this.handlePlay}
                onReady={this.onReady}
                onPause={this.handlePause}
                onEnded={this.handleEnded}
                onProgress={this.handleProgress}
                onDuration={this.handleDuration}
            />
            <div
                className={`player-container flex align-center space-between ${isPlaying ? 'is-playing' : 'paused'} ${isShrunk ? 'shrunk' : ''}`}
                onMouseDown={this.onPlayerMouseDown}
                onMouseUp={this.onPlayerMouseUp}
                onDrag={this.onPlayerDrag}
            >


                <img className="player-thumbnail" onClick={this.onToggleShrink} src={song.imgUrl} title={song.title} alt="song thumbnail" />

                {isReady && <span className="player-title">{song.title}</span>}

                {!isReady ?
                    <CircleLoading color="#ac0aff" /> :
                    < div className="song-time flex align-center space-between">
                        <span>{showTime(this.state.secPlayed)}</span>

                        <Slider
                            style={{
                                width: '70px',
                                color: 'white',
                            }}
                            name="played"
                            min={0}
                            max={duration}
                            onMouseDown={this.handleSeekMouseDown}
                            onMouseUp={this.handleSeekMouseUp}
                            onChange={this.handleSeekChange}
                            value={this.state.secPlayed}
                        />

                        {duration && <span>{showTime(duration)}</span>}
                    </div>}

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
                        style={{ visibility: (this.props.location.pathname === `/box/${currBox._id}`) ? 'hidden' : 'visible' }}
                        className="back-to-box"
                        src={require('../assets/img/box.png')}
                        title="Back to box"
                        alt="Back to box"
                        onClick={() => this.props.history.push(`/box/${currBox._id}`)} />
                </div>
            </div >
        </React.Fragment >
    }
}

const mapStateToProps = state => {
    return {
        currBox: state.boxReducer.currBox
    }
}

const mapDispatchToProps = {
    updateBox,
    loadSong,
    updateSongPlay,
    updateSongTime
}

export const Player = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Player));