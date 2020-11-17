import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import FacebookIcon from '@material-ui/icons/Facebook';
import WhatsappIcon from '@material-ui/icons/WhatsApp';
import LinkIcon from '@material-ui/icons/Link';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import FavoriteIcon from '@material-ui/icons/Favorite';

export function _MidControls(props) {
    const { user, isSongPickOpen, isGuestToast, isFavorite, onToggleFavorite, toggleSongPick, isMobile, unread, openMobileChat } = props;
    const [isClipboardToast, setIsClipboardToast] = useState(false);
    const [chatNotify, setChatNotify] = useState('');
    const [isShown, setIsShown] = useState(false);

    const toggleClipboardToast = () => {
        setIsClipboardToast(true);
        setTimeout(() => setIsClipboardToast(false), 2000);
    }

    useEffect(() => {
        if (!unread) setChatNotify('');
        else {
            setChatNotify(`${unread} new ${unread === 1 ? 'message' : 'messages'}`);
            setIsShown(true);
        }
    }, [unread]);

    useEffect(() => {
        setChatNotify('Swipe right for BoxWall');
        setIsShown(true);
        setTimeout(() => setIsShown(false), 3000);
    }, []);

    return (
        <div className="song-social-actions flex space-between">
            {isMobile && <h3 className={`chat-notify ${isShown ? 'shown' : ''}`} onClick={openMobileChat}>{chatNotify}</h3>}

            <div className="btns-container flex align-center">
                <Fab className={`add-song-btn  ${isSongPickOpen ? 'opened' : ''}`}
                    title="Add Songs to Playlist"
                    onClick={() => toggleSongPick(true)}
                    aria-label="add"
                >
                    <AddIcon />
                </Fab>

                <div title="Add to favorites" className={`like-btn flex align-center ${isFavorite ? "favorite" : ""}`}>
                    <FavoriteIcon onClick={onToggleFavorite} />
                    {isGuestToast && <div className="guest-toast"><small>Signup to enjoy favorites feature</small></div>}
                </div>
            </div>

            <div className="share-container flex space-between column">
                <p>Invite a friend to join you:</p>
                <div className="share-btns flex space-evenly">
                    <a className="facebook-share-btn"
                        href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                        rel="noopener noreferrer" target="_blank" title="Share to Facebook">
                        <FacebookIcon />
                    </a>
                    <a className="whatsapp-share-btn"
                        href={`whatsapp://send?text=${user.username === 'Guest' ? 'Someone' : user.username} shared a BeatBox With You! : ${window.location.href}`}
                        data-action="share/whatsapp/share" title="Share to Whatsapp">
                        <WhatsappIcon />
                    </a>
                    <CopyToClipboard className="copy-share-btn" text={window.location.href}>
                        <LinkIcon onClick={toggleClipboardToast} />
                    </CopyToClipboard>
                </div>
                {isClipboardToast && <small className="clipboard-toast">Link copied to your clipboard!</small>}
            </div>

        </div>
    )
}

const mapStateToProps = state => ({
    isMobile: state.boxReducer.isMobile,
    unread: state.msgReducer.unread
})

export const MidControls = connect(mapStateToProps)(_MidControls);