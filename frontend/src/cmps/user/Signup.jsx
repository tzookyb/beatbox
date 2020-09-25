import React from 'react';
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { signup, loadUser } from '../../store/actions/userAction'
import imgPlaceholder from '../../assets/img/img_placeholder.png';
import { cloudService } from '../../services/cloudService'

class _Signup extends React.Component {
    state = {
        user: {
            username: '',
            fullName: '',
            password: '',
            imgUrl: ''
        }
    }

    onChange = (ev) => {
        this.setState({ user: { ...this.state.user, [ev.target.name]: ev.target.value } })
    }

    async uploadImg(ev) {
        const imgUrl = await cloudService.uploadImg(ev)
        this.setState(prevState => {
            return {
                user: {
                    ...prevState.user,
                    imgUrl
                }
            }
        })
    }

    onSignup = (ev) => {
        ev.preventDefault();
        if (this.state.username === '') return;
        const { username, fullName, password, imgUrl } = this.state.user;
        const userCreds = { username, fullName, password, imgUrl };
        this.props.signup(userCreds);
        this.props.loadUser()
        this.props.handleClose();
    }


    render() {
        const { user } = this.state;
        return (
            <div className="signup">
                <form className="input-login flex column" onSubmit={this.onSignup}>
                    <TextField name="username" type="text" onChange={this.onChange} placeholder="User Name:" autoComplete="off" />
                    <TextField name="fullName" type="text" onChange={this.onChange} placeholder="Full Name" autoComplete="off" />
                    <TextField name="password" type="password" onChange={this.onChange} placeholder="Password" />

                    <div className="user-img">
                        <label className="upload-label" style={{ cursor: 'pointer' }} >
                            <input onChange={(ev) => this.uploadImg(ev)} type="file" hidden />
                            <div className="upload-user-img">
                                {user.imgUrl ? '' : 'Upload Image'}
                            </div>
                            <img src={user.imgUrl || imgPlaceholder} alt="user" />
                        </label>
                    </div>

                    <Button className="btn-log" onClick={this.onSignup}>Signup</Button>
                </form>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        user: state.userReducer.loggedinUser,
    }
}

const mapDispatchToProps = {
    // login,
    loadUser,
    signup
}

export const Signup = connect(mapStateToProps, mapDispatchToProps)(_Signup)