import { socketService } from "../../services/socketService";

// FROM SOCKET
export function updateLocalPlayer(currSong) {
    return (dispatch) => {
        dispatch({ type: 'SET_CURR_SONG', currSong })
    }
}
//  ***************************************************************
export function changeSong(id) {
    return (dispatch) => {
        const currSong = {
            id,
            isPlaying: true,
            secPlayed: 0
        };
        socketService.emit('set currSong', currSong);
        dispatch({ type: 'SET_CURR_SONG', currSong });
    }
}

export function togglePlay(song) {
    return (dispatch) => {
        const currSong = {
            ...song, isPlaying: !song.isPlaying
        }
        socketService.emit('set currSong', currSong);
        dispatch({ type: 'SET_CURR_SONG', currSong })
    }
}

export function updateProgress(secPlayed) {
    return (dispatch, getState) => {
        const currSong = {
            ...getState().boxReducer.currSong, secPlayed
        }
        socketService.emit('update progress', secPlayed);
        dispatch({ type: 'SET_CURR_SONG', currSong })
    }
}

export function updateSongTime(secPlayed) {
    return (dispatch, getState) => {
        const currSong = {
            ...getState().boxReducer.currSong, secPlayed
        }
        socketService.emit('song time changed', secPlayed);
        dispatch({ type: 'SET_CURR_SONG', currSong })
    }
}