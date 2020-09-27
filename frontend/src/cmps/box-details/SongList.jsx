// OUTSOURCE IMPORTS
import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Delete } from '@material-ui/icons';
// LOCAL IMPORTS
import { SongPick } from './SongPick'
import { SongPreview } from './SongPreview'

export function SongList({ songs, onRemoveSong, onAddSong, isSongPickOpen, isFilter, isDragging, isBoxAdd, onDragEnd, onDragStart }) {
    return (
        <div className="song-list flex space-between">
            <DragDropContext
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >

                <Droppable droppableId={'songPick'}>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`song-pick-container ${isSongPickOpen && 'opened'}`}
                        >
                            <SongPick isBoxAdd={isBoxAdd} isSongPickOpen={isSongPickOpen} onAddSong={onAddSong} />
                            {provided.placeholder}
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
                            {!songs.length && <li className="song-preview">This could be your song... click '+' to add songs</li>}
                            {
                                songs.map((song, index) => {
                                    return <SongPreview
                                        key={song.id}
                                        index={index}
                                        onRemoveSong={onRemoveSong}
                                        songDetails={song}
                                        isFilter={isFilter}
                                    />
                                })}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>

                <Droppable droppableId={'trash'}>
                    {provided => (
                        <div
                            ref={provided.innerRef} {...provided.droppableProps}
                            className={`remove-song ${isDragging ? 'opened' : ''}`}
                        >
                            <Delete className="bin" style={{ fontSize: '60px', color: 'white' }} />
                            {provided.placeholder}
                        </div>
                    )
                    }
                </Droppable>
            </DragDropContext >
        </div >
    )
}