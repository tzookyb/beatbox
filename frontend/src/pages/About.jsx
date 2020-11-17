import React from 'react'
import reactSvg from '../assets/svg/react-original.svg'
import reduxSvg from '../assets/svg/redux-original.svg'
import expressSvg from '../assets/svg/express-original.svg'
import mongodbSvg from '../assets/svg/mongodb-original.svg'
import nodejsSvg from '../assets/svg/nodejs-original.svg'
import sassSvg from '../assets/svg/sass-original.svg'

export function About() {
    return (
        <section class="about flex column align-center justify-center">
            <h1>BeatBox</h1>
            <p>Is a social-music app. It allows you to listen to music and edit playlists called "Boxes" with friends.</p>
            <p>Just choose one of the available boxes or create your own.<br />Then invite your friends to join with with the share links either via Whatsapp, Facebook or just plain old URL link to paste.</p>
            <p>Features: (click to show example)</p>
            <ul>
                <li>Sneak peek to current active boxes</li>
                <li>Collaborative playlist</li>
                <li>Synchronous playback with other connected users</li>
                <li>Search and add songs to playlist from YouTube API</li>
                <li>Chat with other connected users</li>
                <li>For signed users: dedicated profile page with favorite boxes and manage own created boxes</li>
            </ul>

            <p>This app is a SPA (single page application) PWA (progressive web app) which is mobile friendly, tested on Desktop Chrome and Android.<br />
            It was developed as a final project for fullstack bootcamp.</p>
            <p>It uses the latest technologies:</p>

            <div className="tech-grid">
                <div class="flex column align-center"><img alt="react" src={reactSvg} />React.js</div>
                <div class="flex column align-center"><img alt="redux" src={reduxSvg} />Redux state management</div>
                <div class="flex column align-center"><img alt="sass" src={sassSvg} />Sass</div>
                <div class="flex column align-center"><img alt="express" src={expressSvg} />Express.js</div>
                <div class="flex column align-center"><img alt="mongodb" src={mongodbSvg} />MongoDB</div>
                <div class="flex column align-center"><img alt="nodejs" src={nodejsSvg} />Node.js</div>
            </div>
        </section >
    )
}