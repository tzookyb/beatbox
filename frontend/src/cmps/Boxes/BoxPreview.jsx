
import React from 'react'
import { Link } from 'react-router-dom'



// import ThumbUpIcon from '@material-ui/icons/ThumbUp';

export function BoxPreview({ box, genre }) {



    return (
     
        <div className="box-preview">
            
            <Link to={`/box/${box._id}`} >
            <div className="box-preview-img"><img src={box.imgUrl} alt="box-preview img" /></div> 
            </Link>
            <div className="box-preview-details flex align-center column space-between">
                <h3>{box.name}</h3>
                <p><span role="img" aria-label="bbb">💜</span> {box.likedByUser.length}</p>
            </div>
        </div>
  
    )
}