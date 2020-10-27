// OUTSOURCE IMPORT
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
// LOCAL IMPORT
import { BoxFilter } from './boxes/BoxFilter';
import { logout } from '../store/actions/userActions'
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
        if (window.innerWidth > 740) return;
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
        const { user, logout } = this.props;
        const { pathname } = this.props.location;
        const { isMobileMenuOpen, isScroll } = this.state;

        return (
            <React.Fragment>

                <div onClick={this.toggleMenu} className={`screen ${isMobileMenuOpen ? 'screen-open' : ''}`} />

                <header onScroll={this.onScroll} className={`${isScroll || isMobileMenuOpen ? 'sticky' : ''} flex space-between align-center`}>
                    {(pathname === '/') ?
                        <a href="#top"><img title="BeatBox" className="logo" src={require('../assets/img/logo.png')} alt="logo" /></a> :
                        <Link to="/" ><img title="BeatBox" className="logo" src={require('../assets/img/logo.png')} alt="logo" /></Link>
                    }

                    <BoxFilter isShown={(pathname !== '/' || isScroll)} />

                    <div className="right-nav flex align-center">
                        <ul className={`${isMobileMenuOpen ? 'menu-open' : ''} main-nav flex clean-list`}>
                            <li><Link to="/box" onClick={this.toggleMenu}>Boxes</Link></li>
                            <li><Link to={this.getPathForBoxAdd} onClick={this.toggleMenu} >Create Box</Link ></li>
                        </ul>

                        {user && <div className="user-avatar"><UserMenu user={user} onLogout={logout} /></div>}

                        <button
                            className="menu-btn flex justify-center"
                            onClick={this.toggleMenu}>
                            {isMobileMenuOpen ?
                                <CloseIcon /> :
                                <MenuIcon />}
                        </button>
                    </div>
                </header >
            </React.Fragment >
        )
    }
}

const mapStateToProps = state => ({ user: state.userReducer.loggedinUser });
const mapDispatchToProps = { logout };
export const Header = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Header))