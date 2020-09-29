import React from 'react'

export function EmojiSelector({ sendEmoji }) {
    var emojis = [];
    for (var i = 0; i < 12; i++) {
        emojis.push(<img key={i} onClick={() => sendEmoji(i)} className="emoji-icon" src={require(`../assets/img/emojis/${i}.png`)} />)
    }
    return (
        <div className="emoji-selector">
            {emojis}
        </div>
    )
}