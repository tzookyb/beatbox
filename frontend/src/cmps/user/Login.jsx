// OUTSOURCE IMPORTS
import React from 'react';
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
// LOCAL IMPORTS
import { login, loadUser } from '../../store/actions/userActions'
import { notify } from '../../store/actions/msgActions';

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
        const userCreds = this.state.user;
        try {
            await this.props.login(userCreds)
            this.props.handleClose();
            this.props.notify({ txt: 'Login Successful', type: 'green' })
            this.props.loadUser();
        } catch (error) {
            this.props.notify({ txt: 'Login Failed', type: 'red' })
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
                    <label>Password:</label>
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

const mapStateToProps = state => ({
    user: state.userReducer.loggedinUser,
})
const mapDispatchToProps = {
    login,
    loadUser,
    notify
}
export const Login = connect(mapStateToProps, mapDispatchToProps)(_Login)