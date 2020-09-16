
import React, { Component } from 'react'

import { boxService } from '../services/boxService'
import { ChatBox } from '../cmps/BoxDetails/ChatBox'
import { BoxPlaylist } from '../cmps/BoxDetails/BoxPlaylist'
import { BoxInfo } from '../cmps/BoxDetails/BoxInfo'

class _BoxDetails extends Component {
    state = {
        box: null
    }

    componentDidMount() {
        const boxId = this.props.match.params.boxId;
        boxService.getById(boxId).then((box) => this.setState({ box }))
    }

    render() {
        const { box } = this.state;
        return (
            <section className="box-details">
                <BoxInfo box={box} />
                <BoxPlaylist songs={box.songs} />
                <ChatBox />
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

