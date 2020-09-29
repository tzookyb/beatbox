// OUTSOURCE IMPORTS
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Draggable } from 'react-beautiful-dnd';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
// LOCAL IMPORTS
import { changeSong, togglePlay } from '../../store/actions/playerActions';

export class _SongPreview extends Component {
    state = {
        isRemoveOpen: false,
        timeoutId: null,
    }
    toggleRemoveOpen = (ev) => {
        ev.stopPropagation();
        const timeoutId = setTimeout(() => this.setState({ isRemoveOpen: false }), 2000);
        this.setState(prevState => ({ isRemoveOpen: !prevState.isRemoveOpen, timeoutId }));
    }

    remove = (ev, songId) => {
        clearTimeout(this.state.timeoutId);
        ev.stopPropagation();
        this.props.onRemoveSong(songId);
    }

    render() {
        const { currSong, songDetails, index, isFilter, togglePlay } = this.props;
        const { isRemoveOpen } = this.state;
        const isSongPlaying = (songDetails.id === currSong?.id) && currSong?.isPlaying;
        return (
            <Draggable draggableId={songDetails.id} index={index} isDragDisabled={isFilter}>
                {provided => (
                    <li

                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}

                        className="song-preview flex space-between"
                        onDoubleClick={() => this.props.changeSong(songDetails.id)}
                    >

                        <div className="song-data flex align-center">
                            <div className="play-icon-container flex align-center cursor-pointer">
                                {isSongPlaying ?
                                    <PauseIcon
                                        onClick={() => togglePlay(currSong)}
                                        className={`play-icon ${isSongPlaying ? 'now-playing' : ''}`}
                                    /> :
                                    <PlayArrowIcon
                                        onClick={() => this.props.changeSong(songDetails.id)}
                                        className="play-icon"
                                    />
                                }
                            </div>
                            <div className="song-preview-img"><img src={songDetails.imgUrl} alt="song-img" /></div>
                            <h3 className={(isSongPlaying) ? 'now-playing' : ''}>{songDetails.title}</h3>
                        </div>
                        <div className="song-preview-btns flex align-center">
                            <h3 className="song-duration">{songDetails.duration || ''}</h3>
                            <img className={`playing-anim ${(isSongPlaying) ? '' : 'invisible'}`} src={require('../../assets/img/equalizer5.gif')} title="Now playing" alt="now-playing" />
                        {isRemoveOpen ?
                            <div
                                onClick={(ev) => this.remove(ev, songDetails.id)}
                                className={`remove-song-btn ${isRemoveOpen ? '' : 'invisible'}`}
                            >
                                <DeleteOutlineIcon />
                            </div> :

                            <div><MoreVertIcon className="cursor-pointer" onClick={this.toggleRemoveOpen} /></div>
                        }
                        </div>
                    </li>
        )
    }
            </Draggable>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currSong: state.boxReducer.currSong
    }
}
const mapDispatchToProps = {
    togglePlay,
    changeSong
}


export const SongPreview = connect(mapStateToProps, mapDispatchToProps)(_SongPreview);