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
        isScrolled: false
    }

    executeScroll = (scrollTo) => {
        let scrollDiff = this.ref.current.scrollWidth - this.ref.current.offsetWidth

        if (this.ref.current.scrollLeft !== 0) {
            this.setState({ isScrolled: true });
        }
        if (this.ref.current.scrollLeft >= scrollDiff) {
            this.ref.current.scrollLeft = 0
            this.setState({ isScrolled: false })
        }
        else if (this.ref.current.scrollLeft < scrollDiff) {
            this.ref.current.scrollLeft += scrollTo
        }
        else {
            this.setState({ isScrolled: false })
        }
    }

    componentDidMount() {
        this.ref = React.createRef()
        const genres = boxService.getAllGenres();
        this.setState({ genres: [...genres]});
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
        const { genres} = this.state;
        if (!genres.length) return <h1>Loading...</h1>
        const currGenre = this.getCurrGenre();
        const isFiltered = !!this.props.location.search;
        return (
            <div className="main-container">

                <div className="btns-filter" ref={this.ref}>

                    {this.state.isScrolled && <button className="list-left-btn" onClick={() => this.executeScroll(-100)}><ArrowBackIosIcon /></button>}

                    <Link to="/box" className={`btn-filter flex justify-center align-center${!isFiltered ? 'active-filter' : ''}`} >All</Link>
                    {genres.map((genre, idx) => {
                        return <Link
                            to={`/box?${this.getQueryParams(genre)}`}
                            className={`btn-filter ${(genre === currGenre) ? 'active-filter' : ''}`}
                            key={idx} > {genre}
                        </Link>
                    })
                    }

                    <button className="list-right-btn" onClick={() => this.executeScroll(100)}><ArrowForwardIosIcon /></button>

                </div >
            </div>
        )
    }
}

export const GenresFilter = withRouter(_GenresFilter);