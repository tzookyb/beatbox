import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadBoxes } from '../store/actions/boxAction'
import { BoxList } from '../cmps/boxes/BoxList'
import { FilterBox } from '../cmps/boxes/FilterBox'
import { ButtonsFilter } from '../cmps/ButtonsFilter'

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

    loadBoxes = () => {
        this.props.loadBoxes(this.state.filterBy)
            .then(() => console.log('boxes loaded'))
    }

    render() {
        const { boxes } = this.props;
        const { genres } = this.state;
        if (!boxes || !genres) return <h1>Loading....</h1>
        return (
            <section className="box-app" id="box">
                <FilterBox onSetFilter={this.onSetFilter} />
                {this.state.isHomePage && genres.map((genre, idx) => {
                    return (
                        <BoxList boxes={boxes} key={idx} genre={genre} />
                    )
                })}
                {!this.state.isHomePage &&
                    <ButtonsFilter onSetFilterGenre={this.onSetFilterGenre}/>
                }
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
