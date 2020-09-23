
import React, { Component } from 'react';
import socketService from '../../services/socketService';
import { connect } from 'react-redux'
import { Spin } from "antd";

// import { MessageBox } from 'react-chat-elements/native';

import { MessageBox } from "./MessageBox";

export class ChatBox extends Component {

    state={

    }
    renderMessages = () => {
        const { messages, user } = this.props;
        const MessageArray = [];
        messages.forEach((message, idx) => {
            MessageArray.push(
                <MessageBox className="message-box"
                    text={message.text}
                    avatar={message.avatar}
                    submitAt={message.submitAt}
                    submitBy={message.submitBy}
                    own={user._id === message.id}
                    type={message.type}
                    key= {idx}
                />
            );
        });
        return (
            <div style={{ padding: "0px", width: "100%", position:"relative" }}>
                {MessageArray.map(Message => Message)}
                
            </div>
        );
    };

    render() {
        const { messages } = this.props;
        return (
            <div>
                {messages ? <this.renderMessages /> : <Spin size="large" />}
               
                {/* {this.props.messages ? <this.renderMessages /> : <Spin size="large" />} */}
            </div>
        );
    }
}
