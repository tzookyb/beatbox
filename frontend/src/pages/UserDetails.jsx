// OUTSOURCE IMPORT
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CircleLoading } from 'react-loadingg';
// LOCAL IMPORTS
import { userService } from '../services/userService'
import { BoxList } from '../cmps/boxes/BoxList'
import { removeBox } from '../store/actions/boxActions'
import { loadUser } from '../store/actions/userActions';

class _UserDetails extends Component {

    onDelete = async (ev, boxId) => {
        ev.stopPropagation();
        await userService.removeBoxFromUser(boxId);
        this.props.loadUser();
        this.props.removeBox(boxId);
    }

    getBoxes = (boxesIds) => {
        return boxesIds.map(boxId => {
            return this.props.boxes.find(box => box._id === boxId)
        })
    }

    render() {
        const { loggedinUser, boxes } = this.props;
        if (!loggedinUser || !boxes) return <CircleLoading size="large" color="#ac0aff" />

        if (loggedinUser.isGuest) this.props.history.push(`/`);

        let { createdBoxes, favoriteBoxes } = loggedinUser;
        createdBoxes = this.getBoxes(createdBoxes);
        favoriteBoxes = this.getBoxes(favoriteBoxes);

        return (
            <div className="user-details">
                <div className="user-info">
                    <img className="img-user" src={loggedinUser.imgUrl} alt="user" />
                    <h2>{loggedinUser.username}</h2>
                </div>

                <div className="user-boxes">
                    <h2>Boxes I created: </h2>
                    <BoxList
                        boxes={createdBoxes}
                        onDelete={this.onDelete}
                    />
                </div>

                <div className="user-boxes-favorite">
                    <h2>My Favorite Boxes: </h2>
                    <BoxList
                        boxes={favoriteBoxes}
                    />
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    loggedinUser: state.userReducer.loggedinUser,
    boxes: state.boxReducer.boxes
});
const mapDispatchToProps = {
    removeBox,
    loadUser
};
export const UserDetails = connect(mapStateToProps, mapDispatchToProps)(_UserDetails);