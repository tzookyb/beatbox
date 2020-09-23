// OUTSOURCE IMPORT
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
// LOCAL IMPORT
import { boxService } from '../services/boxService'


export class GenresFilter extends Component {
    state = {
        genres: [],
        genreCount: 5
    }

    componentDidMount() {
        const genres = boxService.getAllGenres();
        const { genreCount } = this.props
        this.setState({ genres: [...genres], genreCount })
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

    render() {
        const { genres, genreCount } = this.state
        if (!genres.length) return <h1>Loading...</h1>
        return (
            <div className="btns-filter flex justify-center">
                <button onClick={() => this.goPrevGenre()} className="btn-filter-nav"><ArrowBackIosIcon /></button>
                <Link to={`/box`} className="btn-filter">All </Link>
                {genres.map((genre, idx) => {
                    if (idx - 1 <= genreCount) {
                        return <Link to={`/box?&genre=${genre}`} className="btn-filter" key={idx}>{genre} </Link>
                    } else return null;
                })
                }
                <button onClick={() => this.goNextGenre()} className="btn-filter-nav"><ArrowForwardIosIcon /></button>
            </div>
        )
    }
}


