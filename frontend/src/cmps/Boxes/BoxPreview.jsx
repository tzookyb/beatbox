import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import DeleteIcon from '@material-ui/icons/Delete';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

export class BoxPreview extends Component {
    render() {
        const { box, isHomePage, onDelete } = this.props;
        return (
            <section className={`box-preview ${isHomePage ? 'box-home-preview' : ''}`}>
                <Link to={`/box/details/${box._id}`} >
                    <div className="box-preview-img"> <img src={box.imgUrl} alt="box-preview img" /></div>
                </Link>

                <div className="box-preview-details flex column">
                    <div className="box-data flex space-between">
                        <h3 className="box-name">{box.name}</h3>
                        <Link to={`/box/details/${box._id}`} >
                            <PlayCircleOutlineIcon />
                        </Link>
                    </div>
                    <div className="delete-btn" title="Delete box">
                        {onDelete && <DeleteIcon onClick={(ev) => onDelete(ev, box._id)} />}
                    </div>
                </div>
            </section >
        )
    }
}