import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { boxService } from "../../services/boxService";

import equalizer from '../../assets/img/equalizer5.gif';

// import ThumbUpIcon from '@material-ui/icons/ThumbUp';

export class BoxPreview extends Component {
    state = {
        isOver: false,
        count: 0,
        imgUrlOver: ''
    }

    interavlImgs = null;
    componentDidMount() {
        const { box } = this.props;
        this.setState({ imgUrlOver: box.imgUrl })
    }
    getIsUserLikeBox(box, minimalUser) {
        // const idx = boxService.getIsUserLikeBox(box, minimalUser);
        return (boxService.getIsUserLikeBox(box, minimalUser) !== -1) ? 'liked' : '';
    }

    startOver = () => {
        const { songs } = this.props.box;
        if(!songs.length) return;
        this.setState({ isOver: true });
        var count = this.state.count;
        this.interavlImgs = setInterval(() => {
            count = (count >= songs.length - 1) ? 0 : count += 1;
            this.setState({ imgUrlOver: songs[this.state.count].imgUrl, count });
        }, 1500)
    }

    stopOver = () => {
        this.setState({ isOver: false })
        clearInterval(this.interavlImgs);
        this.interavlImgs = null;
    }

    render() {
        const { box, genre, isHomePage, onToggleLikeBox, minimalUser, onAddToFavorites } = this.props;
        const { isOver } = this.state;

        // console.log("BoxPreview -> render -> src", src)
        return (
            <div onMouseOver={this.startOver} onMouseLeave={this.stopOver} className={`box-preview ${isHomePage ? 'box-home-preview' : ''}`}>
                <Link to={`/box/${box._id}`} >
                    {!isOver && <div className="box-preview-img"><img src={box.imgUrl} alt="box-preview img" /></div>}
                    {isOver && <div className="box-preview-img"><img src={this.state.imgUrlOver} alt="box-preview img" /></div>}
                </Link>
                <div className="box-preview-details flex align-center column space-between">
                    <h3>{box.name}</h3>

                    <div className="box-preview-action flex align-center space-evenely">
                        <div onClick={() => onToggleLikeBox(box._id)} className={`likes ${this.getIsUserLikeBox(box, minimalUser)}`}>
                            <ThumbUpAltIcon />
                            {box.likedByUsers.length}
                        </div>{
                            <div>
                                <VisibilityIcon />
                                <label>{box.viewCount}</label>
                            </div>
                        }
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
}
