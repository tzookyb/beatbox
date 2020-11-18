// OUTSOURCE IMPORTS
import React from 'react';
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
// LOCAL IMPORTS
import { cloudService } from '../../services/cloudService'
import { signup, loadUser } from '../../store/actions/userActions'
import imgPlaceholder from '../../assets/img/img_placeholder.png';
import { notify } from '../../store/actions/msgActions';
class _Signup extends React.Component {
    state = {
        user: {
            username: '',
            password: '',
            imgUrl: ''
        }
    }

    onChange = (ev) => {
        this.setState({ user: { ...this.state.user, [ev.target.name]: ev.target.value } })
    }

    async uploadImg(ev) {
        const img = await cloudService.uploadImg(ev);
        const imgUrl = cloudService.makeFaceThumb(img);
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
        const { username, password } = this.state.user;
        if (!username || username.length < 3) {
            this.props.notify({ txt: 'Username longer than 3 characters is required!', type: 'red' });
            return;
        }
        if (!password || password.length < 3) {
            this.props.notify({ txt: 'Password longer than 3 characters is required!', type: 'red' });
            return;
        }
        try {
            this.props.signup({ ...this.state.user });
            this.props.loadUser();
            this.props.handleClose();
            this.props.notify({ txt: 'Signup Successful', type: 'green' });
        } catch (error) {
            this.props.notify({ txt: 'Signup Failed', type: 'red' });
        }
    }

    render() {
        const { user } = this.state;
        return (
            <form className="user-add-form flex" onSubmit={this.onSignup}>
                <div className="inputs flex column">
                    <label htmlFor="username">User Name:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        autoFocus
                        onChange={this.onChange}
                        placeholder="User Name:"
                        autoComplete="off" />
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={this.onChange}
                        placeholder="Password" />

                    <Button className="btn-log" onClick={this.onSignup}>Signup</Button>
                </div>
                <div className="user-add-thumbnail">
                    <label className="upload-label" style={{ cursor: 'pointer' }} >
                        <input onChange={(ev) => this.uploadImg(ev)} type="file" hidden />
                        <div className="img-container">
                            <img src={user.imgUrl || imgPlaceholder} alt="box" />
                        </div>
                        <div>
                            {user.imgUrl ? '' : 'Upload Image'}
                        </div>
                    </label>
                </div>
            </form>
        )
    }

}

const mapStateToProps = state => ({
    user: state.userReducer.loggedinUser,
})
const mapDispatchToProps = {
    notify,
    loadUser,
    signup
}
export const Signup = connect(mapStateToProps, mapDispatchToProps)(_Signup)