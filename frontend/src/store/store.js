import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import { userReducer } from './reducers/userReducer';
import { boxReducer } from './reducers/boxReducer';
import { msgReducer } from './reducers/msgReducer';

const rootReducer = combineReducers({
    userReducer,
    boxReducer,
    msgReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))