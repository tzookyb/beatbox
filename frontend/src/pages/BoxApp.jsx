import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadBoxes } from '../store/actions/boxAction'
import { BoxList } from '../cmps/boxes/BoxList'
import { BoxFilter } from '../cmps/boxes/BoxFilter'
import { ButtonsFilter } from '../cmps/ButtonsFilter'

import { boxService } from '../services/boxService'
import { userService } from '../services/userService'
import { loadUser } from '../store/actions/userAction'

class _BoxApp extends Component {
    state = {
        genres: null,
        isHomePage: true,
        filterBy: {
            name: '',
            genre: ''
        }
    }

    componentDidMount() {
        this.props.loadUser();
        const genre = new URLSearchParams(window.location.href).get('genre');
        const filterBy = { name: '', genre: genre }
        const { genres } = this.props;
        if (genres) this.setState({ genres, isHomePage: true, filterBy }, () => this.loadBoxes())
        else this.setState({ genres: [], isHomePage: false, filterBy }, () => this.loadBoxes())
    }

    onSetFilter = (filterByName) => {
        this.setState({ filterBy: { ...this.state.filterBy, name: filterByName.name } }, () => this.loadBoxes())
    }

    onSetFilterGenre = (filterByGenre) => {
        this.setState({ filterBy: { ...this.state.filterBy, genre: filterByGenre } }, () => this.loadBoxes())
    }

    loadBoxes = async () => {
        await this.props.loadBoxes(this.state.filterBy);
    }

    onToggleLikeBox = (boxId) => {
        var minimalUser = this.getMinimalUser();
        boxService.addLike(boxId, minimalUser)
            .then(() => this.loadBoxes())
    }
    onAddToFavorites = (boxId) => {
        //TODO: ADD TO USER FAVORITES
    }

    getMinimalUser() {
        return userService.getMinimalUser();
    }

    // getBestGenres() {
    //     const allGenres = boxService.getGenres();
    //     const mapGenresCount = allGenres.map(genre=>{
    //         return {genre, count:0}
    //     })
    // }

    render() {
        const { boxes } = this.props;
        // notused:
        const minimalUser = this.getMinimalUser();
        const { genres } = this.state;
        if (!boxes || !genres) return <h1>Loading....</h1>
        return (
            <section className="box-app" id="box">
                <BoxFilter onSetFilter={this.onSetFilter} />
                {this.state.isHomePage && genres.map((genre, idx) => {
                    return (
                        <BoxList boxes={boxes} key={idx} genre={genre} onToggleLikeBox={this.onToggleLikeBox}
                            minimalUser={minimalUser} onAddToFavorites={this.onAddToFavorites} />
                    )
                })}

                {!this.state.isHomePage &&
                    <ButtonsFilter onSetFilterGenre={this.onSetFilterGenre} genreCount={5} />
                }
                {!this.state.isHomePage && <BoxList boxes={boxes} onToggleLikeBox={this.onToggleLikeBox}
                    minimalUser={minimalUser} onAddToFavorites={this.onAddToFavorites} />}
            </section>
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

export const BoxApp = connect(mapStateToProps, mapDispatchToProps)(_BoxApp)