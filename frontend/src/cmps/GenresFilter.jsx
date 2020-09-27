// OUTSOURCE IMPORT
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
// LOCAL IMPORT
import { boxService } from '../services/boxService'

export class _GenresFilter extends Component {
    state = {
        genres: [],
        genreCount: 5
    }

    componentDidMount() {
        const genres = boxService.getAllGenres();
        const { genreCount } = this.props;
        this.setState({ genres: [...genres], genreCount });
    }

    goNextGenre = () => {
        let currGenre = this.state.genres.splice(0, 1);
        let newGenres = [...this.state.genres, currGenre[0]]
        this.setState({ genres: newGenres })
    }

    goPrevGenre = () => {
        var currGenre = this.state.genres.splice(this.state.genreCount - 1, 1);
        let newGenres = [currGenre[0], ...this.state.genres]
        this.setState({ genres: newGenres })
    }

    getQueryParams = (genre) => {
        let query = new URLSearchParams(this.props.history.location.search);
        query.set('genre', genre);
        return query.toString();
    }
    
    getCurrGenre = () => {
        const urlParams = new URLSearchParams(this.props.history.location.search)
        return urlParams.get('genre');
    }

    render() {
        const { genres, genreCount } = this.state;
        if (!genres.length) return <h1>Loading...</h1>
        const currGenre = this.getCurrGenre();
        const isFiltered = !!this.props.location.search;
        return (
            <div className="btns-filter flex justify-center align-center">
                <button onClick={() => this.goPrevGenre()} className="btn-filter-nav"><ArrowBackIosIcon /></button>
                <Link to="/box" className={`btn-filter ${!isFiltered ? 'active-filter' : ''}`} >All</Link>
                {genres.map((genre, idx) => {
                    if (idx - 1 <= genreCount) {
                        return <Link
                            to={`/box?${this.getQueryParams(genre)}`}
                            className={`btn-filter ${(genre === currGenre) ? 'active-filter' : ''}`}
                            key={idx} > {genre}
                        </Link>
                        // return <NavLink to={`/ box ?& genre=${genre}`} className="btn-filter" key={idx}>{genre} </NavLink>
                    } else return null;
                })
                }
                <button onClick={() => this.goNextGenre()} className="btn-filter-nav"><ArrowForwardIosIcon /></button>
            </div >
        )
    }
}

export const GenresFilter = withRouter(_GenresFilter);