import React from 'react';
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';

import { login, loadUser } from '../../store/actions/userAction'

class _Login extends React.Component {
    state = {
        user: {
            username: '',
            password: ''
        }
    }

    onChange = (ev) => {
        this.setState({ user: { ...this.state.user, [ev.target.name]: ev.target.value } })
    }

    onLogin = async (ev) => {
        ev.preventDefault();
        if (this.state.username === '') return;
        const { username, password } = this.state.user
        const userCreds = { username, password };
        const user = await this.props.login(userCreds)
        if (user) {
            this.props.loadUser();
            this.props.handleClose();
        }
    }


    render() {
        return (
            <form className="user-add-form flex" onSubmit={this.onLogin}>
                <div className="inputs flex column">
                    <label>User Name:</label>
                    <input
                        autoFocus
                        name="username"
                        type="text"
                        onChange={this.onChange}
                        placeholder="Your Name"
                        autoComplete="off"
                    />
                    <label>password:</label>
                    <input
                        name="password"
                        type="password"
                        onChange={this.onChange}
                        placeholder="Password" />
                    <Button className="btn-log" onClick={this.onLogin}>Login</Button>
                </div>
            </form>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.userReducer.loggedinUser,
    }
}

const mapDispatchToProps = {
    login,
    loadUser
}

export const Login = connect(mapStateToProps, mapDispatchToProps)(_Login)