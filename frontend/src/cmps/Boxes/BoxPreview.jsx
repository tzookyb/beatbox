
import React from 'react'
import { Link } from 'react-router-dom'

export function BoxPreview({ box, gener }) {
    return (
        <div className="box-preview">
            <Link to={`/box/${box._id}`} >
                <img src={box.imgUrl} />
            </Link>
            <div className="flex space-between">
                <h3>{box.name}</h3>
                <label>{gener}</label>
                <p>🖤 {box.likedByUser.length}</p>
            </div>
        </div>
    )
}