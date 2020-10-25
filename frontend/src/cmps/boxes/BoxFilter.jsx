// OUTSOURCE IMPORTS
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SearchIcon from '@material-ui/icons/Search';
import { debounce } from '@material-ui/core';

// LOCAL IMPORTS
import { setFilter } from '../../store/actions/boxAction';

export class _BoxFilter extends Component {
    state = {
        searchStr: '',
        isSearchOpen: false,
        isAtBoxDetails: false
    }
    componentDidMount() {
        this.checkIfAtDetails();
    }

    ref = React.createRef()

    async componentDidUpdate(prevProps) {
        await this.checkIfAtDetails();

        if (this.props.location.search !== prevProps.location.search &&
            this.props.location.pathname !== '/') {
            this.onSetFilter();
        }
    }

    checkIfAtDetails = () => {
        const status = this.props.location.pathname.startsWith('/box/details')
        if (status !== this.state.isAtBoxDetails) this.setState({ searchStr: '', isAtBoxDetails: status })
    }

    onHandleChange = ({ target }) => {
        this.setState({ searchStr: target.value }, this.onSetFilter);

        if (this.state.isSearchOpen) {
            if (!this.debouncedSearch) {
                this.debouncedSearch = debounce(() => {
                    if (this.state.isSearchOpen) this.toggleSearch()
                }, 3000)
            }
            this.debouncedSearch();
        }
    }

    onSetFilter = () => {
        if (this.state.isAtBoxDetails) {
            this.props.setFilter(this.state.searchStr);
            return
        }
        const query = new URLSearchParams(window.location.search);
        query.set('name', this.state.searchStr);
        this.props.history.push(`/box?${query.toString()}`);
    }

    toggleSearch = () => {
        this.setState(prevState => ({ isSearchOpen: !prevState.isSearchOpen }), () => {
            if (this.state.isSearchOpen) this.ref.current.focus();
        });
    }

    render() {
        const { searchStr, isAtBoxDetails, isSearchOpen } = this.state;
        const { isShown } = this.props;
        return (
            <div className={`box-filter flex ${(isShown) ? '' : 'invisible'} ${isSearchOpen ? 'is-open' : ''}`}>
                <input
                    ref={this.ref}
                    type="search"
                    className={isAtBoxDetails ? '' : "name-filter"}
                    name="name"
                    autoComplete="off"
                    value={searchStr}
                    onChange={this.onHandleChange}
                    placeholder={isAtBoxDetails ? 'Search in playlist' : 'Search for a Box'} />
                <SearchIcon className="search-icon" onClick={this.toggleSearch} />
            </div>
        )
    }
}

const mapDispatchToProps = {
    setFilter
}
export const BoxFilter = connect(null, mapDispatchToProps)(withRouter(_BoxFilter))