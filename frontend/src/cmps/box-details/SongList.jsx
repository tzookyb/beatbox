
import React from 'react'
import { SongPick } from './SongPick'
import { SongPreview } from './SongPreview'


// import { SongPreview } from './SongPreview'

export function SongList({ songs, onRemoveSong, onAddSong, onPlaySong }) {
    return (
        <div className="song-list flex space-between">
            <ul className="clean-list flex column space-between flex-1">
                {songs.map((song, idx) => <SongPreview key={idx} onPlaySong={()=>onPlaySong(idx)} onRemoveSong={onRemoveSong} song={song} />)}
            </ul>
            <SongPick onAddSong={onAddSong} />
        </div>
    )
}