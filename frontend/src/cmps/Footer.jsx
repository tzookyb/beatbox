import React from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import FacebookIcon from '@material-ui/icons/Facebook';

export function Footer() {
    return (
        <footer className="flex">
            <div className="container">

                Coffee Rights Hila Idan Matan
            <div className="social-container">
                    <div className="social-facebook"><i className="fab fa-facebook-f"></i></div>
                    <div className="social-twitter"><i className="fab fa-twitter"></i></div>
                    <div className="social-be"><i className="fab fa-behance"></i></div>
                    <div className="social-basketball"><i className="fab fa-dribbble"></i></div>
                </div>

            </div>
        </footer>
    )
}