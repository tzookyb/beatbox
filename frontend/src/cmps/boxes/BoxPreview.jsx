// OUTSOURCE IMPORTS
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import DeleteIcon from '@material-ui/icons/Delete';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

export class _BoxPreview extends Component {
    state = {
        isImgLoaded: false
    }

    onImgLoad = () => {
        this.setState({ isImgLoaded: true });
    }

    render() {
        const { box, isHomePage, onDelete, history } = this.props;
        const sectionClassName = `box-preview cursor-pointer ${isHomePage ? 'box-home-preview' : ''}`;
        const imgClass = this.state.isImgLoaded ? '' : 'img-loading';
        return (
            <section className={sectionClassName} title={box.name} onClick={() => history.push(`/box/details/${box._id}`)}>
                <div className="box-preview-img">
                    <img
                        className={imgClass}
                        src={box.imgUrl}
                        onLoad={this.onImgLoad}
                        alt="box-preview img" />
                </div>

                <div className="box-preview-details flex column">
                    <div className="box-data flex space-between">
                        <h3 className="box-name">{box.name}</h3>
                        <PlayCircleOutlineIcon />
                    </div>

                    <div className="delete-btn cursor-pointer" title="Delete box">
                        {onDelete && <DeleteIcon onClick={(ev) => onDelete(ev, box._id)} />}
                    </div>

                </div>
            </section >
        )
    }
}

export const BoxPreview = withRouter(_BoxPreview);