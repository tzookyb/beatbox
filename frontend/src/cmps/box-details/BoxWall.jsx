import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Chat } from './Chat'
import { ChatBox } from './ChatBox';
import { addMessage, loadMessages } from '../../store/actions/messageAction'

class _BoxWall extends Component {
    state = {
        myEmoji: '',
        bottom: 55,
        opacity: 1
    }
    gInterval = null;
   
    componentDidMount() {
        const { box } = this.props;
        this.props.loadMessages(box._id);
    }

    addMessage = async (msg) => {
        const { box } = this.props;
        this.props.addMessage(box._id, msg)
        await this.props.loadMessages(box._id);
    }
    
    setEmoji = async (myEmoji) => {
        clearInterval(this.gInterval);
        await this.setState({ myEmoji });
        var pos = 0;
        var opacityDis = 0.05;
        this.gInterval = setInterval(() => {
            if (pos >= 60) {
                clearInterval(this.gInterval);
                this.setState({
                    myEmoji: '',
                    bottom: 50,
                    opacity: 1
                })
            } else {
                pos += 5;
                this.setState({ bottom: this.state.bottom + pos, opacity: this.state.opacity - opacityDis })
            }
        }, 300);
    }


    render() {
        const { messages, user } = this.props;
        const { myEmoji, bottom, opacity } = this.state;
        const isEmoji = (myEmoji === '') ? false : true;
        return (
            <div className="wall-container">
                <h2> Box Wall </h2>
                <div className="wall-content">
                    <ChatBox messages={messages} user={user} />
                    {isEmoji && <div style={{ bottom: bottom + "px", opacity: opacity }} class="my-emoji flex column">
                        {myEmoji}
                        <label className="reaction-user-name">{this.props.user.username}</label>
                    </div>}
                    <Chat user={user} addMessage={this.addMessage} setEmoji={this.setEmoji} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.userReducer.loggedinUser,
        messages: state.messageReducer.messages
    }
}
const mapDispatchToProps = {
    loadMessages,
    addMessage
}

export const BoxWall = connect(mapStateToProps, mapDispatchToProps)(_BoxWall)
