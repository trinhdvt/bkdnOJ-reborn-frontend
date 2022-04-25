import { combineReducers } from 'redux';
import counterReducer from './Counter/reducer.js';
import userReducer from './User/reducer.js';

const rootReducer = combineReducers({
    counter: counterReducer,
    user: userReducer,
});

export default rootReducer;