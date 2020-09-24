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
        // this.setState({ searchStr: value }, this.props.setFilter(value));
        let query = new URLSearchParams(window.location.href);
        query.append('name', value)
        this.props.history.push(query.toString())
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
    // filterBy: state.boxReducer.filterBy
})
const mapDispatchToProps = {
    setFilter
}
export const BoxFilter = connect(mapStateToProps, mapDispatchToProps)(withRouter(_BoxFilter))

// isSearchOpen: false
// import CloseIcon from '@material-ui/icons/Close';
// <div className={`box - filter flex justify - center ${ isSearchOpen ? 'open' : '' } `}>
// {!isSearchOpen && <SearchIcon className="search-icon" onClick={this.toggleSearch} />}
// {isSearchOpen && <CloseIcon className="search-icon" onClick={this.toggleSearch} />}
// toggleSearch = () => {
    //     this.setState(prevState => ({ isSearchOpen: !prevState.isSearchOpen }));
    // }