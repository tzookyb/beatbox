
import React from 'react'


// import { SongPreview } from './SongPreview'

export function SongList({ songs }) {
    return (
        <div className="song-list flex space-between">
            <ul className="clean-list flex column space-around flex-1">
                {songs.map(song => <li>{song.title}</li>)}
            </ul>
            {/* {songs.map(song => <SongPreview key={song._id} song={song} />)} */}
            <div className="songPick">songPick</div>
        </div>
    )
}