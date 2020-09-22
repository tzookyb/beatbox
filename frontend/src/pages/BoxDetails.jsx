// OUTSOURCE IMPORT 
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-beautiful-dnd'
import CircleLoading from 'react-loadingg/lib/CircleLoading'


// LOCAL IMPORT
import { SongList } from '../cmps/box-details/SongList'
import { BoxInfo } from '../cmps/box-details/BoxInfo'
import { loadBox, updateBox } from '../store/actions/boxAction'
import { boxService } from '../services/boxService'
import { userService } from '../services/userService';
import { BoxFilter } from "../cmps/boxes/BoxFilter";
import { BoxWall, Demo } from '../cmps/box-details/BoxWall'
import { socketService } from '../services/socketService'

class _BoxDetails extends Component {
    state = {
        filterBy: '',
        isSongPickOpen: false,
        isDragging: false
    }

    async componentDidMount() {
        const boxId = this.props.match.params.boxId;
        const minimalUser = userService.getMinimalUser();
        // await boxService.addConnectedUser(boxId, minimalUser);
        await this.props.loadBox(boxId);

        // SOCKET SETUP
        socketService.setup();
        socketService.emit('join box', this.props.box._id);
        // socketService.on('chat addMsg', this.addMsg);
        // socketService.on('chat typing', this.onTyping);
        // socketService.on('set currSong', this.state.box.currSong)
        socketService.on('song changed', (currSong) => this.onSetCurrSong(currSong));
    }

    // componentDidUpdate(prevProps) {\

    componentWillUnmount() {
        console.log('unmount');

    }

    onSetCurrSong = (currSong) => {
        const newBox = { ...this.props.box, currSong };
        this.props.updateBox(newBox);
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
        box.songs.splice(songIdx, 1);
        this.props.updateBox(box)
    }

    onAddSong = (song) => {
        const newSong = boxService.addSong(song);
        const box = { ...this.props.box }
        box.songs.push(newSong)
        this.props.updateBox(box)
    }

    onPlaySong = (songId) => {
        const currSong = { id: songId, isPlaying: true, secPlayed: 0 };
        socketService.emit('set currSong', currSong);
        const box = { ...this.props.box, currSong };
        this.props.updateBox(box);
    }

    onSaveInfo = (box) => {
        this.props.updateBox(box);
    }

    onEmojiClick = (event, emojiObject) => {
        console.log("onEmojiClick -> emojiObject", emojiObject)
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
        console.log("render -> box", box)

        if (!box) return <CircleLoading size="large" color="#ac0aff" />

        console.log("render -> box", box)
        const currSongId = box.currSong?.id || null;
        const songsToShow = this.getSongsForDisplay();

        return (
            <section className="box-details">

                {/* <BoxWall/> */}
                <BoxInfo box={box} onSaveInfo={this.onSaveInfo} />
                <BoxFilter onSetFilter={this.onSetFilter} />
                {/* <Picker onEmojiClick={this.onEmojiClick} /> */}
                {/* <Fab className="add-song-btn" onClick={this.openAddSearch} color="primary" aria-label="add">
                    <AddCircleOutline />
                </Fab> */}

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

                {/* <ChatBox /> */}
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
    updateBox
}

export const BoxDetails = connect(mapStateToProps, mapDispatchToProps)(_BoxDetails)