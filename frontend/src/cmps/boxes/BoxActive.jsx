import React from 'react';
import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player/youtube'
import { Avatar } from '@material-ui/core';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

import { BoxPreview } from './BoxPreview';
import { socketService } from '../../services/socketService';

export function BoxActive(props) {
    const [boxes, setBoxes] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [introId, setIntroId] = useState(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        socketService.on('got intro', onGotIntro)
        return () => {
            socketService.off('got intro', onGotIntro)
        }
    }, [])

    useEffect(() => {
        setBoxes(props.boxes);
    }, [props])

    const elPlayer = React.useRef()

    function connectedUsersAvatars(users) {
        return users.map(user => {
            return <Avatar key={user.id} alt={user.username} src={user.imgUrl} />
        })
    }

    function onHoverIntro(box) {
        socketService.emit('get intro', box._id);
    }
    var seek;
    async function onGotIntro(intro) {
        console.log("onGotIntro -> intro", intro)
        await setIntroId(intro.youtubeId);
        await setIsPlaying(true);
        if (isReady) {
            elPlayer.seekTo(intro.secPlayed);
        } else seek = intro.secPlayed;
    }

    if (!boxes?.length) return null;
    return <section id="active" className="active-boxes-container">

        <h1>Top Boxes Now Live!</h1>
        <div className="active-boxes flex">
            {boxes.map(box => {

                return <div className="active-box" onMouseEnter={() => onHoverIntro(box)} onMouseLeave={() => setIsPlaying(false)}>

                    <div className="connected-users">
                        < AvatarGroup max={4}>
                            {connectedUsersAvatars(box.connectedUsers)}
                        </AvatarGroup >
                    </div>

                    <img className="live" src={require('../../assets/img/live.gif')} alt="live" />

                    <BoxPreview box={box} />
                </div>
            })}

            <ReactPlayer
                ref={elPlayer}
                className="player hidden"
                url={`https://www.youtube.com/watch?v=${introId}`}
                volume={0.5}
                onReady={() => setIsReady(true)}
                playing={isPlaying}
                controls={false}
            />

        </div>
    </section >
}