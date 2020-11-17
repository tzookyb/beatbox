import React from 'react';
import { connect } from 'react-redux'
import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player/youtube'
import { Avatar } from '@material-ui/core';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

import { BoxPreview } from './BoxPreview';
import { socketService } from '../../services/socketService';
import { setIsIntroPlaying } from '../../store/actions/playerActions';
import { notify } from '../../store/actions/msgActions';

export function _BoxActive(props) {

    useEffect(() => {
        socketService.on('got intro', onGotIntro);
        checkIfTouchDevice();
        return () => {
            socketService.off('got intro', onGotIntro);
            props.setIsIntroPlaying(false);
        }
        // eslint-disable-next-line
    }, [])

    const [boxes, setBoxes] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [introId, setIntroId] = useState(null);
    const [secPlayed, setSecPlayed] = useState(null);
    const [isTouchDevice, setIsTouchDevice] = useState(undefined);

    useEffect(() => {
        setBoxes(props.boxes);
    }, [props])

    const elIntroPlayer = useRef()

    const checkIfTouchDevice = () => {
        try {
            document.createEvent("TouchEvent");
            setIsTouchDevice(true);
        } catch (err) {
            setIsTouchDevice(false);
        }
    }

    const connectedUsersAvatars = (users) => {
        return users.map(user => {
            return <Avatar key={user.id} alt={user.username} src={user.imgUrl} />
        })
    }

    const onMouseLeave = () => {
        setIsPlaying(false);
        setIntroId(null);
        props.setIsIntroPlaying(false);
    }

    const onHoverIntro = (box) => {
        if (props.currBox?._id === box._id) return;
        props.setIsIntroPlaying(true);
        socketService.emit('get intro', box._id);
        props.notify({ txt: `Connecting you live to "${box.name}" box...` });
    }

    const onGotIntro = (intro) => {
        setSecPlayed(intro.secPlayed);
        setIntroId(intro.youtubeId);
    }

    const playIntro = () => {
        if (!props.isIntroPlaying) return;
        setIsPlaying(true);
        elIntroPlayer.current.seekTo(secPlayed);
    }

    const subTitle = isTouchDevice ?
        <span class="flex justify-center align-center gap3">touch <PlayCircleOutlineIcon /> button to get a taste of what's playing</span> :
        'hover over to listen to what\'s playing';

    if (!boxes?.length) return null;
    return <section id="active" className="active-boxes-container">

        <div className="active-title">
            <h1>Top Boxes Now Live!</h1>
            <small>{subTitle}</small>
        </div>
        <div className="active-boxes flex">
            {boxes.map(box => {

                return <div
                    className="active-box"
                    key={'active-' + box._id}
                    onMouseEnter={() => onHoverIntro(box)}
                    onMouseLeave={onMouseLeave}>

                    <div className="connected-users">
                        <AvatarGroup max={4}>
                            {connectedUsersAvatars(box.connectedUsers)}
                        </AvatarGroup >
                    </div>

                    <img className="live" src={require('../../assets/img/live.gif')} alt="live" />

                    <BoxPreview box={box} introIsTouchDevice={isTouchDevice} />
                </div>
            })}

            <ReactPlayer
                ref={elIntroPlayer}
                className="hidden"
                url={`https://www.youtube.com/watch?v=${introId}`}
                volume={0.75}
                onReady={() => playIntro()}
                playing={isPlaying}
                controls={false}
            />

        </div>
    </section >
}

const mapStateToProps = state => ({
    currBox: state.boxReducer.currBox,
    isIntroPlaying: state.boxReducer.isIntroPlaying
})
const mapDispatchToProps = {
    setIsIntroPlaying,
    notify
}
export const BoxActive = connect(mapStateToProps, mapDispatchToProps)((_BoxActive));