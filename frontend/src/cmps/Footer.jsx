// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
// import FacebookIcon from '@material-ui/icons/Facebook';



export default function Footer() {
    return (
        <footer>
            <nav className="social-container flex space-between">
                Coffee Rights
                <div className="social-facebook"><i className="fab fa-facebook-f"></i></div>
                <div className="social-twitter"><i className="fab fa-twitter"></i></div>
                <div className="social-be"><i className="fab fa-behance"></i></div>
                <div className="social-basketball"><i className="fab fa-dribbble"></i></div>
            </nav>
        </footer>
    )
}
