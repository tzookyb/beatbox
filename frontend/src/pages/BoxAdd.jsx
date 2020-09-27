// OUTSOURCE IMPORTS
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-beautiful-dnd'
import CircleLoading from 'react-loadingg/lib/CircleLoading'
// LOCAL IMPORTS
import { boxService } from '../services/boxService'
import { userService } from '../services/userService'
import { youtubeService } from '../services/youtubeService'
import { saveBox, loadBoxes } from '../store/actions/boxAction'
import { BoxInfoEdit } from '../cmps/box-details/BoxInfoEdit'
import { SongList } from '../cmps/box-details/SongList'

export class _BoxAdd extends Component {
    state = {
        editBox: null,
        msgWarning: '',
        isSongPickOpen: true,
        isDragging: false,
        isLoading: false
    }

    componentDidMount() {
        const minimalUser = userService.getMinimalUser();
        const emptyBox = boxService.getEmptyBox(minimalUser);
        this.setState({ editBox: emptyBox });
    }

    printMsg(msg) {
        this.setState({ msgWarning: msg });
        setTimeout(() => {
            this.setState({ msgWarning: '' });
        }, 2000)
    }

    onAddBox = async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (!this.state.editBox.name) {
            this.printMsg('Name of box is required');
            return;
        }
        if (!this.state.editBox.genre) {
            this.printMsg('Genre of box is required');
            return;
        }

        const addedBox = await this.props.saveBox(this.state.editBox);
        this.props.loadBoxes();
        this.props.history.push(`/box/${addedBox._id}`);
    }

    updateBox = (box) => {
        this.setState(prevState => ({
            editBox:
            {
                ...prevState.editBox,
                name: box.name,
                genre: box.genre,
                description: box.description,
                imgUrl: box.imgUrl
            }
        }));
    }

    onRemoveSong = (songId) => {
        const newBox = { ...this.state.editBox };
        const songIdx = newBox.songs.findIndex(song => song.id === songId);
        newBox.songs.splice(songIdx, 1);
        this.setState({ editBox: newBox });
    }

    onAddSong = async (song, idx = undefined, isFromDrag = false) => {
        const newSong = await boxService.addSong(song, isFromDrag);
        const songs = [...this.state.editBox.songs];
        if (!idx) songs.unshift(newSong);
        else songs.splice(idx, 0, newSong);
        this.setState(prevState => ({ editBox: { ...prevState.editBox, songs } }));
    }

    toggleSongPick = () => {
        this.setState(prevState => ({ isSongPickOpen: !prevState.isSongPickOpen }));
    }

    onDragStart = () => {
        this.setState({ isDragging: true });
    }

    onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        this.setState({ isDragging: false });

        if (!destination) return;
        if (destination.droppableId === 'songPick') return;

        if (source.droppableId === 'songList' && destination.droppableId === 'trash') {
            this.onRemoveSong(draggableId);
            return;
        }

        if (source.droppableId === 'songPick' && destination.droppableId === 'songList') {
            let song = await youtubeService.getSongById(draggableId);
            [song] = song.items;
            this.onAddSong(song, destination.index, true);
            return;
        }

        if (destination.index === source.index) return;

        if (destination.droppableId === 'songList') {
            this.swapSongs(source.index, destination.index);
        }
    }

    swapSongs = (srcIdx, destIdx) => {
        const songs = [...this.state.editBox.songs];
        const [songToMove] = songs.splice(srcIdx, 1);
        songs.splice(destIdx, 0, songToMove);
        const newBox = { ...this.state.editBox, songs };
        this.setState({ editBox: newBox });
    }

    setIsLoading = (isLoading) => {
        this.setState({ isLoading });
    }

    render() {
        const { editBox, isSongPickOpen, isDragging } = this.state;
        if (!editBox) return <CircleLoading size="large" color="#ac0aff" />
        return (
            <section className="box-add main-container">
                <h2>Create Your Box</h2>
                <BoxInfoEdit updateBox={this.updateBox} setIsLoading={this.setIsLoading} />

                <DragDropContext
                    onDragStart={this.onDragStart}
                    onDragEnd={this.onDragEnd}
                >
                    <SongList songs={editBox.songs}
                        onRemoveSong={this.onRemoveSong}
                        onAddSong={this.onAddSong}
                        toggleSongPick={this.toggleSongPick}
                        isSongPickOpen={isSongPickOpen}
                        onDragStart={this.onDragStart}
                        onDragEnd={this.onDragEnd}
                        isDragging={isDragging}
                        isBoxAdd={true}
                    />
                </DragDropContext>

                <div className="btn-create-container">
                    <button
                        disabled={this.state.isLoading}
                        className={`btn-create ${this.state.isLoading ? 'faded-btn' : ''}`}
                        onClick={this.onAddBox}
                    >
                        Create Box
                        </button>
                    {this.state.msgWarning && <label className="msg-warnning">{this.state.msgWarning}</label>}
                </div>
            </section>
        )
    }
}

const mapStateToProps = state => {
    return {
    }
}

const mapDispatchToProps = {
    saveBox,
    loadBoxes
}

export const BoxAdd = connect(mapStateToProps, mapDispatchToProps)(_BoxAdd)