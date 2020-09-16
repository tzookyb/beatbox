import React, { Component } from 'react'
import { connect } from 'react-redux'

import { ChatBox } from '../cmps/BoxDetails/ChatBox'
import { SongList } from '../cmps/BoxDetails/SongList'
import { BoxInfo } from '../cmps/BoxDetails/BoxInfo'
import { loadBox, saveBox } from '../store/actions/boxAction'


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
        ev.stopPropagation()
        const box = { ...this.state.box }
        const songIdx = box.songs.findIndex(song => song.id === songId)
        box.songs.splice(songIdx, 1);
        this.props.saveBox(box)
        // await this.props.removeSong(songId)
    }

    onAddSong = (song) =>{
        const newSong = {
            id: song.id.videoId,
            title: song.snippet.title,
            imgUrl: song.snippet.thumbnails.default,
            addedBy: {}
        }

        const box = { ...this.state.box }
        box.songs.push(newSong)
        this.props.saveBox(box)
    }

    render() {
        const { box } = this.state;
        if (!box) return <h1>Loading...</h1>
        return (
            <section className="box-details main-container">
                <BoxInfo />
                <SongList songs={box.songs} onRemoveSong={this.onRemoveSong} onAddSong={this.onAddSong} />

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