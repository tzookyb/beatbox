import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-beautiful-dnd'
// import Picker from 'emoji-picker-react';

// import { ChatBox } from '../cmps/box-details/ChatBox'
import { SongList } from '../cmps/box-details/SongList'
import { BoxInfo } from '../cmps/box-details/BoxInfo'
import { loadBox, notify, saveBox } from '../store/actions/boxAction'
import { boxService } from '../services/boxService'
import { userService } from '../services/userService';
import { BoxFilter } from "../cmps/boxes/BoxFilter";
import CircleLoading from 'react-loadingg/lib/CircleLoading'

class _BoxDetails extends Component {
    state = {
        box: null,
        filterBy: '',
        isSongPickOpen: false,
        isDragging: false
    }

    async componentDidMount() {
        const boxId = this.props.match.params.boxId;
        const minimalUser = userService.getMinimalUser();
        await boxService.addConnectedUser(boxId, minimalUser);
        await this.props.loadBox(boxId);
        const { box } = this.props;
        this.setState({ box })
    }

    componentDidUpdate(prevProps) {
        const newBox = this.props.box;
        if (prevProps.box !== newBox) this.setState({ box: newBox });
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
        box.songs.splice(songIdx, 1);
        this.props.notify('Song removed')
        await this.props.saveBox(box)
    }

    onAddSong = (song) => {
        const newSong = boxService.addSong(song, this.state.box.songs)
        const box = { ...this.state.box }
        box.songs.push(newSong)
        this.props.notify('Song added')
        this.props.saveBox(box)
    }

    onPlaySong = (songId) => {
        const currSong = { id: songId, isPlaying: true, secPlayed: 0 };
        const box = { ...this.state.box, currSong };
        this.props.saveBox(box);
    }

    onSaveInfo = (box) => {
        this.props.saveBox(box);
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

    onSwapSongs = async (srcIdx, destIdx) => {
        const songs = [...this.props.box.songs];
        const [songToMove] = songs.splice(srcIdx, 1);
        songs.splice(destIdx, 0, songToMove)
        const newBox = { ...this.props.box, songs }
        await this.props.saveBox(newBox);
    }

    onMouseMove = (ev) => {
        console.log(ev);

    }

    render() {
        const { isSongPickOpen, isDragging, filterBy } = this.state;
        const isFilter = filterBy ? true : false;
        const { box } = this.props;
        if (!box) return <CircleLoading size="large" color="#ac0aff" />
        const currSongId = (box.currSong) ? box.currSong.id : null;
        const songsToShow = this.getSongsForDisplay();
        return (
            <section className="box-details">
                onMouseMove={this.onMouseMove}

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
    saveBox,
    notify
}

export const BoxDetails = connect(mapStateToProps, mapDispatchToProps)(_BoxDetails)