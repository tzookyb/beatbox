
const initialState = {
    boxes: [],
    currBox: null,
    isNoticeShown: false,
    msg: '',
    currSong: null,
    filterBy: ''
}

export function boxReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_BOXES':
            return {
                ...state,
                boxes: action.boxes
            }
        case 'SET_BOX':
            return {
                ...state,
                currBox: action.box
            }
        case 'UPDATE_BOX':
            return {
                ...state,
                currBox: action.box,
                boxes: state.boxes.map(box => {
                    if (action.box._id === box._id) return action.box
                    return box;
                })
            }
        case 'ADD_BOX':
            return {
                ...state, boxes: [...state.boxes, action.box]
            }
        case 'REMOVE_BOX':
            return { ...state, boxes: state.boxes.filter(box => box._id !== action.boxId) }

        case 'SET_CURR_SONG':
            return {
                ...state, currBox: { ...state.currBox, currSong: action.currSong }
            }
        case 'SET_FILTER':
            return {
                ...state, filterBy: action.filterBy
            }
        default:
            return state
    }
}