import React, { Component } from 'react'

import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

export class BoxFilter extends Component {
    state = {
        name: '',
        isSearchOpen: false
    }

    onHandleChange = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState({ [field]: value }, () => this.props.onSetFilter(this.state));
    }

    toggleSearch = () => {
        this.setState(prevState => ({ isSearchOpen: !prevState.isSearchOpen }));
    }

    render() {
        const { name, isSearchOpen } = this.state;
        return (
            <div className={`box-filter flex justify-center ${isSearchOpen ? 'open' : ''}`}>
                <input type="search" className="name-filter" name="name" autoComplete="off" value={name}
                    onChange={this.onHandleChange} placeholder="Search Box" />
                {!isSearchOpen && <SearchIcon className="search-icon" onClick={this.toggleSearch} />}
                {isSearchOpen && <CloseIcon className="search-icon" onClick={this.toggleSearch} />}
            </div>
        )
    }
}