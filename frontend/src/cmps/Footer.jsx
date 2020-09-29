import React from 'react'
import LinkedInIcon from '@material-ui/icons/LinkedIn';

import imgIdan from '../assets/img/idan.jpeg';
import imgHilla from '../assets/img/hilla.jpg';
import imgMatan from '../assets/img/matan.jpg';

export function Footer() {
    return (
        <footer className="footer flex column align-center justify-center">
            <div className="container flex justify-center">
                <div className="developer flex align-center ">
                    <img src={imgIdan} />
                    <p>Idan Benjamin</p>
                    <a href="https://www.linkedin.com/in/idanbenjamin" > <LinkedInIcon /></a>
                </div>
                <div className="developer flex align-center">
                    <img src={imgHilla} />
                    <p>Hilla Meri</p>
                    <a href="https://www.linkedin.com/in/hilla-meri-a9757a182" > <LinkedInIcon /></a>
                </div>
                <div className="developer flex align-center">
                    <img src={imgMatan} />
                    <p>Matan Crispel</p>
                    <a href="https://www.linkedin.com/in/matan-crispel-7316aa1a9"> <LinkedInIcon /></a>
                </div>
            </div>
            <small>
                © Coffee Rights BitBox 2020
            </small>
        </footer>
    )
}
{/* <div className="social-container">
        <div className="social-facebook"><i className="fab fa-facebook-f"></i></div>
        <div className="social-twitter"><i className="fab fa-twitter"></i></div>
    </div> */}