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

import { updateBox } from '../store/actions/boxAction';
import { socketService } from '../services/socketService'

class _Player extends Component {
    state = {
        isFirstRun: true,
        isReady: false,
        isShrunk: false,
        currBox: null,
        song: '',
        playerLocation: null,
        isPlaying: true,
        secPlayed: 0,
        muted: false,
        volume: 0.35,
        duration: undefined
    }

    componentDidMount() {
        socketService.setup();
        socketService.on('update song time', (secPlayed) => this.onSeek(secPlayed));
    }


    componentDidUpdate(prevProps) {
        const newBox = this.props.currBox;
        // Prevent loop:
        if (prevProps.currBox === newBox) return;
        // if first box - set and start playing
        if (newBox && this.state.isFirstRun) {
            this.socketSetup(false);
            this.setState({ isFirstRun: false }, this.loadSongToPlayer);
            return;
        }

        // if same box id, just update playerbox in state
        if (prevProps.currBox._id === newBox._id) {
            this.setState({
                isPlaying: newBox.currSong?.isPlaying,
                secPlayed: newBox.currSong?.secPlayed,
                currBox: newBox
            });
            return;
        }
        // if different box -> setstate and load song idx 0 to player.
        if (prevProps.currBox && prevProps.currBox._id !== newBox._id) {
            this.socketSetup(true, prevProps.currBox._id);
            this.setState({ currBox: newBox }, () => this.loadSongToPlayer(0));
        }
    }

    socketSetup = (isJoined, prevBoxId) => {
        if (isJoined) {
            socketService.off(prevBoxId, (secPlayed) => this.onSeek(secPlayed))
        }
        socketService.emit('join box', this.props.currBox._id);
    }

    loadSongToPlayer = (currSongIdx = 0) => {
        this.setState({ isReady: false });
        const { currBox } = this.props;
        console.log("loadSongToPlayer -> currBox", currBox)
        // If no songs in box, do nothing.
        if (!currBox.songs.length) return;

        const song = currBox.songs[currSongIdx];
        this.setState({ song });

        const currSong = {
            id: song.id,
            isPlaying: this.state.isPlaying,
            secPlayed: this.state.secPlayed
        }

        const newBox = { ...this.props.currBox, currSong };
        this.props.updateBox(newBox);
        if (this.state.isReady) this.play();
    }

    togglePlay = () => {
        this.setState({ isPlaying: !this.state.isPlaying }, async () => {
            this.onUpdateBox();

        })

    }

    onUpdateBox = () => {
        // HAVE BEEN CHANGED - SOCKETS
        const { currBox } = this.props;
        const currSong = { ...currBox.currSong, isPlaying: this.state.isPlaying, secPlayed: this.state.secPlayed };
        const newBox = { ...currBox, currSong }
        this.props.updateBox(newBox);
        socketService.emit('set currSong', currSong);
    }

    skipToSong = (skip) => {
        const { currBox } = this.state;
        const currSongIdx = currBox.songs.findIndex(song => song.id === currBox.currSong.id);
        const lastSongIdx = currBox.songs.length - 1

        var nextSongIdx = currSongIdx + skip;
        if (nextSongIdx === -1) nextSongIdx = lastSongIdx;
        else if (nextSongIdx > lastSongIdx) nextSongIdx = 0;

        this.loadSongToPlayer(nextSongIdx);
    }

    handleSeekMouseDown = () => {
        this.setState({ seeking: true })
    }

    handleSeekChange = (ev, value) => {
        this.setState({ secPlayed: value });
    }

    handleSeekMouseUp = () => {
        socketService.emit('song time changed', this.state.secPlayed);

        this.setState({ seeking: false }, () => {
            this.onUpdateBox();
            this.player.seekTo(this.state.secPlayed);
        });
    }

    onSeek = (secPlayed) => {
        console.log(secPlayed)
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
        console.log('player ready')
        this.setState({ isReady: true }, this.play)
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
        this.setState({ isShrunk: !this.state.isShrunk })
    }

    onPlayerMouseDown = (ev) => {
        this.setState({ isDragging: true })
    }
    onPlayerMouseUp = () => {
        this.setState({ isDragging: false })
    }
    onPlayerDrag = (ev) => {
        if (this.state.isDragging) {
            ev.preventDefault()
            ev.stopPropagation()
            this.setState({ playerLocation: { x: ev.clientX, y: ev.clientY } })
        }
    }

    render() {
        const { isReady, isPlaying, volume, muted, duration, isShrunk, playerLocation } = this.state;
        const { currBox } = this.props

        if (!currBox || !currBox.currSong) return null;

        const song = currBox.songs.find(song => song.id === currBox.currSong.id)
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

        const pL = playerLocation ? { left: `${playerLocation.x}`, top: `${playerLocation.y}` } : {};

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
                style={pL}
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
    updateBox
}

export const Player = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Player));