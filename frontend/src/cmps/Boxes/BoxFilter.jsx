import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import SearchIcon from '@material-ui/icons/Search';
import { setFilter } from '../../store/actions/boxAction';

export class _BoxFilter extends Component {
    state = {
        searchStr: '',
        isAtBoxDetails: false,
    }
    componentDidMount() {
        this.checkIfAtDetails();
    }

    componentDidUpdate(prevProps) {
        this.checkIfAtDetails();

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
    }

    onSetFilter = () => {
        let query;
        if (!this.state.isAtBoxDetails) {
            query = new URLSearchParams(window.location.search);
            if (this.state.searchStr) query.set('name', this.state.searchStr);
            this.props.history.push(`/box?${query.toString()}`);
        } else query = this.state.searchStr;
        this.props.setFilter(query);
    }

    render() {
        const { searchStr, isAtBoxDetails } = this.state;
        return (
            <div className={`${(this.props.isShown) ? '' : 'invisible'} flex box-filter justify-center`}>
                <input
                    type="search"
                    className={isAtBoxDetails ? '' : "name-filter"}
                    name="name"
                    autoComplete="off"
                    value={searchStr}
                    onChange={this.onHandleChange}
                    placeholder={isAtBoxDetails ? 'Search in playlist' : 'Search for Box'} />
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