import { socketService } from "../../services/socketService";

export function loadSong(id) {
    return async dispatch => {
        const currSong = {
            id,
            isPlaying: true,
            secPlayed: 0
        }
        socketService.emit('set currSong', currSong);
        dispatch({ type: 'SET_CURR_SONG', currSong })
    }
}

export function setCurrSong(currSong) {
    return async (dispatch, getState) => {
        currSong.id = currSong.id || getState().boxReducer.currBox.songs[0]
        // const currSong = {
        //     id,
        //     isPlaying: true,
        //     secPlayed: 0
        // }
        // socketService.emit('set currSong', currSong);
        dispatch({ type: 'SET_CURR_SONG', currSong })
    }
}
export function updateSongPlay(song) {
    return async dispatch => {
        const currSong = {
            ...song, isPlaying: !song.isPlaying
        }
        socketService.emit('set currSong', currSong);
        dispatch({ type: 'SET_CURR_SONG', currSong })
    }
}

export function updateSongTime(songTime) {
    return async (dispatch, getState) => {
        const currSong = {
            ...getState().boxReducer.currBox.currSong, secPlayed: songTime
        }
        socketService.emit('song time changed', songTime);
        dispatch({ type: 'SET_CURR_SONG', currSong })
    }
}









    // export function loadBoxes(filterBy) {
    //     return async dispatch => {
    //         const boxes = await boxService.query(filterBy);
    //         dispatch({ type: 'SET_BOXES', boxes })
    //     };
    // }

    // export function loadBox(boxId) {
    //     return async dispatch => {
    //         const box = await boxService.getById(boxId);
    //         dispatch({ type: 'SET_BOX', box })
    //     };
    // }

    // export function saveBox(box) {
    //     return async dispatch => {
    //         const newBox = await boxService.save(box);
    //         dispatch({ type: 'ADD_BOX', box: newBox })
    //         return newBox;
    //     };
    // }

    // export function updateBox(box) {
    //     return dispatch => {
    //         boxService.update(box);
    //         dispatch({ type: 'EDIT_BOX', box })
    //     };
    // }

    // export function removeBox(boxId) {
    //     return async dispatch => {
    //         await boxService.remove(boxId)
    //         dispatch({ type: 'REMOVE_BOX', boxId })
    //     };
    // }