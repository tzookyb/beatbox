// OUTSOURCE IMPORTS
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SearchIcon from '@material-ui/icons/Search';
// LOCAL IMPORTS
import { setFilter } from '../../store/actions/boxAction';
import { debounce } from '@material-ui/core';

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
        if (!this.state.isAtBoxDetails) {
            const query = new URLSearchParams(window.location.search);
            if (this.state.searchStr) query.set('name', this.state.searchStr);
            this.props.history.push(`/box?${query.toString()}`);
        } else this.props.setFilter(this.state.searchStr);
    }
    toggleSearch = () => {
        this.setState(prevState => ({ isSearchOpen: !prevState.isSearchOpen }), () => {
            if (this.state.isSearchOpen) this.ref.current.focus();
        });
    }

    render() {
        const { searchStr, isAtBoxDetails } = this.state;
        return (
            <div className={`box-filter flex ${(this.props.isShown) ? '' : 'invisible'} ${this.state.isSearchOpen ? 'is-open' : ''}`}>
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
const mapStateToProps = (state) => ({
})
const mapDispatchToProps = {
    setFilter
}
export const BoxFilter = connect(mapStateToProps, mapDispatchToProps)(withRouter(_BoxFilter))