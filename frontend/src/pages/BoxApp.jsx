// OUTSOURCE IMPORT
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import CircleLoading from 'react-loadingg/lib/CircleLoading'
// LOCAL IMPORT
import { boxService } from '../services/boxService'
import { BoxList } from '../cmps/boxes/BoxList'
import { GenresFilter } from '../cmps/GenresFilter'
import { loadBoxes } from '../store/actions/boxActions'
import { NoResults } from '../cmps/NoResults'

class _BoxApp extends Component {
    state = {
        filterBy: undefined
    }

    componentDidMount() {
        if (!this.props.boxes) this.props.loadBoxes();
        this.setFilter();
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

        return (
            <section className="box-app" id="box">
                {genres && genres.map((genre, idx) => {
                    return (
                        <BoxList
                            boxes={boxes}
                            key={idx}
                            genre={genre}
                        />
                    )
                })}

                {!genres && <React.Fragment>
                    <GenresFilter />
                    <BoxList boxes={boxes} />
                </React.Fragment>}
                {!boxes.length && < NoResults />}

            </section>
        )
    }
}

const mapStateToProps = state => ({
    boxes: state.boxReducer.boxes,
    user: state.userReducer.loggedinUser,
});
const mapDispatchToProps = { loadBoxes };
export const BoxApp = connect(mapStateToProps, mapDispatchToProps)(withRouter(_BoxApp));