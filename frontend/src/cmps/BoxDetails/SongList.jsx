
import React from 'react'
import { SongPick } from './SongPick'


// import { SongPreview } from './SongPreview'

export function SongList({ songs, onRemoveSong , onAddSong}) {
    return (
        <div className="song-list flex space-between">
            <ul className="clean-list flex column space-around flex-1">
                {songs.map(song =>
                    <li className="flex space-around" key={song.id}>
                        <h2>{song.title}</h2>
                        <button onClick={(ev) => onRemoveSong(ev, song.id)} className="remove-song-btn">X</button>
                    </li>
                )}

                {/* )} */}
            </ul>
            {/* {songs.map(song => <SongPreview key={song._id} song={song} />)} */}
            <SongPick  onAddSong={onAddSong}/>
            {/* <div className="songPick">songPick</div> */}
        </div>
    )
}