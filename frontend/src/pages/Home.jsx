import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CircleLoading } from 'react-loadingg';

import { BoxApp } from './BoxApp'
import { loadBoxes } from '../store/actions/boxAction'
import { Footer } from '../cmps/Footer'

class _Home extends Component {

    async componentDidMount() {
        await this.props.loadBoxes();
        // this.setState({ boxes: this.props.boxes });
        // this.props.loadUser();
    }

    getGenres(boxes) {
        let allGenres = [];
        boxes.forEach(box => {
            allGenres.push(box.genre);
        })
        const genres = [...new Set(allGenres)];
        return genres;
    }

    render() {
        const { boxes } = this.props;
        if (!boxes) return <CircleLoading size="large" color="#ac0aff" />
        const genres = this.getGenres(boxes);
        return (
            <React.Fragment>
                <div id="top" className="hero-container flex justify-center align-center" >
                    <div className="hero-txt flex align-center column">
                        <h1>Share the <span>Beat</span>...</h1>
                        <a href="#box"><button>Start listening</button></a>
                    </div>
                    <div className="hero-img">
                        <img src={require('../assets/img/hero3.jpg')} alt="" />
                        <img src={require('../assets/img/hero2.png')} alt="" />
                        <img src={require('../assets/img/hero1.jpg')} alt="" />
                    </div>
                </div>
                <div className="genre-list">
                    {genres.length && <BoxApp genres={genres} />}
                </div>
                <Footer />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        boxes: state.boxReducer.boxes,
    }
}
const mapDispatchToProps = {
    loadBoxes,
}

export const Home = connect(mapStateToProps, mapDispatchToProps)(_Home)
