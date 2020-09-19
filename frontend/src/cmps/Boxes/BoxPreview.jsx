import React from 'react'
import { Link } from 'react-router-dom'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
// import AddIcon from '@material-ui/icons/Add';
import { boxService } from "../../services/boxService";

import equalizer from '../../assets/img/equalizer5.gif';

// import ThumbUpIcon from '@material-ui/icons/ThumbUp';

export function BoxPreview({ box, genre, isHomePage, onToggleLikeBox, minimalUser, onAddToFavorites }) {
    function getIsUserLikeBox() {
        // const idx = boxService.getIsUserLikeBox(box, minimalUser);
        return (boxService.getIsUserLikeBox(box, minimalUser) !== -1) ? 'liked' : '';
    }
    return (
        <div className={`box-preview ${isHomePage ? 'box-home-preview' : ''}`}>
            <Link to={`/box/${box._id}`} >
                <div className="box-preview-img"><img src={box.imgUrl} alt="box-preview img" /></div>
            </Link>
            <div className="box-preview-details flex align-center column space-between">
                <h3>{box.name}</h3>

                <div className="box-preview-action flex align-center space-evenely">
                    <div onClick={() => onToggleLikeBox(box._id)} className={`likes ${getIsUserLikeBox()}`}>
                        <ThumbUpAltIcon />
                        {box.likedByUsers.length}
                    </div>
                    <label>{box.viewCount}</label>
                    {/* <div onClick={() => onAddToFavorites(box._id)} className={`Favorites`}>
                        <AddIcon />
                    </div> */}
                </div>
            </div>
            {(box.connectedUsers.length > 0) &&
                <img className="active-box" src={equalizer} title="Someone is listening to this box!" alt="equalizer animation" />
            }
        </div >

    )
}