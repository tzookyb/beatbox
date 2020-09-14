import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

// import { Reducer1 } from './reducers/Reducer1 ';
// import { Reducer2 } from './reducers/Reducer2 ';


const rootReducer = combineReducers({
    // Reducer1,
    // Reducer2
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))