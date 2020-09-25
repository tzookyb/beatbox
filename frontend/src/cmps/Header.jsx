// OUTSOURCE IMPORT
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

// LOCAL IMPORT
import { BoxFilter } from './boxes/BoxFilter';
import { logout } from '../store/actions/userAction'
import { UserMenu } from './user/UserMenu'

class _Header extends Component {

    state = {
        isScroll: false,
    }

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll)
    }

    onScroll = () => {
        if (window.scrollY > 0) {
            this.setState({ isScroll: true })
        }
        else this.setState({ isScroll: false })
    }

    render() {
        const { user } = this.props;
        return (
            <header onScroll={this.onScroll} className={`${this.state.isScroll ? 'sticky' : ''} flex space-around align-center`}>
                {(this.props.location.pathname === '/') ?
                    <a href="#top"><img title="BeatBox" className="logo" src={require('../assets/img/logo.png')} alt="logo" /></a> :
                    <Link to="/" ><img title="BeatBox" className="logo" src={require('../assets/img/logo.png')} alt="logo" /></Link>
                }

                <BoxFilter isShown={(this.props.location.pathname !== '/' || this.state.isScroll)} />


                <ul className="main-nav flex clean-list space-between align-center">
                    <li><Link to="/box">Boxes</Link></li>
                    <li><Link to="/box/add">Create Box</Link></li>
                    <li> <UserMenu user={user} onLogout={this.props.logout}/></li>
                </ul>
            </header >
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.userReducer.loggedinUser
    }
}
const mapDispatchToProps = {
    logout
}

export const Header = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Header))