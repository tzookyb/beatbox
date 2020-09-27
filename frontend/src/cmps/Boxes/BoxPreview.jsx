import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import HeadsetIcon from '@material-ui/icons/Headset';
import IconButton from '@material-ui/core/IconButton';
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
                    <div className="flex space-between">
                        <h3 className="box-name">{box.name}</h3>
                        <div className={` "flex align-center justify-end  ${(connectedUsers.length > 0) ? 'heartbeat played' : ''} `}>
                            <HeadsetIcon />
                        </div>
                    </div>
                    {onDelete && <DeleteIcon onClick={(ev) => onDelete(ev, box._id)}/> }
                </div>
            </section >

        )
    }
}