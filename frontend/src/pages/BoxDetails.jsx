// OUTSOURCE IMPORT 
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-beautiful-dnd'
import CircleLoading from 'react-loadingg/lib/CircleLoading'


// LOCAL IMPORT
import { SongList } from '../cmps/box-details/SongList'
import { BoxInfo } from '../cmps/box-details/BoxInfo'
import { loadBox, notify, saveBox, updateBox } from '../store/actions/boxAction'
import { addMessage, loadMessages } from '../store/actions/messageAction'
import { boxService } from '../services/boxService'
import { userService } from '../services/userService';
import { socketService } from '../services/socketService';
import { BoxFilter } from '../cmps/boxes/BoxFilter';
import { BoxWall } from '../cmps/box-details/BoxWall';

class _BoxDetails extends Component {
    state = {
        box: null,
        filterBy: '',
        isSongPickOpen: false,
        isDragging: false,
        messages: []
    }

    async componentDidMount() {
        const boxId = this.props.match.params.boxId;
        const minimalUser = userService.getMinimalUser();
        // const messages = socketService.getMessagesByBoxId(boxId)
        await boxService.addConnectedUser(boxId, minimalUser);
        await this.props.loadBox(boxId);
        const { box } = this.props;
        this.setState({ box })

        // SOCKET SETUP
        socketService.setup();
        socketService.emit('join box', this.state.box._id);
        // socketService.on('chat addMsg', this.addMsg);
        // socketService.on('chat typing', this.onTyping);
        // socketService.on('set currSong', this.state.box.currSong)
        socketService.on('song changed', (currSong) => this.onSetCurrSong(currSong));
    }

    componentDidUpdate(prevProps) {
        const newBox = this.props.box;
        if (prevProps.box !== newBox) this.setState({ box: newBox });
    }

    componentWillUnmount() {
        console.log('unmount');

    }

    onSetCurrSong = (currSong) => {
        const newBox = { ...this.props.box, currSong };
        this.props.updateBox(newBox);
    }

    onRemoveSong = async (ev, songId) => {
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
            await this.props.saveBox(box)
        }
        const song = box.songs.splice(songIdx, 1);
        this.addMessageChat(`Song ${song[0].title} removed by ${this.props.user.username}`);
        await this.props.updateBox(box)
    }

    onAddSong = (song) => {
        const newSong = boxService.addSong(song, this.state.box.songs)
        const box = { ...this.state.box }
        box.songs.push(newSong)
        // this.props.notify('Song added');
        this.addMessageChat(`Song ${newSong.title} added by ${this.props.user.username}`);
        this.props.saveBox(box)
    }

    onPlaySong = (songId) => {
        const currSong = { id: songId, isPlaying: true, secPlayed: 0 };
        socketService.emit('set currSong', currSong);
        const box = { ...this.state.box, currSong };
        this.props.saveBox(box);
    }

    onSaveInfo = (box) => {
        this.props.saveBox(box);
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
        console.log("onToggleLikeBox -> minimalUser", minimalUser)
        console.log("onToggleLikeBox -> boxId", boxId)
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
        const currSongId = (box.currSong) ? box.currSong.id : null;
        const songsToShow = this.getSongsForDisplay();
        const minimalUser = this.getMinimalUser();
        return (
            <section className="box-details">
                <BoxWall box={box} />
                <BoxInfo box={box} onSaveInfo={this.onSaveInfo} minimalUser={minimalUser} onToggleLikeBox={this.onToggleLikeBox}/>

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
        box: state.boxReducer.currBox
    }
}
const mapDispatchToProps = {
    loadBox,
    saveBox,
    notify,
    updateBox,
    addMessage,
    loadMessages 
}
export const BoxDetails = connect(mapStateToProps, mapDispatchToProps)(_BoxDetails)