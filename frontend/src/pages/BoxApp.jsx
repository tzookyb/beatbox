import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadBoxes } from '../store/actions/boxAction'
import { BoxList } from '../cmps/boxes/BoxList'

class _BoxApp extends Component {
    state = {
        genres: null,
    }

    componentDidMount() {
        const genre = new URLSearchParams(window.location.href).get('genre');
        console.log("componentDidMount -> genre", genre)
        const { genres } = this.props;
        if (genres) this.setState({ genres })
        else this.setState({ genres: [] })
        this.props.loadBoxes(genre);
    }

    render() {
        const { boxes } = this.props;
        const { genres } = this.state;
        if (!boxes || !genres) return <h1>Loading....</h1>
        return (
            <section className="box-app" id="box">
                {genres.length && genres.map((genre, idx) => <BoxList boxes={boxes} key={idx} genre={genre} />)}
                {!genres.length && <BoxList boxes={boxes} />}
            </section>
        )
    }
}

const mapStateToProps = state => {
    return {
        boxes: state.boxReducer.boxes,
    }
}
const mapDispatchToProps = {
    loadBoxes
}

export const BoxApp = connect(mapStateToProps, mapDispatchToProps)(_BoxApp)
