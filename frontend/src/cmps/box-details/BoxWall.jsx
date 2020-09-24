import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Chat } from './Chat'
import { ChatBox } from './ChatBox';
import { addMessage, loadMessages } from '../../store/actions/messageAction'
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

class _BoxWall extends Component {
    state = {
        myEmoji: '',
        bottom: 55,
        opacity: 1,
        typingStr: '',
    }
    gInterval = null;

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
    setTyping = (typingStr) => {
        this.setState({ typingStr })
    }
    getUsersAvatars(connectedUsers) {
        const avatars = connectedUsers.map(user => {
            return <Avatar alt={user.name} title={user.name} key={user.id} src={user.imgUrl} style={{ width: '30px', height: '30px' }} />
        })
        return avatars;
    }

    render() {
        const { messages, user, box } = this.props;
        const { myEmoji, bottom, opacity, typingStr } = this.state;
        const isEmoji = (myEmoji === '') ? false : true;
        return (
            <section className="wall-container">
                <div className="chat-header">
                    <h2> Box Wall </h2>
                    <AvatarGroup className="connected-users" max={4}>
                        {this.getUsersAvatars(box.connectedUsers)}
                    </AvatarGroup>
                    <div className="typing-container">
                        {typingStr && <h3>{typingStr}</h3>}
                    </div>
                </div>
                <div className="wall-content">
                    <ChatBox messages={messages} user={user} />
                    {isEmoji && <div style={{ bottom: bottom + "px", opacity: opacity }} className="my-emoji flex column">
                        {myEmoji}
                        <label className="reaction-user-name">{this.props.user.username}</label>
                    </div>}
                    <Chat user={user} addMsg={this.props.addMsg} setEmoji={this.setEmoji} box={box} setTyping={this.setTyping} />
                </div>
            </section>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.userReducer.loggedinUser,
        messages: state.messageReducer.messages,
        box: state.boxReducer.currBox
    }
}
const mapDispatchToProps = {
    loadMessages,
    addMessage
}

export const BoxWall = connect(mapStateToProps, mapDispatchToProps)(_BoxWall)
