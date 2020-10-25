// OUTSOURCE IMPORT
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import CircleLoading from 'react-loadingg/lib/CircleLoading'
// LOCAL IMPORT
import { boxService } from '../services/boxService'
import { userService } from '../services/userService'
import { BoxList } from '../cmps/boxes/BoxList'
import { GenresFilter } from '../cmps/GenresFilter'
import { loadBoxes } from '../store/actions/boxAction'

class _BoxApp extends Component {
    state = {
        filterBy: undefined
    }

    componentDidMount() {
        this.props.loadBoxes();
        this.setFilter()
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.search === prevProps.location.search) return;
        this.setFilter();
    }

    setFilter = () => {
        const filterBy = new URLSearchParams(this.props.location.search);
        const genre = filterBy.get('genre') || '';
        const name = filterBy.get('name') || '';
        this.setState({ filterBy: { genre, name } })
    }

    render() {
        var { boxes } = this.props;
        if (!boxes) return <CircleLoading size="large" color="#ac0aff" />

        const { filterBy } = this.state;
        if (filterBy) {
            boxes = boxes.filter(box => {
                return box.name.toLowerCase().includes(filterBy.name.toLowerCase()) &&
                    box.genre.includes(filterBy.genre);
            })
        }

        let genres;
        if (this.props.location.pathname === '/') genres = boxService.getUsedGenres(boxes);

        const minimalUser = userService.getMinimalUser();

        return (
            <section className="box-app" id="box">
                {!!genres && genres.map((genre, idx) => {
                    return (
                        <BoxList
                            boxes={boxes}
                            key={idx}
                            genre={genre}
                            minimalUser={minimalUser}
                        />
                    )
                })}
                {!genres && <GenresFilter />}
                {!genres && <BoxList boxes={boxes} minimalUser={minimalUser} />}

            </section>
        )
    }
}

const mapStateToProps = state => {
    return {
        boxes: state.boxReducer.boxes,
        user: state.userReducer.loggedinUser,
    }
}
const mapDispatchToProps = {
    loadBoxes,
}

export const BoxApp = connect(mapStateToProps, mapDispatchToProps)(withRouter(_BoxApp))