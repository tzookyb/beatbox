import React from 'react'
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';

import imgIdan from '../assets/img/idan.jpeg';
import imgHilla from '../assets/img/hilla.jpg';
import imgMatan from '../assets/img/matan.jpg';

export function Footer() {
    return (
        <footer className="footer flex column align-center justify-center">
            <div className="container flex justify-center">
                <div className="developer flex align-center ">
                    <img alt="Idan" src={imgIdan} />
                    <p>Idan Benjamin</p>
                    <a href="https://www.linkedin.com/in/idanbenjamin" > <LinkedInIcon /></a>
                    <a href="https://github.com/tzookyb" > <GitHubIcon /></a>
                </div>
                <div className="developer flex align-center">
                    <img alt="Hilla" src={imgHilla} />
                    <p>Hilla Meri</p>
                    <a href="https://www.linkedin.com/in/hilla-meri-a9757a182" > <LinkedInIcon /></a>
                    <a href="https://github.com/HillaMeri" > <GitHubIcon /></a>
                </div>
                <div className="developer flex align-center">
                    <img alt="Matan" src={imgMatan} />
                    <p>Matan Crispel</p>
                    <a href="https://www.linkedin.com/in/matan-crispel-7316aa1a9"> <LinkedInIcon /></a>
                    <a href="https://github.com/matancris" > <GitHubIcon /></a>
                </div>
            </div>
            <small>
                © Coffee Rights BeatBox 2020
            </small>
        </footer>
    )
}