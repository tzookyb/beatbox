import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player/youtube'

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import Slider from '@material-ui/core/Slider';

import { saveBox } from '../store/actions/boxAction';
import { withRouter } from 'react-router-dom';

class _Player extends Component {
    state = {
        currBox: null,
        song: '',

        isPlaying: true,
        secPlayed: 0,
        muted: false,
        volume: 0.35,
        duration: undefined
    }

    componentDidUpdate(prevProps, prevState) {
        const newBox = this.props.currBox;
        // Prevent loop:
        if (prevProps.currBox === newBox) return;

        // if first box - set and start playing
        if (!this.state.currBox) {
            this.setState({ currBox: newBox }, this.load);
            return;
        }

        // if same box id, just update playerbox in state
        if (prevProps.currBox._id === newBox._id) {
            this.setState({ currBox: newBox });
            return;
        }
        // if different box -> setstate and load song idx 0 to player.
        if (prevProps.currBox && prevProps.currBox._id !== newBox._id) {
            this.setState({ currBox: newBox }, () => this.load(0));
        }
    }

    load = (currSongIdx = 0) => {
        const { currBox } = this.state;
        // If no songs in box, do nothing.
        if (!currBox.songs.length) return;

        const song = currBox.songs[currSongIdx];
        this.setState({ song });

        const currSong = {
            id: song.id,
            isPlaying: this.state.isPlaying,
            secPlayed: this.state.secPlayed
        }

        const newBox = { ...this.state.currBox, currSong };
        this.props.saveBox(newBox);
        this.play();
    }

    togglePlay = () => {
        this.setState({ isPlaying: !this.state.isPlaying }, this.updateBox);
    }

    updateBox = async () => {
        const { currBox } = this.state;
        const currSong = { ...currBox.currSong, isPlaying: this.state.isPlaying, secPlayed: this.state.secPlayed };
        const newBox = { ...this.state.currBox, currSong }
        await this.props.saveBox(newBox);
    }

    skipToSong = (skip) => {
        const { currBox } = this.state;
        const currSongIdx = currBox.songs.findIndex(song => song.id === currBox.currSong.id);
        const lastSongIdx = currBox.songs.length - 1

        var nextSongIdx = currSongIdx + skip;
        if (nextSongIdx === -1) nextSongIdx = lastSongIdx;
        else if (nextSongIdx > lastSongIdx) nextSongIdx = 0;

        this.load(nextSongIdx);
    }

    handleSeekMouseDown = () => {
        this.setState({ seeking: true })
    }

    handleSeekChange = (ev, value) => {
        // if (value > this.state.duration) {
        //     value = this.state.duration - 5
        // }
        this.setState({ secPlayed: value });
    }

    handleSeekMouseUp = () => {
        this.setState({ seeking: false }, () => {
            this.updateBox();
            this.player.seekTo(this.state.secPlayed);
        });
    }

    handleProgress = state => {
        if (!this.state.seeking) {
            this.setState({ secPlayed: state.playedSeconds });
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
        const { currBox, isPlaying, volume, muted, duration } = this.state
        if (!currBox || !currBox.currSong) return null;
        const song = currBox.songs.find(song => song.id === currBox.currSong.id)

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

        return <div className={`player-container flex align-center space-between ${isPlaying ? 'is-playing' : 'paused'}`}>
            <ReactPlayer
                ref={this.ref}
                className="player"
                url={`https://www.youtube.com/watch?v=${song.id}`}
                playing={isPlaying}
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

                <span className="player-title">{song.title}</span>

            </div>

            <span>{showTime(this.state.secPlayed)}</span>

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
                value={this.state.secPlayed}
            />
            {duration && <span>{showTime(duration)}</span>}

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
                <button className="player-ctrl-btn flex align-center" title={muted ? 'Unmute' : 'Mute' } onClick={this.toggleMute}>{muted ? <VolumeMuteIcon /> : <VolumeUpIcon />}</button>

                <img
                    className="back-to-box"
                    src={require('../assets/img/box.png')}
                    title="Back to box"
                    alt="Back to box"
                    onClick={() => this.props.history.push(`/box/${currBox._id}`)} />
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
    saveBox
}

export const Player = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Player));