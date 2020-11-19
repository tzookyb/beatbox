// OUTSOURCE IMPORTS
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Avatar from '@material-ui/core/Avatar';
// LOCAL IMPORTS
import { ModalUser } from './ModalUser'

export function UserMenu({ user, onLogout }) {
    // const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const dispatch = useDispatch();
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    function logout(ev) {
        ev.preventDefault();
        onLogout();
        setOpen(false);
        dispatch({ type: 'SET_NOTIFY', notify: { txt: 'Logout Successful', type: 'green' } });
    }

    return (
        <div>
            <div className="user-menu">
                <Avatar
                    alt="Avatar" ref={anchorRef}
                    src={user.imgUrl}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                    className="cursor-pointer" />
                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={() => setOpen(false)}>
                                    <MenuList autoFocusItem={open} id="menu-list-grow">
                                        {!user.isGuest && <MenuItem onClick={() => setOpen(false)}>
                                            <Link to={`/user/${user._id}`} style={{ color: "black" }}>Profile</Link>
                                        </MenuItem>}
                                        {user.isGuest && <MenuItem >
                                            < ModalUser childern={'Signup'} />
                                        </MenuItem>}
                                        {user.isGuest && <MenuItem >
                                            < ModalUser childern={'Login'} />
                                        </MenuItem>}
                                        {!user.isGuest && <MenuItem onClick={logout}>Logout</MenuItem>}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </div >
    );
}