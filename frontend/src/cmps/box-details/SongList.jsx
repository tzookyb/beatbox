// OUTSOURCE IMPORTS
import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Delete } from '@material-ui/icons';

// LOCAL IMPORTS
import { SongPick } from './SongPick'
import { SongPreview } from './SongPreview'
import { SongPreviewExample } from './SongPreviewExample'

export function SongList({ songs, onRemoveSong, onAddSong, isSongPickOpen, isFilter, isDragging, onDragEnd, onDragStart }) {
    return (
        <React.Fragment>
            <DragDropContext
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                <div className="song-list flex space-between">

                    <Droppable droppableId={'songPick'}>
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={`song-pick-container ${isSongPickOpen && 'opened'}`}
                            >
                                <SongPick isSongPickOpen={isSongPickOpen} onAddSong={onAddSong} />
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    {/* {!songs.length && <ul className="clean-list flex column flex-1">
                    {example}
                </ul>} */}

                    <Droppable droppableId={'songList'}>
                        {(provided) => (
                            <ul
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={`clean-list flex column flex-1`}
                            >
                                {(!songs.length && !isFilter) && <React.Fragment>
                                    <SongPreviewExample key={1} isFirst={true} />
                                    <SongPreviewExample key={2} isFirst={false} />
                                </React.Fragment>}
                                {(!songs.length && isFilter) && <li>No search results...</li>}
                                {
                                    songs.map((song, index) => {
                                        return <SongPreview
                                            key={song.id}
                                            index={index}
                                            onRemoveSong={onRemoveSong}
                                            songDetails={song}
                                            isFilter={isFilter}
                                        />
                                    })
                                }
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </div>

                <Droppable droppableId={'trash'}>
                    {provided => (
                        <div
                            ref={provided.innerRef} {...provided.droppableProps}
                            className={`remove-song-drag flex ${isDragging ? 'opened' : ''}`}
                        >
                            <Delete className="bin" />
                            {/* {provided.placeholder} */}
                        </div>
                    )
                    }
                </Droppable>
            </DragDropContext >
        </React.Fragment>
    )
}