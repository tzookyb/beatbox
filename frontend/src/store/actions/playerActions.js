import { socketService } from "../../services/socketService";

// FROM SOCKET
export function updateLocalPlayer(currSong) {
    return (dispatch) => {
        dispatch({ type: 'SET_CURR_SONG', currSong })
    }
}
//  ***************************************************************
export function togglePlay(currSong) {
    return (dispatch) => {
        currSong = { ...currSong, isPlaying: !currSong.isPlaying }
        socketService.emit('set currSong', currSong);
        dispatch({ type: 'SET_CURR_SONG', currSong })
    }
}

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

export function updateProgress(secPlayed) {
    return (dispatch, getState) => {
        const currSong = {
            ...getState().boxReducer.currSong, secPlayed
        }
        socketService.emit('update backend currSong', currSong);
        dispatch({ type: 'SET_CURR_SONG', currSong });
    }
}