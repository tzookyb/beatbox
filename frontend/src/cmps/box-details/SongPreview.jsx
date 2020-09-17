import React from 'react';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

export function SongPreview({ song, onRemoveSong, onPlaySong }) {
    return (
        <li onClick={() => onPlaySong()} className="song-preview flex space-between" >
            <div className="song-data flex align-center">
                <div className="song-preview-img"><img src={song.imgUrl.url} alt="song-img" /></div>
                <h3>{song.title}</h3>
            </div>
            <div className="song-preview-btns flex align-center">
                <button onClick={(ev) => onRemoveSong(ev, song.id)} className="remove-song-btn"><DeleteOutlineIcon /></button>
            </div>
        </li>
    )
}