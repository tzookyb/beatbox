// OUTSOURCE IMPORT
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
// LOCAL IMPORT
import { BoxFilter } from './boxes/BoxFilter';
import { logout } from '../store/actions/userAction'
import { UserMenu } from './user/UserMenu'

class _Header extends Component {

    state = {
        isScroll: false,
        isMobileMenuOpen: false
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

    toggleMenu = () => {
        this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen })
    }

    getPathForBoxAdd = () => {
        let path;
        const currPath = this.props.location.pathname
        if (currPath === '/') path = '/add';
        else path = currPath.endsWith('/add') ? currPath : `${currPath}/add`
        return path;
    }

    render() {
        const { user } = this.props;
        return (
            <React.Fragment>
                <div onClick={this.toggleMenu} className={`screen ${this.state.isMobileMenuOpen ? 'screen-open' : ''}`} ></div>
                <header onScroll={this.onScroll} className={`${this.state.isScroll ? 'sticky' : ''} flex space-between align-center`}>
                    {(this.props.location.pathname === '/') ?
                        <a href="#top"><img title="BeatBox" className="logo" src={require('../assets/img/logo.png')} alt="logo" /></a> :
                        <Link to="/" ><img title="BeatBox" className="logo" src={require('../assets/img/logo.png')} alt="logo" /></Link>
                    }

                    <BoxFilter isShown={(this.props.location.pathname !== '/' || this.state.isScroll)} />

                    <div className="right-nav flex align-center">
                        <ul className={`${this.state.isMobileMenuOpen ? 'menu-open' : ''} main-nav flex clean-list`}>
                            <li><Link to="/box" onClick={this.toggleMenu}>Boxes</Link></li>
                            <li><Link to={this.getPathForBoxAdd} onClick={this.toggleMenu} >Create Box</Link ></li>
                        </ul>

                        <div className="user-avatar"><UserMenu user={user} onLogout={this.props.logout} /></div>

        
                        <button
                            className={`menu-btn`}
                            onClick={this.toggleMenu}>
                            {this.state.isMobileMenuOpen ? 
                            <CloseIcon /> :
                            <MenuIcon /> }
                            {/* 'X' : '☰'} */}
                        </button>
                    </div>
                </header >
            </React.Fragment >
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.userReducer.loggedinUser,
    }
}
const mapDispatchToProps = {
    logout,
}

export const Header = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Header))