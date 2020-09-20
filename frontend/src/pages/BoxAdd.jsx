import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-beautiful-dnd'

import { boxService } from '../services/boxService'
import { saveBox, loadBoxes } from '../store/actions/boxAction'
import { BoxInfoEdit } from '../cmps/box-details/BoxInfoEdit'
import { SongList } from '../cmps/box-details/SongList'

export class _BoxAdd extends Component {
    state = {
        editBox: null,
        msgWarning: '',
        isSongPickOpen: true,
        isDragging: false
    }

    componentDidMount() {
        const emptyBox = boxService.getEmptyBox();
        this.setState({ editBox: emptyBox })
    }

    printMsg() {
        this.setState({ msgWarning: 'Name of box is required' })
        setTimeout(() => {
            this.setState({ msgWarning: '' })
        }, 2000)
    }

    onAddBox = async (ev) => {
        ev.preventDefault();
        if (!this.state.editBox.name) {
            this.printMsg();
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
                tags: box.tags,
                description: box.description,
                imgUrl: box.imgUrl
            }
        }))
    }

    onRemoveSong = (ev, songId) => {
        ev.stopPropagation();
        ev.preventDefault();
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
        this.setState({ isDragging: false })

        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.index === source.index) return;

        if (destination.droppableId === 'songList') {
            this.swapSongs(source.index, destination.index);
        }
        if (destination.droppableId === 'trash') {
            this.onRemoveSong(null, draggableId)
        }
    }

    swapSongs = (srcIdx, destIdx) => {
        const songs = [...this.state.editBox.songs];
        const [songToMove] = songs.splice(srcIdx, 1);
        songs.splice(destIdx, 0, songToMove)
        const newBox = { ...this.state.box, songs }
        this.setState({ editBox: newBox });
    }

    render() {
        const { editBox, isSongPickOpen } = this.state;
        if (!editBox) return <h1>Loading...</h1>
        return (
            <section className="box-add main-container">
                <h2>Create Your Box</h2>
                <BoxInfoEdit updateBox={this.updateBox} />

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
                    />
                </DragDropContext>

                <div className="btn-create-container">
                    <button className="btn-create" onClick={this.onAddBox}>Create Box</button>
                    {this.state.msgWarning && <label>{this.state.msgWarning}</label>}
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