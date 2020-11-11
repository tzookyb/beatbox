// OUTSOURCE IMPORTS
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input } from 'react-chat-elements'
import { Button } from 'react-chat-elements'
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { SystemMessage } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';


// LOCAL IMPORTS
import { socketService } from '../../services/socketService'
import { addMsg } from '../../store/actions/msgActions'

class _BoxChat extends Component {
    state = {
        msg: '',
        isTyping: false,
        typingStr: '',
    }

    typingTimeout;
    inputRef = React.createRef();
    chatRef = React.createRef();

    componentDidMount() {
        socketService.on('chat showTyping', this.onTyping);
    }

    componentWillUnmount() {
        socketService.off('chat showTyping', this.onTyping);
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        this.chatRef.current.scrollIntoView({ behavior: "smooth" });
    }

    onTyping = typingStr => {
        clearTimeout(this.typingTimeout);
        this.setState({ typingStr });
        this.typingTimeout = setTimeout(() => {
            this.setState({ typingStr: '' });
        }, 1500);
    }

    onHandleChange = (ev) => {
        if (!ev.target.value) return;
        const userName = this.props.user.username;
        const typingStr = userName + ' is typing...';
        socketService.emit('chat typing', typingStr);

        this.setState({ msg: ev.target.value });
    }

    sendMsg = () => {
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
    }

    getAvatars() {
        const { connectedUsers } = this.props;
        return connectedUsers.map(user => {
            return <Avatar key={user.id} src={user.imgUrl} />
        })
    }

    onKeyUp = (ev) => {
        if (ev.keyCode === 13) this.sendMsg();
    }

    formatMsgs(msg, user, idx) {
        const isSystemMsg = msg.id === 'system';
        if (isSystemMsg) {
            return <SystemMessage key={idx} text={msg.text} />
        } else {
            const isUserMsg = msg.id === user._id;
            const userClass = isUserMsg ? 'user-message' : 'other-user-message';
            const positionclass = isUserMsg ? 'flex-end' : '';
            const submitBy = isUserMsg ? 'you' : msg.submitBy;

            const date = new Date(msg.submitAt);
            const dateToString = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
            return (
                <div key={idx} className={`msg flex column ${positionclass}`} >
                    <div className={`msg-data flex align-center`}>
                        {!positionclass && <Avatar title={user.username} alt="User" src={msg.avatar} style={{ width: '20px', height: '20px' }} />}
                        <p className="submit-by">{submitBy}</p>
                        {dateToString}
                    </div>
                    <div className={`msg-text ${userClass}`}>
                        {msg.text}
                    </div>
                </div>
            )
        }
    }

    render() {
        var { msgs, user } = this.props;
        const { typingStr } = this.state;
        const connectedUsersAvatars = this.getAvatars();
        msgs = msgs.map((msg, idx) => this.formatMsgs(msg, user, idx))

        return (
            <section className="wall-container flex column space-between">
                <h2 className="chat-title">Box Wall</h2>

                <div className="flex justify-center">
                    <AvatarGroup max={4}>
                        {connectedUsersAvatars}
                    </AvatarGroup >
                </div>

                <div className="msgs">
                    {msgs}
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

const mapStateToProps = state => ({
    user: state.userReducer.loggedinUser,
    msgs: state.msgReducer.msgs,
    connectedUsers: state.userReducer.connectedUsers
})
const mapDispatchToProps = {
    addMsg
}
export const BoxChat = connect(mapStateToProps, mapDispatchToProps)(_BoxChat)