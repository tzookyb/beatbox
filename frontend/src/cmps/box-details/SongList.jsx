// OUTSOURCE IMPORTS
import React from 'react'
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Delete } from '@material-ui/icons';
// LOCAL IMPORTS
import { SongPick } from './SongPick'
import { SongPreview } from './SongPreview'
import { SongPreviewExample } from './SongPreviewExample'
import { setFilter } from '../../store/actions/boxActions';
import { NoResults } from '../NoResults';

export function _SongList(props) {
    const { songs, onRemoveSong, onAddSong, isSongPickOpen, isFilter, isDragging, onDragEnd, onDragStart, isTouch } = props;

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
                                className={`song-pick-container ${isSongPickOpen ? 'opened' : ''}`}
                            >
                                <SongPick isSongPickOpen={isSongPickOpen} onAddSong={onAddSong} />
                            </div>
                        )}
                    </Droppable>

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

                                {(!songs.length && isFilter) && <NoResults />}

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
                            className={`remove-song-drag flex ${isDragging ? 'opened' : ''} ${isTouch ? 'hidden' : ''}`}
                        >
                            <Delete className="bin" />
                        </div>
                    )
                    }
                </Droppable>
            </DragDropContext >
        </React.Fragment >
    )
}
const mapStateToProps = state => ({ isTouch: state.boxReducer.isTouch });
const mapDispatchToProps = { setFilter };
export const SongList = connect(mapStateToProps, mapDispatchToProps)(_SongList);