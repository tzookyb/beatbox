import React from 'react'


import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Delete } from '@material-ui/icons';

import { SongPick } from './SongPick'
import { SongPreview } from './SongPreview'

export function SongList({ songs, onRemoveSong, onAddSong, onPlaySong, isSongPickOpen, toggleSongPick, nowPlayingId, isFilter, isDragging, isBoxAdd, onDragEnd, onDragStart }) {
    return (
        <div className="song-list flex space-between">
            <DragDropContext
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                <Droppable droppableId={'trash'}>
                    {provided => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className={`remove-song flex align-center justify-center ${isDragging ? '' : 'invisible'}`}>
                            <Delete style={{ fontSize: '60px', color: 'white' }} />
                            {/* {provided.placeholder} */}
                        </div>
                    )
                    }
                </Droppable>

                <Droppable droppableId={'songPick'}>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            <SongPick isBoxAdd={isBoxAdd} isSongPickOpen={isSongPickOpen} onAddSong={onAddSong} />
                            {/* {provided.placeholder} */}
                        </div>
                    )}
                </Droppable>

                <Droppable droppableId={'songList'}>
                    {(provided) => (
                        <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="clean-list flex column flex-1"
                        >
                            {songs.map((song, index) => {
                                return <SongPreview
                                    key={song.id}
                                    index={index}
                                    onPlaySong={onPlaySong}
                                    onRemoveSong={onRemoveSong}
                                    isPlaying={(nowPlayingId === song.id)}
                                    song={song}
                                    isFilter={isFilter}
                                />
                            })}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>

            </DragDropContext >
        </div >
    )
}