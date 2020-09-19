import React, { Component } from 'react'
import Footer from '../cmps/Footer'
import { BoxApp } from './BoxApp'
import { connect } from 'react-redux'

// import { boxService } from '../services/boxService'
import { loadBoxes } from '../store/actions/boxAction'
import { loadUser } from '../store/actions/userAction'

// const heroImgUrls = [
//     '../assets/img/bg1.png',
//     '../assets/img/bg2.png',
//     '../assets/img/hero1.png'
// ]

class _Home extends Component {
    // state = {
    //     currentImg: 0
    // }



    // nextBackground = () => {
    //     console.log(this.state);
    //     let currentImg = this.state.currentImg
    //     currentImg++
    //     currentImg = currentImg % heroImgUrls.length;
    //     this.setState({ currentImg})
    // }


    componentDidMount() {
        this.props.loadBoxes();
        this.props.loadUser();
        // console.log(heroImgUrls[this.state.currentImg]);
        // setInterval(() => this.nextBackground(), 3000);
        // this.nextBackground()
    }

    getGenres(boxes) {
        var genres = [];
        boxes.forEach(box => {
            box.tags.forEach(tag => {
                if (!genres.includes(tag)) genres.push(tag);
            })
        })
        return genres
    }

    render() {
        // const style = {
        //     backgroundImage : `require(${heroImgUrls[this.state.currentImg]})`
        // }
        const { boxes } = this.props;
        if (!boxes) return <h1>Loading...</h1>
        const genres = this.getGenres(boxes)
        return (
            <React.Fragment>
                <div className="hero-container flex justify-center align-center" >
                    <div className="hero-txt flex align-center column">
                        <h1>Share the <span>Beat</span>...</h1>
                        <a href="#box"><button>Start listening!</button></a>
                    </div>
                </div>
                <div className="gener-list">
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
        user: state.userReducer.loggedinUser
    }
}
const mapDispatchToProps = {
    loadBoxes,
    loadUser
}

export const Home = connect(mapStateToProps, mapDispatchToProps)(_Home)
