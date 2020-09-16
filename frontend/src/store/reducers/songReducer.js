const initialState = {
    songs: [],
  };
  
  export default function(state = initialState, action = {}) {
    switch (action.type) {
      case 'SET_SONGS':
        return { ...state, songs: action.songs };
      case 'SONG_ADD':
        return { ...state, songs: [...state.songs, action.song] };
      case 'SONG_UPDATE':
        return {
          ...state,
          songs: state.songs.map(song =>
            song._id === action.song._id ? action.song : song
          )};
      default:
        return state;
    }
  }
  