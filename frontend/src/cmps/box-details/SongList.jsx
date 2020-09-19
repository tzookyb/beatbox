import React from 'react'
import { Fab } from '@material-ui/core';
import { AddCircleOutline } from '@material-ui/icons';

import { SongPick } from './SongPick'
import { SongPreview } from './SongPreview'

// import { SongPreview } from './SongPreview'

export function SongList({ songs, onRemoveSong, onAddSong, onPlaySong, isSearchOpen, openAddSearch, nowPlayingId }) {

    return (
        <div className="song-list flex space-between">
            <ul className="clean-list flex column flex-1">
                {songs.map((song, idx) => {
                    return <SongPreview
                        key={idx}
                        onPlaySong={() => onPlaySong(idx)}
                        onRemoveSong={onRemoveSong}
                        nowPlayingId={nowPlayingId}
                        song={song} />
                })
                }
            </ul>
            <Fab className="add-song-btn" onClick={() => openAddSearch()} color="primary" aria-label="add">
                <AddCircleOutline />
            </Fab>
            <SongPick isSearchOpen={isSearchOpen} onAddSong={onAddSong} />
        </div>
    )
}