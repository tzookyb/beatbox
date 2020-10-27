import React from 'react'
import { connect } from 'react-redux'
import { setFilter } from '../store/actions/boxActions'

export function _NoResults(props) {
    return (
        <div>
            <div className="no-results flex column align-center">
                <h2>No search results...</h2>
                <button onClick={() => props.setFilter('')}>Clear search</button>
            </div>
        </div>
    )
}

const mapDispatchToProps = {
    setFilter
}
export const NoResults = connect(null, mapDispatchToProps)(_NoResults);