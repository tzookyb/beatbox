import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import { userReducer } from './reducers/userReducer';
import { boxReducer } from './reducers/boxReducer';
// import { Reducer2 } from './reducers/Reducer2 ';


const rootReducer = combineReducers({
    userReducer,
    boxReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))