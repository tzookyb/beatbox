import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';

export class BoxPreview extends Component {
    render() {
        const { box, isHomePage, connectedUsers, onDelete } = this.props;
        return (
            <section className={`box-preview ${isHomePage ? 'box-home-preview' : ''}`}>
                <Link to={`/box/details/${box._id}`} >
                    <div className="box-preview-img"> <img src={box.imgUrl} alt="box-preview img" /></div>
                </Link>

                <div className="box-preview-details flex column">
                    <div className="box-data flex space-between column">
                        <h3 className="box-name">{box.name}</h3>
                        {/* <div className="creator flex align-end">
                            <small>
                                created by:
                        </small>
                            <Avatar alt="User" src={box.createdBy.imgUrl} style={{ width: '20px', height: '20px' }} />
                        </div> */}
                    </div>
                    <div className="delete-btn" title="Delete box">
                        {onDelete && <DeleteIcon onClick={(ev) => onDelete(ev, box._id)} />}
                    </div>
                </div>
            </section >
        )
    }
}

