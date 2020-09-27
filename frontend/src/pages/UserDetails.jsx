
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CircleLoading } from 'react-loadingg';

import { BoxList } from '../cmps/boxes/BoxList'
import { removeBox } from '../store/actions/boxAction'
import { userService } from '../services/userService'

class _UserDetails extends Component {

    state = {
        userBoxes: [],
        userBoxesFavorite: []
    }

    async componentDidMount() {
        const userBoxes = await userService.getUserBoxes(this.props.user._id);
        const userBoxesFavorite = await userService.getUserFavoriteBoxes(this.props.user._id);
        this.setState({ userBoxes, userBoxesFavorite })
    }

    onDelete = async (ev, boxId) => {
        ev.stopPropagation();
        this.props.removeBox(boxId);
        await userService.removeBoxFromUser(boxId);
        const userBoxes = await userService.getUserBoxes(this.props.user._id);
        this.setState({ userBoxes });
    }

    render() {
        const { user } = this.props;
        if (this.props.user.isGuest) return;
        const { userBoxes, userBoxesFavorite } = this.state;
        console.log("render -> userBoxesFavorite", userBoxesFavorite)
        const minimalUser = userService.getMinimalUser();
        if (!user) return <CircleLoading size="large" color="#ac0aff" />
        return (
            <div className="user-details">
                <div className="user-info">
                    <img className="img-user" src={user.imgUrl} alt="user" />
                    <h2>{user.username}</h2>
                </div>
                <div className="user-boxes">
                    <h2>My Boxes: </h2>
                    {userBoxes && <BoxList
                        boxes={userBoxes}
                        minimalUser={minimalUser}
                        connectedUsers={this.props.connectedUsers}
                        onDelete={this.onDelete}
                    />}
                </div>
                <div className="user-boxes-favorite">
                    <h2>My Favorite Boxes: </h2>
                    {userBoxesFavorite && <BoxList
                        boxes={userBoxesFavorite}
                        minimalUser={minimalUser}
                        connectedUsers={this.props.connectedUsers}
                    />}
                </div>
                {/* <h2>Welcome {user.fullName}!</h2> */}
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        user: state.userReducer.loggedinUser,
        connectedUsers: state.connectedUsersReducer.connectedUsers
    }
}

const mapDispatchToProps = {
    removeBox
}


export const UserDetails = connect(mapStateToProps, mapDispatchToProps)(_UserDetails)