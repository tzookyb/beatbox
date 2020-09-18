
import React from 'react'
import { SongPick } from './SongPick'
import { SongPreview } from './SongPreview'
import { Fab } from '@material-ui/core';
import { AddCircleOutline } from '@material-ui/icons';


// import { SongPreview } from './SongPreview'

export function SongList({ songs, onRemoveSong, onAddSong, onPlaySong, isSearchOpen, openAddSearch }) {

    return (
        <div className="song-list flex space-between">
            <ul className="clean-list flex column flex-1">
                {songs.map((song, idx) => <SongPreview  key={idx} onPlaySong={()=>onPlaySong(idx)} onRemoveSong={onRemoveSong} song={song} />)}
            </ul>
            <Fab className="add-song-btn" onClick={() => openAddSearch()} color="primary" aria-label="add">
                    <AddCircleOutline />
                </Fab>
            <SongPick isSearchOpen={isSearchOpen} onAddSong={onAddSong} />
        </div>
    )
}