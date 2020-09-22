import { Button } from '@material-ui/core';
import React, { Component } from 'react'
import { MessageList } from 'react-chat-elements'
import { SystemMessage } from 'react-chat-elements'
import { Input } from 'react-chat-elements'

import 'react-chat-elements/dist/main.css';

export class BoxWall extends Component {




    // Clear text, e.g.:
    // For pure components, use inputRef instead of this.inputRef

    inputRef = React.createRef();
    // ...

// ...




render() {
    return (
        <div className="wall-container">
            <h2> Box Wall </h2>
            <div className="wall-content">

                <MessageList
                    className='message-list'
                    lockable={true}
                    toBottomHeight={'100%'}
                    dataSource={[
                        {
                            position: 'right',
                            type: 'text',
                            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                            date: new Date(),
                        },
                        {
                            position: 'left',
                            type: 'text',
                            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                            date: new Date(),
                        },
                        {
                            position: 'right',
                            type: 'text',
                            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                            date: new Date(),
                        },


                    ]} />
                <SystemMessage
                    text={'End of conversation'} />


                <Input
                    placeholder="Type here..."
                    multiline={true}
                    rightButtons={
                        <Button
                            color='white'
                            backgroundColor='black'
                            text='Send' />
                    } />

            </div>
        </div>
    )
}
}
