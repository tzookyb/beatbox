import React, { Component } from 'react';
import { connect } from 'react-redux';

class _Emoji extends Component {
    state = {
        clientWidth: null,
        clientHeight: null,
        emojis: [
            { img: { ('') }, bottom: 0, left: 0 }
        ]
    }
    emojis = ['']

    componentDidMount() {
        this.getClientScreen()
    }

    componentDidUpdate(prevProps, prevState) {
        const emoji = {}
    }

    render() {
        const { emojis } = this.props
        return (
            <div>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        emojis: state.messageReducer.emojis
    }
}

const mapDispatchToProps = {

}

export const Emoji = connect(mapStateToProps, mapDispatchToProps)(_Emoji);