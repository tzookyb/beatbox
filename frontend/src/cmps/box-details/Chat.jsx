import React from "react";
import Button from '@material-ui/core/Button';
import { Input } from '@material-ui/core';

export class Chat extends React.Component {
  state = {
    message: null
  };

  sendMessage = () => {
    const { message } = this.state;
    if (message) {
      const messageObj = {
        text: message,
        submitAt: new Date(),
        submitBy: this.props.user,
        avatar: this.props.user.imgUrl
      };
      this.props.sendMessage(messageObj);
    }
  };

  render() {
    return (
    <div>
          <Input name="messageInput" onChange={e => this.setState({ message: e.target.value })}/>
          <Button block type="primary" onClick={this.sendMessage}>
        Send
          </Button>
    </div>
    )
  }
}
