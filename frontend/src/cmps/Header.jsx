import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { loadUser } from '../store/actions/userAction'

class _Header extends Component {

    state = {
        isScroll: false
    }

    componentDidMount() {
        this.props.loadUser();
        window.addEventListener("scroll", this.onScroll)
    }


    onScroll = (ev) => {
        if (window.scrollY > 0) {
            this.setState({ isScroll: true })
        }
        else this.setState({ isScroll: false })
    }

    render() {
        const { user } = this.props;
        return (
            <header onScroll={() => this.onScroll} className={`${this.state.isScroll ? 'sticky' : ''} flex space-around  align-center`}>
                <Link to="/" className="logo">BeatBox</Link>
                <ul className="main-nav flex clean-list space-between align-center">
                    <li><Link to="/box">Boxes</Link></li>
                    <Link to="/box/add">Create Box</Link>
                    {/* <li className="link flex align-center">Link3</li> */}
                    {!user && <Link to='/login'>Login</Link>}
                     <Link to='/login'>Login</Link>
                    {/* <Link to='/signup'>Signup</Link> */}

                    {/* {loggedinUser && <button onClick={() => onLogout()}>Logout</button>} */}

                    {user && <div className="avatar-img">
                        <img src={user.imgUrl} />
                    </div>}
                </ul>
            </header>
        )
    }
}


const mapStateToProps = state => {
    return {
        user: state.userReducer.loggedinUser
    }
}
const mapDispatchToProps = {
    loadUser
}

export const Header = connect(mapStateToProps, mapDispatchToProps)(_Header)
