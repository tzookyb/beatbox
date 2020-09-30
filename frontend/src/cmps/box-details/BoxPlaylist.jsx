// OUTSOURCE IMPORTS
import React from 'react';

// LOCAL IMPORTS
import { SongPreview } from './SongPreview'

export function BoxPlaylist({ songs }) {
    return (
        <div className="box-playlist">
            {songs.map(song => <SongPreview key={song._id} song={song} />)}
        </div>
    )
}