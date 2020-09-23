import React from "react";

import { Input, Button } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { Emoji } from './Emoji'

import { socketService } from '../../services/socketService'

export class Chat extends React.Component {
  state = {
    msg: '',
    // topic: '',
    isTyping: false,
    typingStr: ''
  }

  componentDidMount() {
    console.log('lalalla');
    socketService.setup();
    socketService.emit('chat topic', this.props.box._id);
    console.log("Chat -> componentDidMount -> this.props.box._id", this.props.box._id)
    socketService.on('chat addMsg', this.addMsg);
    socketService.on('chat typing', this.onTyping);
  }

  componentWillUnmount() {
    socketService.off('chat addMsg', this.addMsg);
    socketService.off('chat typing', this.onTyping);
    socketService.terminate();
  }

  addMsg = msgObj => {
    console.log("Chat -> msgObj", msgObj)
    this.props.addmsg(msgObj);
    // this.setState(prevState => ({ msgs: [...prevState.msgs, newMsg] }));
  };

  onTyping = typingStr => {
    this.setState(({ typingStr: typingStr }))
  }

  sendmsg = (ev) => {
    ev.preventDefault();
    const { msg } = this.state;
    if (msg) {
      const msgObj = {
        text: msg,
        submitAt: new Date(),
        id: this.props.user._id,
        submitBy: this.props.user.username,
        avatar: this.props.user.imgUrl,
        type: 'chat'
      }
      this.props.addmsg(msgObj);
      socketService.emit('chat newMsg', msgObj);
      this.setState({ msg: '' })
    }
  };

  onEmojiChoose = (emoji) => {
    // this.setState({
    //   msg: this.state.msg + emoji
    // })
    this.props.setEmoji(emoji);
  }

  timeoutFunction = () => {
    this.setState({ isTyping: false });
    socketService.emit('chat typing', '');
  }
  
  onHandleChange = async (ev) => {
    // var timeout;
    // if (!this.state.isTyping) {
    //   clearTimeout(timeout);
    //   this.setState({ isTyping: true });
    //   const userName = this.props.user.username;
    //   const typingStr = userName + ' is typing...';
    //   socketService.emit('chat typing', typingStr);
    //   timeout = setTimeout(this.timeoutFunction, 1500);
    // } else {
    //   clearTimeout(timeout);
    //   timeout = setTimeout(this.timeoutFunction, 1500);
    // }

    const { name, value } = ev.target;
    await this.setState(prevState => {
      return {
        [name]: value
      }
    });
  }

  render() {
    return (
      <div className="chat">
        <form className="form-msg" onSubmit={this.sendmsg}>
          <div className="container-send-msg flex space-between">
            <input className="input-chat" placeholder="Write Messge" value={this.state.msg}
              name="msg" onChange={this.onHandleChange} autoComplete="off" />
            {/* <Input className="input-chat" placeholder="Write Messge" value={this.state.msg}
              name="msgInput" onChange={e => this.setState({ msg: e.target.value })} autoComplete="off" /> */}
            <Button type="primary" onClick={this.sendmsg} style={{ color: "white" }}>
              <SendIcon />
            </Button>
          </div>
        </form>
        <div className="reactions flex">
          <Emoji onEmojiChoose={this.onEmojiChoose} />
        </div>
      </div>
    )
  }
}
