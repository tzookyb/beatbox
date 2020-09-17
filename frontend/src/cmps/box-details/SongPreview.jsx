import React from 'react';

export function SongPreview({ song, onRemoveSong, onPlaySong }) {
    return (
        <li onClick={() => onPlaySong()} className="song-preview flex space-between" >
            <div className="song-data flex align-center">
                <div className="song-preview-img"><img src={song.imgUrl.url} alt="song-img" /></div>
                <h3>{song.title}</h3>
            </div>
            <div className="song-preview-btns flex align-center">
                <button onClick={() => onPlaySong()} className="play-song-btn">{'>'}</button>
                <button onClick={(ev) => onRemoveSong(ev, song.id)} className="remove-song-btn">X</button>
            </div>
        </li>
    )
}