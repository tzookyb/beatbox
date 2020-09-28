import React, { Component } from 'react';
import { connect } from 'react-redux';
// LOCAL IMPORTS
import { BoxPreview } from './BoxPreview';

export class _BoxActive extends Component {
    render() {
        const { activeBoxes } = this.props;
        if (!activeBoxes || !activeBoxes.length) return null;
        return (
            <React.Fragment>
                <div className="active-boxes-container">
                    <h1>Join one of the currently top active Boxes:</h1>
                    <div className="active-boxes-grid">
                        {activeBoxes.map((box, idx) => {
                            return <BoxPreview key={idx} box={box} />
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
export const BoxActive = connect(mapStateToProps, mapDispatchToProps)(_BoxActive);