import React from 'react'

import { Fab } from '@material-ui/core';
import { Droppable } from 'react-beautiful-dnd';
import { Delete } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';

import { SongPick } from './SongPick'
import { SongPreview } from './SongPreview'

export function SongList({ songs, onRemoveSong, onAddSong, onPlaySong, isSongPickOpen, toggleSongPick, nowPlayingId, isFilter, isDragging, isBoxAdd }) {
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
                                    onPlaySong={onPlaySong}
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

            <Droppable droppableId={'trash'}>
                {(provided) => (
                    <div className={`remove-song ${isDragging ? '' : 'hidden'}`}>
                        <Delete
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{ fontSize: '60px', color: 'white' }}
                        />
                    </div>
                )}
            </Droppable>

            <Fab className={`add-song-btn  ${isSongPickOpen ? 'opened' : ''}`} onClick={toggleSongPick} color="primary" aria-label="add">
                <AddIcon />
            </Fab>

            <SongPick isBoxAdd={isBoxAdd} isSongPickOpen={isSongPickOpen} onAddSong={onAddSong} />
        </div>
    )
}