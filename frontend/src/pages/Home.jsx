import React, { Component } from 'react'
import Footer from '../cmps/Footer'
import { BoxApp } from './BoxApp'
import { connect } from 'react-redux'

import { loadBoxes } from '../store/actions/boxAction'

export class _Home extends Component {

    state = {
    }

    componentDidMount() {
        this.props.loadBoxes()
    }

    getGenres = (boxes) => {
        var geners = [];
        boxes.forEach(box => {
            box.tags.forEach(tag => {
                if (!geners.includes(tag)) geners.push(tag);
            })
        })
        return geners;
    }

    render() {
        const { boxes } = this.props;
        if (!boxes) return <h1>Loading...</h1>
        const geners = this.getGenres(boxes)
        return (
            <div>
                <div className="hero-container flex justify-center align-center">
                    <div className="hero-txt flex align-center column">
                        <h1>Share the beat...</h1>
                        <a href="#box"><button>Get Started!</button></a>
                    </div>
                </div>
                <div className="gener-list">
                    {geners.map((gener, idx) => <BoxApp key={idx} gener={gener} />)}
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
