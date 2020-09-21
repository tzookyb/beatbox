import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-beautiful-dnd'

import { boxService } from '../services/boxService'
import { saveBox, loadBoxes } from '../store/actions/boxAction'
import { BoxInfoEdit } from '../cmps/box-details/BoxInfoEdit'
import { SongList } from '../cmps/box-details/SongList'
import CircleLoading from 'react-loadingg/lib/CircleLoading'



export class _BoxAdd extends Component {
    state = {
        editBox: null,
        msgWarning: '',
        isSongPickOpen: true,
        isDragging: false,
        isLoading: ''
    }

    componentDidMount() {
        const emptyBox = boxService.getEmptyBox();
        this.setState({ editBox: emptyBox })
    }

    printMsg(msg) {
        this.setState({ msgWarning: msg })
        setTimeout(() => {
            this.setState({ msgWarning: '' })
        }, 2000)
    }

    onAddBox = async (ev) => {
        ev.preventDefault();
        if (!this.state.editBox.name) {
            this.printMsg('Name of box is required');
            return;
        }
        if (!this.state.editBox.genre) {
            this.printMsg('Genre of box is required');
            return;
        }
        // if (!this.state.editBox.imgUrl) this.setState({ ...this.state.editBox, editBox:{ imgUrl: require('../assets/img/default-box-img.jpg') } })
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
        }))
    }

    onRemoveSong = (ev, songId) => {
        if (ev) {
            ev.stopPropagation();
            ev.preventDefault();
        }
        const newBox = { ...this.state.editBox }
        const songIdx = newBox.songs.findIndex(song => song.id === songId)
        newBox.songs.splice(songIdx, 1);
        this.setState({ editBox: newBox })
    }

    onAddSong = (song, idx = undefined) => {
        const newSong = boxService.addSong(song);
        const songs = [...this.state.editBox.songs];
        if (!idx) songs.push(newSong);
        else songs.splice(idx, 0, newSong);
        this.setState(prevState => ({ editBox: { ...prevState.editBox, songs } }))
    }

    toggleSongPick = () => {
        this.setState({ isSongPickOpen: !this.state.isSongPickOpen })
    }

    onDragStart = () => {
        this.setState({ isDragging: true })
    }

    onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (destination.droppableId === 'trash') {
            this.onRemoveSong(null, draggableId)
        }

        this.setState({ isDragging: false })

        if (destination.index === source.index) return;

        if (destination.droppableId === 'songList') {
            this.swapSongs(source.index, destination.index);
        }
    }

    swapSongs = (srcIdx, destIdx) => {
        const songs = [...this.state.editBox.songs];
        const [songToMove] = songs.splice(srcIdx, 1);
        songs.splice(destIdx, 0, songToMove)
        const newBox = { ...this.state.editBox, songs }
        this.setState({ editBox: newBox });
    }

    onPlaySong = () => {
        // TODO: add capability to demo listen to song (on hover prefferably - connect new player comp. here)
        return
    }

    setIsLoading = (isLoading) => {
        this.setState({ isLoading })
    }

    render() {
        const { editBox, isSongPickOpen, isDragging } = this.state;
        if (!editBox) return <CircleLoading  size="large" color= "#ac0aff"/>
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
                        onPlaySong={this.onPlaySong}
                    />
                </DragDropContext>

                <div className="btn-create-container">
                    <button disabled={this.state.isLoading} className={`btn-create ${this.state.isLoading ? 'faded-btn' : ''}`} onClick={this.onAddBox}>Create Box</button>
                    {this.state.msgWarning && <label className="msg-warnning">{this.state.msgWarning}</label>}
                </div>
            </section>
        )
    }
}

const mapStateToProps = state => {
    return {
        // boxes: state.boxReducer.boxes,
    }
}
const mapDispatchToProps = {
    saveBox,
    loadBoxes
}

export const BoxAdd = connect(mapStateToProps, mapDispatchToProps)(_BoxAdd)