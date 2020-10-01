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
    componentDidMount() {
        this.onLoadBoxes();
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.search === prevProps.location.search) return;
        this.onLoadBoxes();
    }

    onLoadBoxes = () => {
        this.props.loadBoxes(this.props.location.search);
    }

    render() {
        const { boxes } = this.props;
        if (!boxes) return <CircleLoading size="large" color="#ac0aff" />
        const genres = boxService.getUsedGenres(boxes);
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
                {!genres && <GenresFilter genreCount={5} />}
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