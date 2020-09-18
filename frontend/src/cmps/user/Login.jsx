import React from 'react';
import { connect } from 'react-redux'
import { login, loadUser } from '../../store/actions/userAction'
import { cloudService } from '../../services/cloudService'

class _Login extends React.Component {
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
                    ...prevState.box,
                    imgUrl
                }
            }
        })
    }

    onLogin = (ev) => {
        ev.preventDefault();
        if (this.state.username === '') return;
        const { username, fullName, password, imgUrl } = this.state.user
        const userCreds = { username, fullName, password, imgUrl };;
        this.props.login(userCreds);
        this.props.loadUser()
        .then(()=> this.props.history.push('/'))
    }


    render() {
        const { user } = this.state;
        return (
            <div className="login-page">
                <form className="input-login" onSubmit={this.onLogin}>
                    <input name="username" type="text" onChange={this.onChange} placeholder="User Name:" autoComplete="off" />
                    <input name="fullName" type="text" onChange={this.onChange} placeholder="Full Name" autoComplete="off" />
                    <input name="password" type="password" onChange={this.onChange} placeholder="Password" />

                    <div className="box-img">
                        <label className="upload-label" style={{ cursor: 'pointer' }} >
                            <input onChange={(ev) => this.uploadImg(ev)} type="file" hidden />
                            <div className="upload-box-img">
                                Upload Image
                            </div>
                            <img src={user.imgUrl} alt="" />
                        </label>
                    </div>

                    <button className="btn-log" onClick={this.onLogin}>Login</button>
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
    login,
    loadUser
}

export const Login = connect(mapStateToProps, mapDispatchToProps)(_Login)
