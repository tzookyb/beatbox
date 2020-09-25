// OUTSOURCE IMPORT
import React, { Component } from 'react'
import { connect } from 'react-redux'
import CircleLoading from 'react-loadingg/lib/CircleLoading'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import FavoriteIcon from '@material-ui/icons/Favorite';
import WhatsappIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';
import LinkIcon from '@material-ui/icons/Link';
import ColorThief from "colorthief";
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import { Swipeable } from "react-swipeable";

// LOCAL IMPORT
import { SongList } from '../cmps/box-details/SongList'
import { BoxInfo } from '../cmps/box-details/BoxInfo'
import { BoxWall } from '../cmps/box-details/BoxWall';
import { boxService } from '../services/boxService'
import { userService } from '../services/userService';
import { socketService } from '../services/socketService';
import { loadBox, updateBox, gotBoxUpdate } from '../store/actions/boxAction'
import { addMessage, loadMessages } from '../store/actions/messageAction'
import { setCurrSong } from '../store/actions/playerActions'
import { loadConnectedUsers, addConnectedUser } from '../store/actions/connectedUsersAction'

import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

class _BoxDetails extends Component {
    state = {
        isSongPickOpen: false,
        isDragging: false,
        messages: [],
        dominantColor: '',
        isMobileChatOpen: false,
        isClipboardToast: false
    }

    imgRef = React.createRef();

    async componentDidMount() {
        const boxId = this.props.match.params.boxId;
        const minimalUser = userService.getMinimalUser();
        await this.props.loadBox(boxId);
        // await boxService.addConnectedUser(boxId, minimalUser);
        // SOCKET SETUP
        socketService.setup();
        const boxInfo = {
            boxId: this.props.currBox._id,
            user: minimalUser
        }
        socketService.emit('join box', boxInfo);
        socketService.on('get box status', this.setBoxStatus);
        socketService.on('song changed', this.props.setCurrSong);
        socketService.on('box changed', this.props.gotBoxUpdate);
        socketService.on('chat addMsg', this.props.addMessage);
        socketService.on('joined new box', this.props.loadConnectedUsers);
    }

    componentWillUnmount() {
        socketService.off('chat addMsg', this.props.addMessage);
    }

    setBoxStatus = (boxStatus) => {
        this.props.setCurrSong(boxStatus.currSong);
        this.props.loadMessages(boxStatus.msgs);
        // this.props.loadConnectedUsers(boxStatus.connectedUsers);
        // console.log("setBoxStatus -> boxStatus.connectedUsers", boxStatus.connectedUsers)
        // console.log(this.props.connectedUsers);
    }

    onRemoveSong = (ev, songId) => {
        if (ev) {
            ev.stopPropagation();
            ev.preventDefault();
        }

        const box = { ...this.props.currBox }
        const songIdx = box.songs.findIndex(song => song.id === songId)
        if (box.currSong.id === songId) {
            if (box.songs.length === 1) {
                box.currSong = null;
            } else {
                let nextSongIdx = songIdx + 1;
                if (nextSongIdx === box.songs.length) nextSongIdx = 0;
                box.currSong = { id: box.songs[nextSongIdx].id, isPlaying: true, played: 0 }
            }
        }
        const song = box.songs.splice(songIdx, 1);
        this.addMessageChat(`Song ${song[0].title} removed by ${this.props.user.username}`);
        this.props.updateBox(box)
    }

    onAddSong = async (song) => {
        const newSong = await boxService.addSong(song);
        const box = { ...this.props.currBox };
        box.songs.push(newSong);
        this.addMessageChat(`Song ${newSong.title} added by ${this.props.user.username}`);
        this.props.updateBox(box);
    }

    onPlaySong = (songId) => {
        const currSong = { id: songId, isPlaying: true, secPlayed: 0 };
        socketService.emit('set currSong', currSong);
        this.props.setCurrSong(currSong);
    }

    onSaveInfo = (box) => {
        this.props.updateBox(box);
    }

    getSongsForDisplay = () => {
        const songs = this.props.currBox.songs.filter(song => {
            return song.title.toLowerCase().includes(this.props.filter.toLowerCase());
        })
        return songs;
    }

    toggleSongPick = () => {
        this.setState(prevState => ({ isSongPickOpen: !prevState.isSongPickOpen }))
    }

    getIsUserLikeBox(box, minimalUser) {
        return (boxService.getIsUserLikeBox(box, minimalUser) !== -1) ? 'liked' : '';
    }

    onDragStart = () => {
        this.setState({ isDragging: true })
    }

    onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        this.setState({ isDragging: false })
        if (!destination) return;
        if (destination.droppableId === 'trash') {
            this.onRemoveSong(null, draggableId)
        }
        else if (destination.index === source.index) return;
        else this.onSwapSongs(source.index, destination.index);
    }

    addMessageChat = (msg) => {
        const messageObj = {
            text: msg,
            submitAt: new Date(),
            id: this.props.user._id,
            submitBy: this.props.user.username,
            avatar: this.props.user.imgUrl,
            type: 'system'
        }
        socketService.emit('chat newMsg', messageObj);
    }

    onToggleLikeBox = async (boxId, minimalUser) => {
        await boxService.addLike(boxId, minimalUser)
        await this.props.loadBox(boxId);
    }

    onSwapSongs = (srcIdx, destIdx) => {
        const newSongs = [...this.props.currBox.songs];
        const [songToMove] = newSongs.splice(srcIdx, 1);
        newSongs.splice(destIdx, 0, songToMove)
        const newBox = { ...this.props.currBox, songs: newSongs }
        this.props.updateBox(newBox);
    }

    getDominantColor = () => {
        const colorThief = new ColorThief();
        const img = this.imgRef.current;
        let result = colorThief.getColor(img, 50)
        if (result.every(color => color > 180)) result = result.map(color => (color > 150) ? 150 : color);
        this.setState({ dominantColor: result })
    }
    // getUsersAvatars(connectedUsers) {
    //     const avatars = connectedUsers.map(user => {
    //         return <Avatar alt={user.name} title={user.name} key={user.id} src={user.imgUrl} style={{ width: '30px', height: '30px', border:"black"}} />
    //     })
    //     return avatars;
    // }
    toggleClipboardToast = () => {
        this.setState({ isClipboardToast: true })
        setTimeout(() => this.setState({ isClipboardToast: false }), 2000);
    }

    toggleMobileMenu = () => {
        this.setState({ isMobileChatOpen: !this.state.isMobileChatOpen })
    }

    render() {
        const { isSongPickOpen, isDragging, } = this.state;
        const { currBox, messages, filter } = this.props;
        if (!currBox) return <CircleLoading size="large" color="#ac0aff" />
        const currSongId = currBox.currSong?.id || null;
        const songsToShow = this.getSongsForDisplay();
        const minimalUser = userService.getMinimalUser();
        const swipeConfig = {
            onSwipedRight: () => this.toggleMobileMenu(),
            onSwipedLeft: () => this.toggleMobileMenu(),
            preventDefaultTouchmoveEvent: true,
            trackMouse: true
        };

        console.log("render -> songsToShow", songsToShow)
        return (
            <Swipeable {...swipeConfig}>
                <section className="box-details" style={{ backgroundColor: `rgb(${this.state.dominantColor})` }}>
                    <div className="box-details-main flex column">
                        <BoxInfo getDominantColor={this.getDominantColor} imgRef={this.imgRef} box={currBox} onSaveInfo={this.onSaveInfo} minimalUser={minimalUser} onToggleLikeBox={this.onToggleLikeBox} />
                        <div className="song-social-actions flex space-between">
                            <div className="btns-container flex">
                                <Fab className={`add-song-btn  ${isSongPickOpen ? 'opened' : ''}`} onClick={this.toggleSongPick} aria-label="add">
                                    <AddIcon />
                                </Fab>
                                <div onClick={() => this.onToggleLikeBox(currBox._id, minimalUser)} className={`like-btn ${this.getIsUserLikeBox(currBox, minimalUser)}`}>
                                    {/* {currBox.likedByUsers.length} */}
                                    <FavoriteIcon />
                                </div>
                            </div>
                        </div>
                        <div className="share-container flex space-between column">
                            <p>Share the box:</p>
                            <div className="share-btns flex space-evenely">
                                <a className="facebook-share-btn" href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} rel="noopener noreferrer" target="_blank"><FacebookIcon /></a>
                                <a className="whatsapp-share-btn" href={`whatsapp://send?text=${currBox.createdBy.name} Shared a Box With You! : \n\n ${window.location.href}`} data-action="share/whatsapp/share"><WhatsappIcon /></a>
                                <CopyToClipboard text={window.location.href}>
                                    <LinkIcon onClick={this.toggleClipboardToast} style={{ transform: 'rotate(45deg) translateY(1px) translateX(4px)' }} />
                                </CopyToClipboard>
                            </div>
                            {this.state.isClipboardToast && <div className="copied-to-clipboard"><small>Copied to Clipboard!</small></div>}
                        </div>
                        <SongList
                            songs={songsToShow}
                            onPlaySong={this.onPlaySong}
                            onRemoveSong={this.onRemoveSong}
                            onAddSong={this.onAddSong}
                            isSongPickOpen={isSongPickOpen}
                            nowPlayingId={currSongId}
                            onDragStart={this.onDragStart}
                            onDragEnd={this.onDragEnd}
                            isFilter={!!filter}
                            isDragging={isDragging}
                        />

                    </div>

                    <div className={`${this.state.isMobileChatOpen ? 'chat-open' : ''} chat-box flex column`} >
                        <BoxWall messages={messages} addMsg={this.addMsg} connectedUsers={this.props.connectedUsers} />
                    </div>

                    <button className={`${this.state.isMobileChatOpen ? 'chat-open' : ''} mobile-chat-btn`} onClick={this.toggleMobileMenu}><QuestionAnswerIcon /></button>
                    {/* <BoxWall messages={messages} addMsg={this.addMsg} /> */}
                </section>
            </Swipeable>
        )
    }
}

{/* <AvatarGroup className="connected-users" max={4}>
                        {this.getUsersAvatars(this.props.connectedUsers)}
                    </AvatarGroup> */}

const mapStateToProps = state => {
    return {
        currBox: state.boxReducer.currBox,
        filter: state.boxReducer.filter,
        user: state.userReducer.loggedinUser,
        messages: state.messageReducer.messages,
        connectedUsers: state.connectedUsersReducer.connectedUsers
    }
}
const mapDispatchToProps = {
    loadBox,
    updateBox,
    addMessage,
    loadMessages,
    setCurrSong,
    gotBoxUpdate,
    addConnectedUser,
    loadConnectedUsers
}
export const BoxDetails = connect(mapStateToProps, mapDispatchToProps)(_BoxDetails);