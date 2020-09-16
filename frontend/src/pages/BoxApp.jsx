import React, { Component } from 'react'
import { connect } from 'react-redux'

import { loadBoxes } from '../store/actions/boxAction'
import { BoxList } from '../cmps/Boxes/BoxList'

class _BoxApp extends Component {


    componentDidMount() {
        this.props.loadBoxes();
    }

    render() {
        const { boxes, gener } = this.props;
        if (!boxes) return <h1>Loading....</h1>
        return (
            <section className="box-app" id="boxes">
                <BoxList boxes={boxes} gener={gener}/>
            </section>
        )
    }
}

const mapStateToProps = state => {
    return {
        boxes: state.boxReducer.boxes,
    }
}
const mapDispatchToProps = {
    loadBoxes
}

export const BoxApp = connect(mapStateToProps, mapDispatchToProps)(_BoxApp)
