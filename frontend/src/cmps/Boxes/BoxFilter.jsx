import React, { Component } from 'react'
import SearchIcon from '@material-ui/icons/Search';

export class BoxFilter extends Component {
    state = {
        name: '',
    }

    onHandleChange = ({ target }) => {
        const field = target.name
        const value = target.value
        this.setState({ [field]: value }, () => this.props.onSetFilter(this.state))
    }

    render() {
        const { name } = this.state;
        return (
            <div className="box-filter flex justify-center">
                <input type="search" className="name-filter" name="name" autoComplete="off" value={name} onChange={this.onHandleChange} placeholder="Search Box" />
            </div>
        )
    }
}