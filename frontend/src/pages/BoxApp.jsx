// OUTSOURCE IMPORT
import React, { Component } from 'react'
import { connect } from 'react-redux'
import CircleLoading from 'react-loadingg/lib/CircleLoading'
// LOCAL IMPORT
import { BoxList } from '../cmps/boxes/BoxList'
import { BoxFilter } from '../cmps/boxes/BoxFilter'
import { ButtonsFilter } from '../cmps/ButtonsFilter'
import { userService } from '../services/userService'
import { loadBoxes } from '../store/actions/boxAction'
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
        let genre = new URLSearchParams(window.location.href).get('genre');
        if (!genre) genre = '';
        const filterBy = { name: '', genre };
        const { genres } = this.props;
        if (genres) this.setState({ genres, isHomePage: true, filterBy }, () => this.loadBoxes(filterBy))
        else this.setState({ genres: [], isHomePage: false, filterBy }, () => this.loadBoxes(filterBy))
    }

    onSetFilter = (filterByName) => {
        this.setState({ filterBy: { ...this.state.filterBy, name: filterByName.name } }, () => this.loadBoxes(this.state.filterBy))
    }

    onSetFilterGenre = (filterByGenre) => {
        this.setState({ filterBy: { ...this.state.filterBy, genre: filterByGenre } }, () => this.loadBoxes(this.state.filterBy))
    }

    loadBoxes = async () => {
        await this.props.loadBoxes(this.state.filterBy);
    }

    getMinimalUser() {
        return userService.getMinimalUser();
    }
    //TODO: ADD TO FAVORITES, GET THE 3 BEST

    render() {
        const { boxes } = this.props;
        const { genres } = this.state;
        const minimalUser = this.getMinimalUser();
        if (!boxes || !genres) return <CircleLoading size="large" color="#ac0aff" />
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