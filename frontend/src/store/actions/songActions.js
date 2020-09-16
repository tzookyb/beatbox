import { songService } from "../../services/songService"


export function loadSongs(boxId) {
    return async dispatch => {
        const songs = await songService.query(boxId)
        dispatch({ type: 'SET_SONGS', songs })
    }
}

export function addSong(song) {
    return async dispatch => {
        const newSong = await songService.addSong(song)

        dispatch({ type: 'ADD_SONG', newSong })
        // dispatch({ type: 'NOTIFY', isShown: true, msg: 'Added seccessfuly' })
    }
}

// export function editSong(song) {
//     return dispatch => {
//         songService.save(song)
//             .then((song) => {
//                 dispatch({ type: 'EDIT_SONG', song })
//                 dispatch({ type: 'NOTIFY', isShown: true, msg: 'Added seccessfuly' })

//             })
//     }
// }

export function removeSong(id) {
    return async dispatch => {
        await songService.remove(id)
        dispatch({ type: 'REMOVE_SONG', id })
        dispatch({ type: 'NOTIFY', isShown: true, msg: 'Removed seccessfuly' })

    }
}