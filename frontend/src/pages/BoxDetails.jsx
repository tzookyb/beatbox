import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { ChatBox } from '../cmps/box-details/ChatBox'
import { SongList } from '../cmps/box-details/SongList'
import { BoxInfo } from '../cmps/box-details/BoxInfo'
import { loadBox, saveBox } from '../store/actions/boxAction'
import { boxService } from '../services/boxService'


class _BoxDetails extends Component {
    state = {
        box: null,
    }

    async componentDidMount() {
        const boxId = this.props.match.params.boxId;
        await this.props.loadBox(boxId)
        const { box } = this.props
        this.setState({ box })
    }

    onRemoveSong = (ev, songId) => {
        ev.stopPropagation();
        ev.preventDefault();
        const box = { ...this.state.box }
        const songIdx = box.songs.findIndex(song => song.id === songId)
        box.songs.splice(songIdx, 1);
        this.props.saveBox(box)
        // await this.props.removeSong(songId)
    }

    onAddSong = (song) => {
        const newSong = boxService.addSong(song)
        const box = { ...this.state.box }
        box.songs.push(newSong)
        this.props.saveBox(box)
    }

    onPlaySong = (currSongIdx) => {
        const box = { ...this.state.box, currSongIdx };
        this.props.saveBox(box);
    }

    onSaveInfo = (box) => {
        this.props.saveBox(box);
    }


    render() {
        const { box } = this.state;
        if (!box) return <h1>Loading...</h1>
        return (
            <section className="box-details main-container">
                <BoxInfo box={box} onSaveInfo={this.onSaveInfo} />
                <SongList songs={box.songs} onPlaySong={this.onPlaySong} onRemoveSong={this.onRemoveSong} onAddSong={this.onAddSong} />

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
    saveBox
}

export const BoxDetails = connect(mapStateToProps, mapDispatchToProps)(_BoxDetails)