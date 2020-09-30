// OUTSOURCE IMPORT
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CircleLoading } from 'react-loadingg';

// LOCAL IMPORTS
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
        if (this.props.user.isGuest) {
            this.props.history.push(`/`);
        }
        if (!user) return <CircleLoading size="large" color="#ac0aff" />
        const { userBoxes, userBoxesFavorite } = this.state;
        const minimalUser = userService.getMinimalUser();
        return (
            <div className="user-details">
                <div className="user-info">
                    <img className="img-user" src={user.imgUrl} alt="user" />
                    <h2>{user.username}</h2>
                    <h2>{user.fullName}</h2>
                </div>
                {userBoxes && <div className="user-boxes">
                    <h2>Boxes I created: </h2>
                    <BoxList
                        boxes={userBoxes}
                        minimalUser={minimalUser}
                        connectedUsers={this.props.connectedUsers}
                        onDelete={this.onDelete}
                    />
                </div>}
                {userBoxesFavorite && <div className="user-boxes-favorite">
                    <h2>My Favorite Boxes: </h2>
                    <BoxList
                        boxes={userBoxesFavorite}
                        minimalUser={minimalUser}
                        connectedUsers={this.props.connectedUsers}
                    />
                </div>}
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