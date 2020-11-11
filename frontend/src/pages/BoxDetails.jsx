// OUTSOURCE IMPORT
import React, { Component } from 'react'
import { connect } from 'react-redux'
import CircleLoading from 'react-loadingg/lib/CircleLoading'
import ColorThief from "colorthief";
import { Swipeable } from "react-swipeable";
// LOCAL IMPORT
import { youtubeService } from '../services/youtubeService';
import { boxService } from '../services/boxService'
import { userService } from '../services/userService';
import { socketService } from '../services/socketService';
import { SongList } from '../cmps/box-details/SongList'
import { BoxInfo } from '../cmps/box-details/BoxInfo'
import { BoxChat } from '../cmps/box-details/BoxChat'
import { loadBox, updateBox, gotBoxUpdate, setFilter } from '../store/actions/boxActions'
import { addMsg, notify } from '../store/actions/msgActions'
import { changeSong, updateLocalPlayer } from '../store/actions/playerActions'
import { loadConnectedUsers, toggleFavorite } from '../store/actions/userActions'
import { MidControls } from '../cmps/box-details/MidControls';

class _BoxDetails extends Component {
    state = {
        isSongPickOpen: false,
        isDragging: false,
        dominantColor: '',
        isMobileChatOpen: false,
        isGuestToast: false,
        isFavorite: false,
    }

    imgRef = React.createRef();

    async componentDidMount() {
        const boxId = this.props.match.params.boxId;
        await this.props.loadBox(boxId);
        this.getIsFavorite(boxId);

        // SOCKET JOIN TO BOX
        const miniUser = userService.getMiniUser();
        const boxInfo = {
            boxId,
            user: miniUser
        }
        socketService.emit('join box', boxInfo);
    }

    async componentDidUpdate() {
        if (this.props.match.params.boxId !== this.props.currBox?._id) {
            await this.props.loadBox(this.props.match.params.boxId);
        }
        if (this.props.filter && this.state.isSongPickOpen) this.toggleSongPick(false);
    }

    getIsFavorite = (boxId) => {
        const idx = this.props.user.favoriteBoxes?.findIndex(box => box === boxId)
        const isFavorite = (idx === -1) ? false : true;
        this.setState({ isFavorite });
    }

    onRemoveSong = (songId) => {
        const { currSong } = this.props;
        const newBox = { ...this.props.currBox }
        const songIdx = newBox.songs.findIndex(song => song.id === songId)
        if (!currSong || currSong.id === songId) {
            if (newBox.songs.length === 1) {
                this.props.updateLocalPlayer(null);
            } else if (currSong && currSong.isPlaying) {
                let nextSongIdx = songIdx + 1;
                if (nextSongIdx === newBox.songs.length) nextSongIdx = 0;
                this.props.changeSong(newBox.songs[nextSongIdx].id);
            }
        }
        const [song] = newBox.songs.splice(songIdx, 1);
        this.addMsgChat(`Song "${song.title}" removed by ${this.props.user.username}`);
        this.props.notify({ txt: `Song "${song.title}" removed`, type: 'red' });
        this.props.updateBox(newBox);
    }

    onAddSong = async (song, idx, isFromDrag) => {
        const newSong = await boxService.addSong(song, isFromDrag);
        const newBox = { ...this.props.currBox };
        if (idx) {
            newBox.songs.splice(idx, 0, newSong);
        }
        else newBox.songs.unshift(newSong);
        this.addMsgChat(`Song "${newSong.title}" added by ${this.props.user.username}`);
        this.props.notify({ txt: `Song "${newSong.title}" added`, type: 'green' });
        this.props.updateBox(newBox);
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

    toggleSongPick = (isManual) => {
        if (isManual) {
            if (this.props.filter) this.props.setFilter('');
            this.setState(prevState => ({ isSongPickOpen: !prevState.isSongPickOpen }));
        }
        else this.setState({ isSongPickOpen: false });
    }

    onDragStart = () => {
        this.setState({ isDragging: true })
    }

    onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        this.setState({ isDragging: false })
        if (!destination) return;
        if (destination.droppableId === 'songPick') return;
        if (source.droppableId === 'songList' && destination.droppableId === 'trash') {
            this.onRemoveSong(draggableId)
            return;
        }
        if (source.droppableId === 'songPick' && destination.droppableId === 'songList') {
            let song = await youtubeService.getSongById(draggableId);
            [song] = song.items;
            this.onAddSong(song, destination.index, true);
            return;
        }

        if (destination.index === source.index) return;
        else this.onSwapSongs(source.index, destination.index);
    }

