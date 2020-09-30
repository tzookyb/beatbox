// OUTSOURCE IMPORTS
import React from 'react'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

export function SongPreviewExample({ isFirst }) {
    let num = parseInt(Math.random() * 40 + 40)

    return (
        <li key={isFirst ? 1 : 2} className="song-preview flex space-between">
            < div className="song-data flex align-center" >
                <div className="play-icon-container flex align-center">
                    {isFirst ? <PauseIcon className="play-icon now-playing" /> :
                        <PlayArrowIcon className="play-icon" />}
                </div>
                <div className="song-preview-img"><img src={`https://picsum.photos/id/${num}/120/90`} alt="song-img" /></div>
                <h3 className={isFirst ? 'now-playing' : ''}>{isFirst ? `Your songs go here... Click '+' to add them` : 'This could be your song'}</h3>
            </div >
            <div className="song-preview-btns flex align-center">
                <h3 className="song-duration">{isFirst ? '3:22' : '4:15'}</h3>
                {<img className={`playing-anim ${isFirst ? '' : 'invisible'}`} src={require('../../assets/img/equalizer5.gif')} title="Now playing" alt="now-playing" />}
                <div><MoreVertIcon /></div>
            </div>
        </li >
    )
}