import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import SearchIcon from '@material-ui/icons/Search';
import { setFilter } from '../../store/actions/boxAction';

export class _BoxFilter extends Component {
    state = {
        searchStr: '',
    }

    onHandleChange = ({ target }) => {
        const value = target.value;
        this.setState({ searchStr: value });
        let genre = new URLSearchParams(window.location.href).get('genre')
        console.log("onHandleChange -> genre", genre)

        let query = new URLSearchParams();
        query.append('name', value)
        this.props.history.push(`/box/${query.toString()}`)
    }

    render() {
        const { searchStr } = this.state;
        return (
            <div className={`box-filter flex justify-center open ${(this.props.isShown) ? '' : 'opacity0'}`}>
                <input type="search" className="name-filter" name="name" autoComplete="off" value={searchStr}
                    onChange={this.onHandleChange} placeholder="Search Box" />
                {<SearchIcon className="search-icon" onClick={this.toggleSearch} />}
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
})
const mapDispatchToProps = {
    setFilter
}
export const BoxFilter = connect(mapStateToProps, mapDispatchToProps)(withRouter(_BoxFilter))