import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Header extends Component {
    render() {
        return (
            <header className="flex space-around  align-center">
                <Link to="/" className="logo">BeatBox</Link>
                <ul className="main-nav flex clean-list space-between">
                    <Link to="/box" href="">Boxes</Link>
                    <Link to="/box/edit">Create Box</Link>
                    {/* <li className="link flex align-center">Link3</li> */}
                    <Link to='/login'>Login</Link>
                    {/* <Link to='/signup'>Signup</Link> */}
                    
                    {/* {loggedinUser && <button onClick={() => onLogout()}>Logout</button>} */}
                </ul>
            </header>
        )
    }
}
