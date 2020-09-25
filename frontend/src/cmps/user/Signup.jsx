import React from 'react';
import { connect } from 'react-redux'
import { signup } from '../../store/actions/userAction'
import { cloudService } from '../../services/cloudService'
import imgPlaceholder from '../../assets/img/img_placeholder.png';

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

    onSignup = async (ev) => {
        ev.preventDefault();
        const { username, fullName, password, imgUrl } = this.state.user;
        if (!username || !fullName || !password) {
            return;
        }
        const userCreds = { username, fullName, password, imgUrl };
        await this.props.signup(userCreds);
        this.props.history.push('/');
        this.setState({ user: { username: '', fullName: '', password: '' } });
    }


    render() {
        const { user } = this.state;
        console.log("render -> user", user)
        return (
            <div className="login-page">
                <form className="input-login flex column" onSubmit={this.onSignup}>
                    <input name="username" type="text" onChange={this.onChange} placeholder="User Name:" autoComplete="off" />
                    <input name="fullName" type="text" onChange={this.onChange} placeholder="Full Name" autoComplete="off" />
                    <input name="password" type="password" onChange={this.onChange} placeholder="Password" />

                    <div className="box-img">
                        <label className="upload-label" style={{ cursor: 'pointer' }} >
                            <input onChange={(ev) => this.uploadImg(ev)} type="file" hidden />
                            <div className="upload-box-img">
                                Upload Image
                            </div>
                            <img src={user.imgUrl || imgPlaceholder} alt="user" />
                        </label>
                    </div>

                    <button className="btn-log" onClick={this.onSignup}>Login</button>
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
    signup
}

export const Signup = connect(mapStateToProps, mapDispatchToProps)(_Signup)