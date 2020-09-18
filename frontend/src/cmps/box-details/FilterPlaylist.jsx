import React, { Component } from 'react'

export class FilterPlaylist extends Component {
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
            <div className="box-filter">
                <input className="name-filter" name="name" autoComplete="off" value={name} onChange={this.onHandleChange} placeholder="Search Song" />
            </div>
        )
    }
}