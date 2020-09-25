
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CircleLoading } from 'react-loadingg';

class _UserDetails extends Component {
    render() {
        const { user } = this.props;
        console.log("render -> user", user)
        if (!user) return <CircleLoading size="large" color="#ac0aff" />
        return (
            <div className="user-details">
                <img src={user.imgUrl} />
                <h2>{user.username}</h2>
                <div className="boxes-creator">

                </div>
                {/* <h2>Welcome {user.fullName}!</h2> */}
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

}

export const UserDetails = connect(mapStateToProps, mapDispatchToProps)(_UserDetails)