    addMsgChat = (msg) => {
        const msgObj = {
            text: msg,
            id: 'system',
            submitBy: 'system',
            avatar: this.props.user.imgUrl,
        }
        socketService.emit('chat newMsg', msgObj);
    }

    onSwapSongs = (srcIdx, destIdx) => {
        const newSongs = [...this.props.currBox.songs];
        const [songToMove] = newSongs.splice(srcIdx, 1);
        newSongs.splice(destIdx, 0, songToMove);
        const newBox = { ...this.props.currBox, songs: newSongs };
        this.props.updateBox(newBox);
    }

    getDominantColor = () => {
        const colorThief = new ColorThief();
        const img = this.imgRef.current;
        let result = colorThief.getColor(img, 50);
        if (result.every(color => color > 180)) result = result.map(color => (color > 150) ? 150 : color);
        this.setState({ dominantColor: result });
    }

    toggleGuestFavoriteToast = () => {
        this.setState({ isGuestToast: true });
        setTimeout(() => this.setState({ isGuestToast: false }), 2000);
    }

    openMobileChat = () => {
        if (this.state.isDragging) return;
        this.setState({ isMobileChatOpen: true })
    }

    closeMobileChat = () => {
        this.setState({ isMobileChatOpen: false })
    }

    onToggleFavorite = () => {
        if (this.props.user.isGuest) {
            this.toggleGuestFavoriteToast();
            return;
        }
        const { isFavorite } = this.state;
        this.props.notify({
            txt: (isFavorite) ? 'Box removed from Favorites' : 'Box added to Favorites',
            type: (isFavorite) ? 'red' : 'green'
        });
        this.setState({ isFavorite: !isFavorite });

        const boxId = this.props.currBox._id;
        this.props.toggleFavorite(boxId);
    }

    render() {
        const { isSongPickOpen, isDragging, isFavorite, isGuestToast } = this.state;
        const { currBox, filter, user } = this.props;
        if (!currBox) return <CircleLoading size="large" color="#ac0aff" />
        const songsToShow = this.getSongsForDisplay();
        const swipeConfig = {
            onSwipedRight: () => this.openMobileChat(),
            onSwipedLeft: () => this.closeMobileChat(),
            preventDefaultTouchmoveEvent: true,
            trackMouse: true
        };

        return (
            <Swipeable {...swipeConfig}>
                <section className="box-details" style={{ backgroundColor: `rgb(${this.state.dominantColor})` }}>
                    <div className="box-details-main flex column">

                        <BoxInfo
                            getDominantColor={this.getDominantColor}
                            imgRef={this.imgRef}
                            box={currBox}
                            onSaveInfo={this.onSaveInfo}
                        />

                        <MidControls user={user}
                            isSongPickOpen={isSongPickOpen}
                            isFavorite={isFavorite}
                            isGuestToast={isGuestToast}
                            onToggleFavorite={this.onToggleFavorite}
                            toggleSongPick={this.toggleSongPick}
                        />

                        <SongList
                            songs={songsToShow}
                            onRemoveSong={this.onRemoveSong}
                            onAddSong={this.onAddSong}
                            isSongPickOpen={isSongPickOpen}
                            onDragStart={this.onDragStart}
                            onDragEnd={this.onDragEnd}
                            isFilter={!!filter}
                            isDragging={isDragging}
                        />
                    </div>

                    <div className={`chat-box flex column align-center ${this.state.isMobileChatOpen ? 'chat-open' : ''}`}>
                        <BoxChat />
                    </div>

                </section>
            </Swipeable>
        )
    }
}

const mapStateToProps = state => {
    return {
        currBox: state.boxReducer.currBox,
        currSong: state.boxReducer.currSong,
        filter: state.boxReducer.filter,
        user: state.userReducer.loggedinUser,
        connectedUsers: state.userReducer.connectedUsers
    }
}
const mapDispatchToProps = {
    loadBox,
    updateBox,
    addMsg,
    updateLocalPlayer,
    gotBoxUpdate,
    loadConnectedUsers,
    changeSong,
    notify,
    setFilter,
    toggleFavorite
}
export const BoxDetails = connect(mapStateToProps, mapDispatchToProps)(_BoxDetails);