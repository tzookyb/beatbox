// OUTSOURCE IMPORTS
import React from 'react';
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';

// LOCAL IMPORTS
import { signup, loadUser } from '../../store/actions/userAction'
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
        if (this.state.username === '') return;
        const { username, fullName, password, imgUrl } = this.state.user;
        const userCreds = { username, fullName, password, imgUrl };
        this.props.signup(userCreds);
        this.props.loadUser();
        this.props.handleClose();
    }


    render() {
        const { user } = this.state;
        return (
            <form className="user-add-form flex" onSubmit={this.onSignup}>
                <div className="inputs flex column">
                    <label>User Name:</label>
                    <input
                        autoFocus
                        required
                        name="username" type="text"
                        onChange={this.onChange}
                        placeholder="User Name:"
                        autoComplete="off" />
                    <label>Full Name:</label>
                    <input
                        required
                        name="fullName"
                        type="text"
                        onChange={this.onChange}
                        placeholder="Full Name"
                        autoComplete="off" />
                    <label>Password:</label>
                    <input
                        required
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

const mapStateToProps = state => {
    return {
        user: state.userReducer.loggedinUser,
    }
}

const mapDispatchToProps = {
    loadUser,
    signup
}

export const Signup = connect(mapStateToProps, mapDispatchToProps)(_Signup)