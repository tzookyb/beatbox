import React, { Component } from 'react'
import { connect } from 'react-redux'
import { closeNotification } from '../store/actions/boxAction'

class _Notification extends Component {
    // state = {
    //     isShown: false,
    //     msg: '',
    // }
    // unsubscribe;

    componentDidUpdate() {
        // setTimeout(() => this.props.closeNotification() , 2000)
    }


    render() {
        const { isShown, msg } = this.props
        return (
            isShown && <div className={`notification-box`}>
                {/* <span onClick={() => this.setState({ isShown: false })}>X</span> */}
                <h2>{msg}</h2>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isShown: state.boxReducer.isNoticeShown,
        msg: state.boxReducer.msg
    }
}

const mapDispatchToProps = {
    closeNotification
}


export const Notification = connect(mapStateToProps, mapDispatchToProps)(_Notification)
