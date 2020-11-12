// OUTSOURCE IMPORTS
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SearchIcon from '@material-ui/icons/Search';
import { debounce } from '@material-ui/core';
// LOCAL IMPORTS
import { setFilter } from '../../store/actions/boxActions';

class _BoxFilter extends Component {
    state = {
        isSearchOpen: false,
        isAtBoxDetails: false
    }
    ref = React.createRef()

    componentDidMount() {
        this.checkIfAtDetails();
    }

    componentDidUpdate(prevProps) {
        this.checkIfAtDetails();
        if (prevProps.filter !== this.props.filter) this.onHandleChange();
    }

    checkIfAtDetails = () => {
        const status = this.props.location.pathname.startsWith('/box/details')
        if (this.state.isAtBoxDetails !== status) this.setState({ isAtBoxDetails: status }, this.props.setFilter(''))
    }

    onHandleChange = () => {
        if (!this.state.isAtBoxDetails) this.searchBox();
        if (this.state.isSearchOpen) {
            if (!this.debouncedSearch) {
                this.debouncedSearch = debounce(() => {
                    if (this.state.isSearchOpen) this.toggleSearch()
                }, 3000)
            }
            this.debouncedSearch();
        }
    }

    searchBox = () => {
        const query = new URLSearchParams(window.location.search);
        query.set('name', this.props.filter);
        this.props.history.push(`/box?${query.toString()}`);
    }

    toggleSearch = () => {
        this.setState(prevState => ({ isSearchOpen: !prevState.isSearchOpen }), () => {
            if (this.state.isSearchOpen) this.ref.current.focus();
        });
    }

    render() {
        const { isAtBoxDetails, isSearchOpen } = this.state;
        const { isShown, filter } = this.props;
        if (!isShown && isSearchOpen) this.setState({ isSearchOpen: false });
        return (
            <div className={`box-filter flex ${(isShown) ? '' : 'invisible'} ${isSearchOpen ? 'is-open' : ''}`}>
                <input
                    ref={this.ref}
                    type="search"
                    className={isAtBoxDetails ? '' : "name-filter"}
                    name="name"
                    autoComplete="off"
                    value={filter}
                    onChange={(ev) => this.props.setFilter(ev.target.value)}
                    placeholder={isAtBoxDetails ? 'Search in playlist' : 'Search for a Box'} />
                <SearchIcon className="search-icon" onClick={this.toggleSearch} />
            </div>
        )
    }
}

const mapStateToProps = state => ({ filter: state.boxReducer.filter });
const mapDispatchToProps = { setFilter };
export const BoxFilter = connect(mapStateToProps, mapDispatchToProps)(withRouter(_BoxFilter))