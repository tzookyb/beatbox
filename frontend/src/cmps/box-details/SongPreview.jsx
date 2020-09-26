import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Draggable } from 'react-beautiful-dnd';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import MoreVertIcon from '@material-ui/icons/MoreVert';
export class _SongPreview extends Component {
    state = {
        isRemoveOpen: false
    }
    toggleOpen = (ev) => {
        this.setState(prevState => ({ isRemoveOpen: !prevState.isRemoveOpen }));
        setTimeout(() => this.setState({ isRemoveOpen: false }), 2000);
    }
    render() {
        const { currBox, song, onRemoveSong, onPlaySong, isPlaying, index, isFilter } = this.props;
        const { isRemoveOpen } = this.state;
        return (
            <Draggable draggableId={song.id} index={index} isDragDisabled={isFilter}>
                {provided => (
                    <li

                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => onPlaySong(song.id)}
                        className="song-preview flex space-between"
                    >
                
                        <div className="song-data flex align-center">
                            <div className="song-preview-img"><img src={song.imgUrl} alt="song-img" /></div>
                            <h3 className={(isPlaying && currBox.currSong.isPlaying) ? 'now-playing' : ''}>{song.title}</h3>
                        </div>
                        <div className="song-preview-btns flex align-center">
                            {isPlaying && currBox.currSong.isPlaying && <img className='playing-anim' src={require('../../assets/img/equalizer5.gif')} title="Now playing" alt="now-playing" />}
                            <button onClick={(ev) => onRemoveSong(ev, song.id)} className={`remove-song-btn ${!isRemoveOpen && 'hidden'}`}><DeleteOutlineIcon /></button>
                            <h3 className="song-duration">{song.duration || ''}</h3>
                            <MoreVertIcon className="cursor-pointer" onClick={this.toggleOpen} />
                        </div>
                    </li>
                )
                }
            </Draggable>
        )
    }
}

const mapStateToProps = (state) => {
    return { currBox: state.boxReducer.currBox }
}

export const SongPreview = connect(mapStateToProps)(_SongPreview)


// function _SongPreview({ currBox, song, onRemoveSong, onPlaySong, isPlaying, index, isFilter }) {
//     return (
//         <Draggable draggableId={song.id} index={index} isDragDisabled={isFilter}>
//             {provided => (
//                 <li
//                     ref={provided.innerRef}
//                     {...provided.draggableProps}
//                     {...provided.dragHandleProps}
//                     onClick={() => onPlaySong(song.id)}
//                     className="song-preview flex space-between"
//                 >

//                     <div className="song-data flex align-center">
//                         <div className="song-preview-img"><img src={song.imgUrl} alt="song-img" /></div>
//                         <h3 className={(isPlaying && currBox.currSong.isPlaying) ? 'now-playing' : ''}>{song.title}</h3>
//                     </div>
//                     <div className="song-preview-btns flex align-center">
//                         {isPlaying && currBox.currSong.isPlaying && <img className='playing-anim' src={require('../../assets/img/equalizer5.gif')} title="Now playing" alt="now-playing" />}
//                         <div>
//                             <MoreVertIcon />
//                             <button onClick={(ev) => onRemoveSong(ev, song.id)} className="remove-song-btn"><DeleteOutlineIcon /></button>
//                         </div>
//                     </div>
//                 </li>
//             )
//             }
//         </Draggable>
//     )
// }

// const mapStateToProps = (state) => {
//     return { currBox: state.boxReducer.currBox }
// }

// export const SongPreview = connect(mapStateToProps)(_SongPreview)