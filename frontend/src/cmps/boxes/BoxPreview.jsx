// OUTSOURCE IMPORTS
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import LazyLoad from 'react-lazy-load';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

export class BoxPreview extends Component {
    state = {
        isImgLoaded: false
    }

    onImgLoad = () => {
        this.setState({ isImgLoaded: true });
    }

    render() {
        const { box, isHomePage, onDelete } = this.props;
        const sectionClassName = `box-preview ${isHomePage ? 'box-home-preview' : ''}`;
        const imgClass = this.state.isImgLoaded ? '' : 'img-loading';
        return (
            <section className={sectionClassName} title={box.name}>
                <Link to={`/box/details/${box._id}`} >
                    <LazyLoad debounce={false} offsetVertical={100} offsetHorizontal={100}>
                        <div className="box-preview-img"> <img className={imgClass} src={box.imgUrl} onLoad={this.onImgLoad} alt="box-preview img" /></div>
                    </LazyLoad>
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