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

    playIntro(ev) {
        ev.stopPropagation()
    }

    render() {
        const { box, onDelete, history, introIsTouchDevice } = this.props;
        const imgClass = this.state.isImgLoaded ? '' : 'img-loading';
        return (
            <section className='box-preview cursor-pointer' title={box.name} onClick={() => history.push(`/box/details/${box._id}`)}>
                <div className="box-preview-img">
                    <img
                        className={imgClass}
                        src={box.imgUrl}
                        loading="lazy"
                        onLoad={this.onImgLoad}
                        alt="box-preview img" />
                </div>

                <div className="box-data flex space-between align-center">
                    <h3 className="box-name">{box.name}</h3>
                    {introIsTouchDevice ? <PlayCircleOutlineIcon onClick={this.playIntro} /> :
                        <PlayCircleOutlineIcon />}
                </div>

                <div className="delete-btn cursor-pointer" title="Delete box">
                    {onDelete && <DeleteIcon onClick={(ev) => onDelete(ev, box._id)} />}
                </div>

            </section >
        )
    }
}

export const BoxPreview = withRouter(_BoxPreview);