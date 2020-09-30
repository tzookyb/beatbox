import React, { Component } from 'react'
import { connect } from 'react-redux'

import { SystemMessage } from 'react-chat-elements'
import { Input } from 'react-chat-elements'
import { Button } from 'react-chat-elements'
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import 'react-chat-elements/dist/main.css';

import { socketService } from '../../services/socketService'
import { addMsg, loadMsgs } from '../../store/actions/msgAction'

class _BoxChat extends Component {
    state = {
        msgs: [],
        msg: '',
        isTyping: false,
        typingStr: '',
    }

    inputRef = React.createRef();
    chatRef = React.createRef();

    componentDidMount() {
        socketService.on('chat showTyping', this.onTyping);
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    componentWillUnmount() {
        socketService.off('chat showTyping', this.onTyping);
    }

    scrollToBottom = () => {
        this.chatRef.current.scrollIntoView({ behavior: "smooth" });
    }

    onTyping = typingStr => {
        this.setState({ typingStr })
    }

    onHandleChange = async (ev) => {
        var timeout;
        if (!this.state.isTyping) {
            clearTimeout(timeout);
            this.setState({ isTyping: true });
            const userName = this.props.user.username;
            const typingStr = userName + ' is typing...';
            socketService.emit('chat typing', typingStr);
            timeout = setTimeout(this.timeoutFunction, 1500);
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(this.timeoutFunction, 1500);
        }
        await this.setState({ msg: ev.target.value });
    }

    timeoutFunction = () => {
        this.setState({ isTyping: false });
        socketService.emit('chat typing', '');
    }

    sendMsg = (ev) => {
        const { msg } = this.state;
        if (msg) {
            const msgObj = {
                text: msg,
                submitAt: new Date(),
                id: this.props.user._id,
                submitBy: this.props.user.username,
                avatar: this.props.user.imgUrl,
            }
            socketService.emit('chat newMsg', msgObj);
        }
        this.setState({ msg: '' })
        this.inputRef.clear();
    };

    getMsgsArr() {
        const { msgs, user } = this.props;
        const msgsArr = [];
        msgs.forEach((msg, idx) => {
            let classUser;
            let classPosition = '';
            let title;
            if (msg.id === user._id) {
                title = 'you';
                classUser = 'user-message';
                classPosition = 'flex-end'
            } else {
                title = msg.submitBy;
                classUser = 'not-user-message';
            }
            const date = new Date(msg.submitAt);
            const dateToString = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
            if (msg.id === 'system') {
                msgsArr.push(<SystemMessage
                    key={msg.id} text={msg.text} />)
            }
            else {
                msgsArr.push(
                    <div key={idx} className={`msg flex column ${classPosition}`} >
                        <div className={`msg-data flex align-center`}>
                            {!classPosition && <Avatar title={user.fullName} alt="User" src={msg.avatar} style={{ width: '20px', height: '20px' }} />}
                            <p className="submit-by">{title}</p>
                            {dateToString}
                        </div>
                        <div className={`msg-text ${classUser}`}>
                            {msg.text}
                        </div>
                    </div>
                )
            }
        })
        return msgsArr;
    }


    getConnectedAvatars() {
        const { connectedUsers } = this.props;
        return connectedUsers.map(user => {
            return <Avatar key={user.id} alt={user.username} src={user.imgUrl} />
        })
    }

    onKeyUp = (ev) => {
        if (ev.key === 'Enter') this.sendMsg();
    }

    render() {
        const { typingStr } = this.state;
        const avatarsConnectedUser = this.getConnectedAvatars();
        return (
            <section className="wall-container flex column space-between">
                <h2 className="chat-title"> Box Wall </h2>
                <div className="connected-users flex justify-center">
                    < AvatarGroup max={4}>
                        {avatarsConnectedUser}
                    </AvatarGroup >
                </div>
                <div className="msgs">
                    {this.getMsgsArr()}
                    <div className="typing-container">
                        {typingStr && <h3>{typingStr}</h3>}
                    </div>
                    <div ref={this.chatRef}></div>
                </div>
                <div className="input-msg">
                    <Input
                        ref={el => (this.inputRef = el)}
                        onChange={this.onHandleChange}
                        placeholder="Type here..."
                        onKeyUp={this.onKeyUp}
                        rightButtons={
                            <Button
                            className="btn-send"
                                text='Send'
                                onClick={this.sendMsg}
                                backgroundColor='#18191a'
                            />
                        }
                    />
                </div>
            </section>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.userReducer.loggedinUser,
        msgs: state.msgReducer.msgs,
        box: state.boxReducer.currBox,
        connectedUsers: state.connectedUsersReducer.connectedUsers
    }
}
const mapDispatchToProps = {
    loadMsgs,
    addMsg
}

export const BoxChat = connect(mapStateToProps, mapDispatchToProps)(_BoxChat)
