import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Header extends Component {

    state = {
        isScroll: false
    }

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll)
    }
    

    onScroll = (ev) => {
        if (window.scrollY > 0) {
            console.log(window.scrollY);
            this.setState({isScroll : true})
        } 
        else this.setState({isScroll: false})
    }

    render() {
        return (
            <header onScroll={() => this.onScroll} className={`${this.state.isScroll ? 'sticky' : ''} flex space-around  align-center`}>
                <Link to="/" className="logo">BeatBox</Link>
                <ul className="main-nav flex clean-list space-between">
                    <li><a href="#boxes">Boxes</a></li>
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
