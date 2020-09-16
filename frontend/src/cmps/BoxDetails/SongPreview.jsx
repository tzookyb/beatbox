import React, { Component } from 'react';

export function SongPreview({ song }) {
    return (
        <div className="song-preview flex">
            <img src={song.imgUrl.url} />
            <h3>{song.title}</h3>
        </div>
    )
}