// OUTSOURCE IMPORT
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-beautiful-dnd'
import CircleLoading from 'react-loadingg/lib/CircleLoading'
// LOCAL IMPORT
import { SongList } from '../cmps/box-details/SongList'
import { BoxInfo } from '../cmps/box-details/BoxInfo'
import { BoxFilter } from '../cmps/boxes/BoxFilter';
import { BoxWall } from '../cmps/box-details/BoxWall';
import { boxService } from '../services/boxService'
import { userService } from '../services/userService';
import { socketService } from '../services/socketService';
import { loadBox, updateBox, gotBoxUpdate } from '../store/actions/boxAction'
import { addMessage, loadMessages } from '../store/actions/messageAction'
import { setCurrSong } from '../store/actions/playerActions'

class _BoxDetails extends Component {
    state = {
        filterBy: '',
        isSongPickOpen: false,
        isDragging: false,
        messages: []
    }

    async componentDidMount() {
        const boxId = this.props.match.params.boxId;
        const minimalUser = this.getMinimalUser();
        // const messages = socketService.getMessagesByBoxId(boxId)
        await this.props.loadBox(boxId);
        await boxService.addConnectedUser(boxId, minimalUser);

        // SOCKET SETUP
        socketService.setup();
        socketService.emit('join box', this.props.box._id);
        socketService.on('get box status', this.props.setCurrSong)
        socketService.on('song changed', this.props.setCurrSong);
        socketService.on('box changed', this.props.gotBoxUpdate);
        // socketService.on('chat addMsg', this.addMsg);
        // socketService.on('chat typing', this.onTyping);
        // socketService.on('set currSong', this.state.box.currSong)
    }

    onRemoveSong = (ev, songId) => {
        if (ev) {
            ev.stopPropagation();
            ev.preventDefault();
        }

        const box = { ...this.props.box }
        const songIdx = box.songs.findIndex(song => song.id === songId)
        if (box.currSong.id === songId) {
            if (box.songs.length === 1) {
                box.currSong = null;
            } else {
                let nextSongIdx = songIdx + 1;
                if (nextSongIdx === box.songs.length) nextSongIdx = 0;
                box.currSong = { id: box.songs[nextSongIdx].id, isPlaying: true, played: 0 }
            }
        }
        const song = box.songs.splice(songIdx, 1);
        this.addMessageChat(`Song ${song[0].title} removed by ${this.props.user.username}`);
        this.props.updateBox(box)
    }

    onAddSong = (song) => {
        const newSong = boxService.addSong(song);
        const box = { ...this.props.box };
        box.songs.push(newSong);
        this.addMessageChat(`Song ${newSong.title} added by ${this.props.user.username}`);
        this.props.updateBox(box);
    }

    onPlaySong = (songId) => {
        const currSong = { id: songId, isPlaying: true, secPlayed: 0 };
        socketService.emit('set currSong', currSong);
        this.props.setCurrSong(currSong);
    }

    onSaveInfo = (box) => {
        this.props.updateBox(box);
    }

    onSetFilter = (filterBy) => {
        this.setState({ filterBy: filterBy.name })
    }

    getSongsForDisplay = () => {
        const songs = this.props.box.songs.filter(song => song.title.toLowerCase().includes(this.state.filterBy.toLowerCase()));
        return songs;
    }

    toggleSongPick = () => {
        this.setState({ isSongPickOpen: !this.state.isSongPickOpen })
    }

    onDragStart = () => {
        this.setState({ isDragging: true })
    }

    onDragEnd = (result) => {
        this.setState({ isDragging: false })
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === 'trash') {
            this.onRemoveSong(null, draggableId)
        }
        else if (destination.index === source.index) return;
        else this.onSwapSongs(source.index, destination.index);
    }

    addMessageChat = async (msg) => {
        const messageObj = {
            text: msg,
            submitAt: new Date(),
            id: this.props.user._id,
            submitBy: this.props.user.username,
            avatar: this.props.user.imgUrl,
            type: 'system'
        }
        const { box } = this.props;
        await this.props.addMessage(box._id, messageObj)
        await this.props.loadMessages(box._id);
    }
    getMinimalUser() {
        return userService.getMinimalUser();
    }

    onToggleLikeBox = async (boxId, minimalUser) => {
        await boxService.addLike(boxId, minimalUser)
        await this.props.loadBox(boxId);
    }

    onSwapSongs = (srcIdx, destIdx) => {
        const newSongs = Array.from(this.props.box.songs);
        const [songToMove] = newSongs.splice(srcIdx, 1);
        newSongs.splice(destIdx, 0, songToMove)
        const newBox = { ...this.props.box, songs: newSongs }
        this.props.updateBox(newBox);
    }

    render() {
        const { isSongPickOpen, isDragging, filterBy } = this.state;
        const isFilter = filterBy ? true : false;
        const { box } = this.props;
        if (!box) return <CircleLoading size="large" color="#ac0aff" />

        const currSongId = box.currSong?.id || null;
        const songsToShow = this.getSongsForDisplay();
        const minimalUser = this.getMinimalUser();

        return (
            <section className="box-details">
                <BoxWall box={box} />
                <BoxInfo box={box} onSaveInfo={this.onSaveInfo} minimalUser={minimalUser} onToggleLikeBox={this.onToggleLikeBox} />

                <BoxFilter onSetFilter={this.onSetFilter} />

                <DragDropContext
                    onDragStart={this.onDragStart}
                    onDragEnd={this.onDragEnd}
                >
                    <SongList
                        songs={songsToShow}
                        onPlaySong={this.onPlaySong}
                        onRemoveSong={this.onRemoveSong}
                        onAddSong={this.onAddSong}
                        isSongPickOpen={isSongPickOpen}
                        toggleSongPick={this.toggleSongPick}
                        nowPlayingId={currSongId}
                        onDragStart={this.onDragStart}
                        onDragEnd={this.onDragEnd}
                        isFilter={isFilter}
                        isDragging={isDragging}
                    />
                </DragDropContext>
            </section>
        )
    }
}
const mapStateToProps = state => {
    return {
        box: state.boxReducer.currBox,
        user: state.userReducer.loggedinUser
    }
}
const mapDispatchToProps = {
    loadBox,
    updateBox,
    addMessage,
    loadMessages,
    setCurrSong,
    gotBoxUpdate
}
export const BoxDetails = connect(mapStateToProps, mapDispatchToProps)(_BoxDetails)

// onSetCurrSong = (currSong) => {
    //     console.log('socket')
    //     const newBox = { ...this.props.box, currSong };
    //     this.props.updateBox(newBox);
    // }