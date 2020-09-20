import React from 'react'
import { Fab } from '@material-ui/core';
import { Droppable } from 'react-beautiful-dnd';
import { AddCircleOutline } from '@material-ui/icons';

import { SongPick } from './SongPick'
import { SongPreview } from './SongPreview'

export function SongList({ songs, onRemoveSong, onAddSong, onPlaySong, isSongPickOpen, toggleSongPick, nowPlayingId, isFilter }) {
    return (
        <div className="song-list flex space-between">

                <Droppable droppableId={'songList'}>
                    {(provided) => {
                        return (
                            <ul
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="clean-list flex column flex-1"
                            >
                                {songs.map((song, idx) => {
                                    return <SongPreview
                                        key={song.id}
                                        index={idx}
                                        onPlaySong={() => onPlaySong(song.id)}
                                        onRemoveSong={onRemoveSong}
                                        isPlaying={(nowPlayingId === song.id)}
                                        song={song}
                                        isFilter={isFilter}
                                    />
                                })}
                                {provided.placeholder}
                            </ul>
                        )
                    }
                    }
                </Droppable>

            <Fab className="add-song-btn" onClick={toggleSongPick} color="primary" aria-label="add">
                <AddCircleOutline />
            </Fab>

            <SongPick isSongPickOpen={isSongPickOpen} onAddSong={onAddSong} />
        </div>
    )
}