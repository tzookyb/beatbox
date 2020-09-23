// OUTSOURCE IMPORT
import React, { Component } from 'react'
import { connect } from 'react-redux'
import CircleLoading from 'react-loadingg/lib/CircleLoading'
// LOCAL IMPORT
import { BoxList } from '../cmps/boxes/BoxList'
import { BoxFilter } from '../cmps/boxes/BoxFilter'
import { GenresFilter } from '../cmps/GenresFilter'
import { userService } from '../services/userService'
import { loadBoxes } from '../store/actions/boxAction'

class _BoxApp extends Component {
    state = {
        filterBy: {
            name: '',
            genre: ''
        }
    }

    componentDidMount() {
        let genre = new URLSearchParams(window.location.href).get('genre');
        if (!genre) genre = '';
        const filterBy = { name: '', genre }
        this.setState({ ...this.state.filterBy, filterBy: { genre } }, () => this.props.loadBoxes(filterBy))
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.location?.search === prevProps.location?.search) return;
        const genre = new URLSearchParams(window.location.href).get('genre');
        let filterBy = { name: '', genre: '' };
        if (genre) filterBy = { name: '', genre }
        this.props.loadBoxes(filterBy);
    }

    onSetFilter = (name, value) => {
        this.setState({ filterBy: { ...this.state.filterBy, [name]: value } }, () => this.props.loadBoxes(this.state.filterBy))
    }

    render() {
        const { boxes, genres } = this.props;
        const minimalUser = userService.getMinimalUser();
        if (!boxes) return <CircleLoading size="large" color="#ac0aff" />
        return (
            <section className="box-app" id="box">
                    <BoxFilter onSetFilter={this.onSetFilter} />
                    {!!genres && genres.map((genre, idx) => {
                        return (
                            <BoxList boxes={boxes} key={idx} genre={genre}
                                minimalUser={minimalUser} />
                        )
                    })}
                    {!genres && <GenresFilter genreCount={5} />}
                    {!genres && <BoxList boxes={boxes} minimalUser={minimalUser} />}
                
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
}

export const BoxApp = connect(mapStateToProps, mapDispatchToProps)(_BoxApp)
