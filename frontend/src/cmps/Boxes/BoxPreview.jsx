import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import HeadsetIcon from '@material-ui/icons/Headset';

export class BoxPreview extends Component {

    render() {
        const { box, isHomePage } = this.props;
        return (
            <section className={`box-preview ${isHomePage ? 'box-home-preview' : ''}`}>
                <Link to={`/box/${box._id}`} >
                    <div className="box-preview-img"> <img src={box.imgUrl} alt="box-preview img" /></div>
                </Link>

                <div className="box-preview-details flex column">
                    <div className="flex space-between">
                        <h3 className="box-name">{box.name}</h3>
                        <div className={` "flex align-center justify-end  ${(box.connectedUsers.length > 0) ? 'heartbeat played' : ''} `}>
                            <HeadsetIcon />
                        </div>
                    </div>
                </div>
            </section >

        )
    }
}


// import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
// import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
// import VisibilityIcon from '@material-ui/icons/Visibility';
// import Avatar from '@material-ui/core/Avatar';
// import FavoriteIcon from '@material-ui/icons/Favorite';
// import HeadsetIcon from '@material-ui/icons/Headset';
// import { boxService } from "../../services/boxService";
// import equalizer from '../../assets/img/equalizer5.gif';
// // import ThumbUpIcon from '@material-ui/icons/ThumbUp';
// export class BoxPreview extends Component {
//     state = {
//         // isOver: false,
//         // count: 0,
//         // imgUrlOver: ''
//     }
//     // intervalImgs = null;
//     // componentDidMount() {
//     //     const { box } = this.props;
//     //     this.setState({ imgUrlOver: box.imgUrl, isOver: false })
//     // }
//     getIsUserLikeBox(box, minimalUser) {
//         return (boxService.getIsUserLikeBox(box, minimalUser) !== -1) ? 'liked' : '';
//     }
//     // startOver = (isHomePage) => {
//     //     clearInterval(this.intervalImgs);
//     //     const { box } = this.props;
//     //     this.setState({ isOver: false, imgUrlOver: box.imgUrl, count: 0 });
//     //     if (!isHomePage) return;
//     //     const { songs } = this.props.box;
//     //     if (!songs.length) return;
//     //     this.setState({ isOver: true });
//     //     var count = this.state.count;
//     //     this.intervalImgs = setInterval(() => {
//     //         count = (count >= songs.length - 1) ? 0 : count += 1;
//     //         this.setState({ imgUrlOver: songs[this.state.count].imgUrl, count });
//     //     }, 2000)
//     // }
//     // stopOver = () => {
//     //     clearInterval(this.intervalImgs);
//     //     this.intervalImgs = null;
//     //     const { box } = this.props;
//     //     this.setState({ isOver: false, imgUrlOver: box.imgUrl, count: 0 });
//     // }
//     render() {
//         const { box, isHomePage, onToggleLikeBox, minimalUser } = this.props;
//         // const { isOver } = this.state;
//         return (
//             <section className={`box-preview ${isHomePage ? 'box-home-preview' : ''}`}>
//                 <Link to={`/box/${box._id}`} >
//                     <div className="box-preview-img"> <img src={box.imgUrl} alt="box-preview img" /></div>
//                 </Link>
//                 <div className="box-preview-details flex space-between align-center">
//                     <div className="box-preview-data flex column space-between">
//                         <h3 className="box-name">{box.name}</h3>
//                         <Avatar alt="Remy Sharp" src={box.createdBy.imgUrl} style={{ width: '30px', height: '30px' }} />
//                     </div>
//                     <div className="box-preview-reaction flex column">
//                         <div onClick={() => onToggleLikeBox(box._id)} className={`likes flex align-center space-between ${this.getIsUserLikeBox(box, minimalUser)}`}>
//                             {box.likedByUsers.length}
//                             <FavoriteIcon />
//                         </div>
//                         <div className="flex align-center space-between">
//                             <label>{box.viewCount}</label>
//                             <HeadsetIcon />
//                         </div>
//                         {/* {(box.connectedUsers.length > 0) &&
//                             <img className="active-box" src={equalizer} title="Someone is listening to this box!" alt="equalizer animation" />
//                         } */}
//                     </div>
//                 </div>
//             </section >

//             // <div className={`box-preview ${isHomePage ? 'box-home-preview' : ''}`}>
//             //     <Link to={`/box/${box._id}`} >
//             //         {/* {!isOver && <div className="box-preview-img"> <img src={box.imgUrl} alt="box-preview img" /></div>} */}
//             //         <div className="box-preview-img"> <img src={box.imgUrl} alt="box-preview img" /></div>
//             //         {/* {isOver && <div className="box-preview-img fade"> <img className="fade-in" src={this.state.imgUrlOver} alt="box-preview img" /></div>} */}
//             //     </Link>
//             //     <div className="box-preview-details flex align-center column space-between">
//             //         <h3>{box.name}</h3>
//             //         <div className="box-preview-action flex align-center space-evenely">
//             //             <div onClick={() => onToggleLikeBox(box._id)} className={`likes ${this.getIsUserLikeBox(box, minimalUser)}`}>
//             //                 <ThumbUpAltIcon />
//             //                 {box.likedByUsers.length}
//             //             </div>{
//             //                 <div>
//             //                     <VisibilityIcon />
//             //                     <label>{box.viewCount}</label>
//             //                 </div>
//             //             }
//             //             {/* <div onClick={() => onAddToFavorites(box._id)} className={`Favorites`}>
//             //             <AddIcon />
//             //         </div> */}
//             //         </div>
//             //     </div>
//             //     <Avatar alt="Remy Sharp" src={box.createdBy.imgUrl}  style={{ width: '30px', height: '30px' }}/>
//             //     {(box.connectedUsers.length > 0) &&
//             //         <img className="active-box" src={equalizer} title="Someone is listening to this box!" alt="equalizer animation" />
//             //     }
//             // </div >
//         )
//     }
// }