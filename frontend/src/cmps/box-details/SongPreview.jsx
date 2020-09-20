import React from 'react';
import { connect } from 'react-redux'
import { Draggable } from 'react-beautiful-dnd';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

// If the current playing song animation is nice, delete commented lines 5,15
// import equalizer from '../../assets/img/equalizer5.gif';

// function _SongPreview({ song, onRemoveSong, onPlaySong, nowPlayingId }) {
function _SongPreview({ currBox, song, onRemoveSong, onPlaySong, isPlaying, index, isFilter }) {
    return (
        <Draggable draggableId={song.id} index={index} isDragDisabled={isFilter}>
            {(provided) => (
                <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onPlaySong()}
                    className={`song-preview flex space-between ${(isPlaying && currBox.currSong.isPlaying) ? 'now-playing' : ''}`}
                >
                    <div className="song-data flex align-center">
                        <div className="song-preview-img"><img src={song.imgUrl.url} alt="song-img" /></div>
                        <h3>{song.title}</h3>
                    </div>
                    <div className="song-preview-btns flex align-center">
                        {/* {(nowPlayingId === song.id) && <img className="now-playing" src={equalizer} alt="now playing" title="Currently playing song" />} */}
                        <button onClick={(ev) => onRemoveSong(ev, song.id)} className="remove-song-btn"><DeleteOutlineIcon /></button>
                    </div>
                </li>
            )
            }
        </Draggable>
    )
}

const mapStateToProps = (state) => {
    return { currBox: state.boxReducer.currBox }
}

export const SongPreview = connect(mapStateToProps)(_SongPreview)