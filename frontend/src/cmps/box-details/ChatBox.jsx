import React, { Component } from 'react';
import socketService from '../../services/socketService';
import { connect } from 'react-redux'

class _ChatBox extends Component {
    state = {
        msg: {
            from: 'Me',
            txt: ''
        },
        msgs: [],
        isTyping: false,
        typingStr: '',
    };

    componentDidMount() {
        const userName = this.props.user.username;
        this.setState({ msg: { from: userName, txt: '' } })
        socketService.setup();
        socketService.on('chat addMsg', this.addMsg);
        socketService.on('chat typing', this.onTyping);
    }

    componentWillUnmount() {
        socketService.off('chat addMsg', this.addMsg);
        socketService.off('chat typing', this.onTyping);
        socketService.terminate();
    }

    addMsg = newMsg => {
        this.setState(prevState => ({ msgs: [...prevState.msgs, newMsg] }));
    };

    onTyping = typingStr => {
        this.setState(({ typingStr: typingStr }))
    }

    sendMsg = ev => {
        ev.preventDefault();
        socketService.emit('chat newMsg', this.state.msg);
        const userName = this.props.user.username;
        this.setState({ msg: { from: userName, txt: '' } })
    };


    timeoutFunction = () => {
        this.setState({ isTyping: false });
        socketService.emit('chat typing', '');
    }

    msgHandleChange = async ev => {
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

        const { name, value } = ev.target;
        await this.setState(prevState => {
            return {
                msg: {
                    ...prevState.msg,
                    [name]: value,
                }
            };
        });
    };

    render() {
        return (
            <div className="chat">
                <h2> Chat Room</h2>
                <div className="typing-container">
                    {this.state.typingStr && <h3>{this.state.typingStr}</h3>}
                </div>
                <ul className="chat-msg clean-list">
                    {this.state.msgs.map((msg, idx) => (
                        <li key={idx}>{msg.from}: {msg.txt}</li>
                    ))}
                </ul>
                <form onSubmit={this.sendMsg}>
                    <input
                        autoComplete="off"
                        type="text"
                        value={this.state.msg.txt}
                        onChange={this.msgHandleChange}
                        name="txt"
                    />
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.userReducer.loggedinUser,
    }
}

const mapDispatchToProps = {

}

export const ChatBox = connect(mapStateToProps, mapDispatchToProps)(_ChatBox)
