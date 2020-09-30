import React from 'react';
import { Link } from 'react-router-dom';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

import { ModalUser } from './ModalUser'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    paper: {
        marginRight: theme.spacing(2),
    },
}));

export function UserMenu({ user, onLogout }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    function logout(ev) {
        ev.preventDefault();
        onLogout();
        setOpen(false);
    }

    const handleClose = (ev) => {
        if (anchorRef.current && anchorRef.current.contains(ev.target)) {
            return;
        }
        setOpen(false);
    };


    // return focus to the button when we transitioned from !open -> open
    // const prevOpen = React.useRef(open);

    return (
        <div className={classes.root}>
            <div className="user-menu">
                <Avatar
                    alt="Remy Sharp" ref={anchorRef}
                    src={user.imgUrl}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                    style={{ cursor: "pointer" }} />
                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList autoFocusItem={open} id="menu-list-grow">
                                        {!user.isGuest && <MenuItem onClick={handleClose}>
                                            <Link to={`/user/${user._id}`} style={{ color: "black" }}>Profile</Link>
                                        </MenuItem>}
                                        <MenuItem >
                                            < ModalUser childern={'Signup'}/>
                                        </MenuItem>
                                        <MenuItem >
                                            < ModalUser childern={'Login'}/>
                                        </MenuItem>
                                        <MenuItem onClick={logout}>Logout</MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </div>
    );
}
