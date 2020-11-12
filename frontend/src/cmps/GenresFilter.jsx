// OUTSOURCE IMPORT
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

// LOCAL IMPORT
import { boxService } from '../services/boxService'
import { utilService } from '../services/utilService';

class _GenresFilter extends Component {
    state = {
        genres: [],
    }

    ref = React.createRef()
    activeFilter = React.createRef()

    componentDidMount() {
        const genres = boxService.getAllGenres();
        this.setState({ genres: [...genres] });
        setTimeout(() => {
            this.activeFilter.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'center' });
        }, 1);
    }

    executeScroll = utilService.executeScroll;

    onSetGenre = (genre) => {
        this.props.history.push(`/box?${this.getQueryParams(genre)}`);
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
        const { genres } = this.state;
        const currGenre = this.getCurrGenre();

        return (
            <div className="main-container">

                <div className="btns-filter" ref={this.ref}>

                <button className="nav-left-btn" onClick={() => this.executeScroll(-this.ref.current.offsetWidth-50)}><ArrowBackIosIcon /></button>

                    <p onClick={() => this.onSetGenre('')} ref={this.activeFilter} className={`btn-filter cursor-pointer ${!currGenre ? 'active-filter' : ''}`}>All</p>
                    {genres.map((genre, idx) => {
                        return <p
                            ref={genre === currGenre ? this.activeFilter : null}
                            onClick={() => this.onSetGenre(genre)}
                            className={`btn-filter cursor-pointer ${(genre === currGenre) ? 'active-filter' : ''}`}
                            key={idx}>
                            {genre}
                        </p>
                    })
                    }

                <button className="nav-right-btn" onClick={() => this.executeScroll(this.ref.current.offsetWidth-50)}><ArrowForwardIosIcon /></button>

                </div >
            </div>
        )
    }
}

export const GenresFilter = withRouter(_GenresFilter);