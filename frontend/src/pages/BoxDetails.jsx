import React, { Component } from 'react'
import { boxService } from '../services/boxService'
import { ChatBox } from '../cmps/BoxDetails/ChatBox'
import { SongList } from '../cmps/BoxDetails/SongList'
import { BoxInfo } from '../cmps/BoxDetails/BoxInfo'
import { songService } from '../services/songService'

class _BoxDetails extends Component {
    state = {
        box: null,
        songs: []
    }

    async componentDidMount() {
        const songs = await songService.query()

        console.log("componentDidMount -> songs", songs)
        this.setState({ songs })
        // const boxId = this.props.match.params.boxId;
        // boxService.getById(boxId).then((box) => this.setState({ box }))
    }

    render() {
        const { box, songs } = this.state;
        return (
            <section className="box-details flex column main-container">
                <BoxInfo />
                <SongList songs={songs} />

                {/* <ChatBox /> */}
            </section>
        )
    }
}

const mapStateToProps = state => {
    return {

    }
}
const mapDispatchToProps = {

}

export const BoxDetails = connect(mapStateToProps, mapDispatchToProps)(_BoxDetails)