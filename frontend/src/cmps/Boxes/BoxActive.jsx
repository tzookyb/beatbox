import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// LOCAL IMPORTS

export class _BoxActive extends Component {
    render() {
        const { activeBoxes } = this.props;
        if (!activeBoxes || !activeBoxes.length) return null;
        activeBoxes.forEach(box => {
            box.songs = box.songs.splice(0, 3)
        })
        return (
            <React.Fragment>
                <div id="active-box" className="active-boxes-container main-container">
                    <h1 className={window.innerWidth < 740 ? 'full' : ''}>Join one of the currently top active Boxes:</h1>
                    <div className={`active-boxes-grid ${window.innerWidth < 740 ? 'full' : ''}`}>
                        {activeBoxes.map((box, idx) => {
                            return (
                                <div
                                    key={idx}
                                    className="active-box flex column"
                                    onClick={() => this.props.history.push(`/ box / details / ${box._id}`)}
                                >
                                    <div className="active-box-title">
                                        <h2>{box.name}</h2>
                                    </div>
                                    <div className="active-box-img">
                                        <img src={box.imgUrl} alt="box" />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </div>
            </React.Fragment >
        )
    }
}

const mapStateToProps = state => {
    return {
        activeBoxes: state.boxReducer.activeBoxes
    }
}
const mapDispatchToProps = {}
export const BoxActive = connect(mapStateToProps, mapDispatchToProps)(withRouter(_BoxActive));