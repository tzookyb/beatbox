import React, { Component } from 'react'
import Footer from '../cmps/Footer'
import { BoxApp } from './BoxApp'
import { connect } from 'react-redux'

import {boxService} from '../services/boxService'
import { loadBoxes } from '../store/actions/boxAction'

export class _Home extends Component {

    state = {
    }

    componentDidMount() {
        this.props.loadBoxes()
    }

    getGenres () {
        return boxService.getGenres();
        // var genres = [];
        // boxes.forEach(box => {
        //     box.tags.forEach(tag => {
        //         if (!genres.includes(tag)) genres.push(tag);
        //     })
        // })
        // return genres;
    }

    render() {
        const { boxes } = this.props;
        if (!boxes) return <h1>Loading...</h1>
        const genres = this.getGenres(boxes)
        return (
            <div>
                <div className="hero-container flex justify-center align-center">
                    <div className="hero-txt flex align-center column">
                        <h1>Share the beat...</h1>
                        <button>Get Started!</button>
                    </div>
                </div>
                <div className="gener-list">
                    {genres.length && <BoxApp genres={genres} />}
                </div>
                <Footer />
            </div>
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

export const Home = connect(mapStateToProps, mapDispatchToProps)(_Home)
