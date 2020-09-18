
import React from 'react'
import { Link } from 'react-router-dom'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';

import { boxService } from "../../services/boxService";

// import ThumbUpIcon from '@material-ui/icons/ThumbUp';

export function BoxPreview({ box, genre, isHomePage, onToggleLikeBox, minimalUser }) {
    function getIsUserLikeBox() {
        const idx = boxService.getIsUserLikeBox(box, minimalUser);
        return (boxService.getIsUserLikeBox(box, minimalUser) !== -1) ? 'liked' : '';
    }
    return (
        <div className={`box-preview ${isHomePage ? 'box-home-preview' : ''}`}>
            <Link to={`/box/${box._id}`} >
                <div className="box-preview-img"><img src={box.imgUrl} alt="box-preview img" /></div>
            </Link>
            <div className="box-preview-details flex align-center column space-between">
                <h3>{box.name}</h3>
                <div onClick={() => onToggleLikeBox(box._id)} className={`likes ${getIsUserLikeBox()}`}>
                    <ThumbUpAltIcon />
                    {box.likedByUser.length}
                </div>
            </div>
        </div>

    )
}