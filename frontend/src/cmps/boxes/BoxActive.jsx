import React from 'react';
import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player/youtube'
import { Avatar } from '@material-ui/core';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

import { BoxPreview } from './BoxPreview';
import { socketService } from '../../services/socketService';

export function BoxActive(props) {
    useEffect(() => {
        socketService.on('got intro', onGotIntro);
        checkIfTouchDevice();
        return () => {
            socketService.off('got intro', onGotIntro);
        }
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
    }

    const onHoverIntro = (box) => {
        socketService.emit('get intro', box._id);
    }
    
    const onGotIntro = (intro) => {
        setSecPlayed(intro.secPlayed);
        setIntroId(intro.youtubeId);
    }
    
    const playIntro = async () => {
        elIntroPlayer.current.seekTo(secPlayed);
        await setIsPlaying(true);
    }

    const underTitle = isTouchDevice ? 'long touch to listen to what\'s playing' : 'hover over to listen to what\'s playing';

    if (!boxes?.length) return null;
    return <section id="active" className="active-boxes-container">

        <div className="active-title">
            <h1>Top Boxes Now Live!</h1>
            <small>{underTitle}</small>
        </div>
        <div className="active-boxes flex">
            {boxes.map(box => {

                return <div
                    className="active-box"
                    key={'active-' + box._id}
                    onMouseEnter={() => onHoverIntro(box)}
                    onMouseLeave={onMouseLeave}>

                    <div className="connected-users">
                        < AvatarGroup max={4}>
                            {connectedUsersAvatars(box.connectedUsers)}
                        </AvatarGroup >
                    </div>

                    <img className="live" src={require('../../assets/img/live.gif')} alt="live" />

                    <BoxPreview isPlaying={isPlaying} box={box} />

                </div>
            })}

            <ReactPlayer
                ref={elIntroPlayer}
                className="player hidden"
                url={`https://www.youtube.com/watch?v=${introId}`}
                volume={0.75}
                onReady={() => playIntro()}
                playing={isPlaying}
                controls={false}
            />

        </div>
    </section >
}