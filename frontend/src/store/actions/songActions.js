import { boxService } from "../../services/boxService"
import { songService } from "../../services/songService"


export function loadSongs(boxId) {
    return async dispatch => {
        const box = await boxService.getById(boxId)
        const songs = box.songs
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


export function removeSong(id) {
    return async dispatch => {
        await songService.remove(id)
        dispatch({ type: 'REMOVE_SONG', id })
        // dispatch({ type: 'NOTIFY', isShown: true, msg: 'Removed seccessfuly' })

    }
}