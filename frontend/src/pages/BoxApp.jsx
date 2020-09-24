// OUTSOURCE IMPORT
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import CircleLoading from 'react-loadingg/lib/CircleLoading'
// LOCAL IMPORT
import { BoxList } from '../cmps/boxes/BoxList'
import { GenresFilter } from '../cmps/GenresFilter'
import { userService } from '../services/userService'
import { loadBoxes } from '../store/actions/boxAction'

class _BoxApp extends Component {

    componentDidMount() {
        this.props.loadBoxes();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.filter !== this.props.filter) {
            this.props.loadBoxes(this.props.filter);
        }
    }

    render() {
        const { boxes, genres } = this.props;
        const minimalUser = userService.getMinimalUser();
        if (!boxes) return <CircleLoading size="large" color="#ac0aff" />
        return (
            <section className="box-app" id="box">
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
        filter: state.boxReducer.filter,
        boxes: state.boxReducer.boxes,
    }
}
const mapDispatchToProps = {
    loadBoxes,
}

export const BoxApp = connect(mapStateToProps, mapDispatchToProps)(withRouter(_BoxApp))