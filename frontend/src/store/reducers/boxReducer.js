const initialState = {
    boxes: null,
    currBox: null,
    currSong: null,
    filter: '',
    activeBoxes: null,
}

export function boxReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_BOXES':
            return { ...state, boxes: action.boxes }

        case 'SET_CURR_BOX':
            return { ...state, currBox: action.currBox }

        case 'UPDATE_BOX':
            return {
                ...state,
                currBox: action.currBox,
                boxes: state.boxes?.map(box => {
                    if (action.currBox._id === box._id) return action.currBox
                    return box;
                })
            }

        case 'ADD_BOX':
            return { ...state, boxes: [...state.boxes, action.box] }

        case 'REMOVE_BOX':
            return { ...state, boxes: state.boxes.filter(box => box._id !== action.boxId) }

        case 'SET_ACTIVE_BOXES':
            return { ...state, activeBoxes: action.boxes }

        case 'SET_CURR_SONG':
            return { ...state, currSong: action.currSong }

        case 'SET_FILTER':
            return { ...state, filter: action.filter }

        default:
            return state
    }
}