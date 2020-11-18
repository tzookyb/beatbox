import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { CircleLoading } from 'react-loadingg';
import reactSvg from '../assets/svg/react-original.svg'
import reduxSvg from '../assets/svg/redux-original.svg'
import expressSvg from '../assets/svg/express-original.svg'
import mongodbSvg from '../assets/svg/mongodb-original.svg'
import nodejsSvg from '../assets/svg/nodejs-original.svg'
import sassSvg from '../assets/svg/sass-original.svg'

export function About() {
    const isMobile = useSelector(state => state.boxReducer.isMobile);
    const [featGif, setFeatGif] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const listItems = [
        'Sneak peek to current active boxes',
        'Collaborative playlist',
        'Synchronous playback with other connected users',
        'Search and add songs to playlist from YouTube API',
        'Chat with other connected users',
        'For signed users: dedicated profile page with favorite boxes and manage own created boxes',
    ]

    useEffect(() => {
        if (!featGif) setIsLoaded(false);
    }, [featGif])

    return (
        <section>
            <div className={`screen ${featGif ? 'screen-open' : ''}`} onClick={() => setFeatGif('')}>
                {featGif && !isLoaded && < CircleLoading color="#ac0aff" />}
                {featGif &&
                    <div className="feat-gif flex justify-center">
                        <img className={isLoaded ? '' : 'img-loading'} onLoad={() => setIsLoaded(true)} src={require(`../assets/img/feat/${featGif}`)} alt="feature-gif" />
                    </div>}
            </div>
            <div className="about main-container flex column align-center justify-center">
                <h1>BeatBox</h1>
                <p>Is a social-music app. It allows you to listen to music and edit playlists called "Boxes" with friends.</p>
                <p>Just choose one of the available boxes or create your own.<br />Then invite your friends to join with with the share links either via Whatsapp, Facebook or just plain old URL link to paste.</p>
                <p>Key Features: ({`${isMobile ? 'tap' : 'click'}`} to show example)</p>
                <ul>
                    {listItems.map((item, idx) => <li key={idx} onClick={() => setFeatGif(`${idx}.gif`)}>{item}</li>)}
                </ul>

                <p>This app is a SPA (single page application) PWA (progressive web app) which is mobile friendly, tested on Desktop Chrome and Android.<br />
            It was developed as a final project for fullstack bootcamp.</p>
                <p>It uses the latest technologies:</p>

                <div className="tech-grid">
                    <div><img alt="react" src={reactSvg} />React.js</div>
                    <div><img alt="redux" src={reduxSvg} />Redux state management</div>
                    <div><img alt="sass" src={sassSvg} />Sass</div>
                    <div><img alt="express" src={expressSvg} />Express.js</div>
                    <div><img alt="mongodb" src={mongodbSvg} />MongoDB</div>
                    <div><img alt="nodejs" src={nodejsSvg} />Node.js</div>
                </div>
            </div >
        </section >
    )
}