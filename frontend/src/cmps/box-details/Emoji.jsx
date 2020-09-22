import React from "react";

export class Emoji extends React.Component {

    onEmojiChoose = (emoji,ev) => {
        ev.stopPropagation();
        this.props.onEmojiChoose(emoji)
    }

    render() {
        const { keep } = this.props
        return (
            <div className="emoji-container">
                <span onClick={(ev) => this.onEmojiChoose('😍', ev)}>😍</span>
                <span onClick={(ev) => this.onEmojiChoose('😂', ev)}>😂</span>
                <span onClick={(ev) => this.onEmojiChoose('😉', ev)}>😉</span>
                <span onClick={(ev) => this.onEmojiChoose('😳', ev)}>😳</span>
                <span onClick={(ev) => this.onEmojiChoose('👍', ev)}>👍</span>
                <span onClick={(ev) => this.onEmojiChoose('👏', ev)}>👏</span>
            </div>

        )
    }
}