import React from "react";

export class Emoji extends React.Component {

    onEmojiChoose = (emoji,ev) => {
        ev.stopPropagation();
        this.props.onEmojiChoose(emoji)
    }

    render() {
        return (
            <div className="emoji-container">
                <span role="img" aria-label="in-love" onClick={(ev) => this.onEmojiChoose('😍', ev)}>😍</span>
                <span role="img" aria-label="lol" onClick={(ev) => this.onEmojiChoose('😂', ev)}>😂</span>
                <span role="img" aria-label="wink" onClick={(ev) => this.onEmojiChoose('😉', ev)}>😉</span>
                <span role="img" aria-label="surprised" onClick={(ev) => this.onEmojiChoose('😳', ev)}>😳</span>
                <span role="img" aria-label="thumbs-up" onClick={(ev) => this.onEmojiChoose('👍', ev)}>👍</span>
                <span role="img" aria-label="clap" onClick={(ev) => this.onEmojiChoose('👏', ev)}>👏</span>
            </div>

        )
    }
}