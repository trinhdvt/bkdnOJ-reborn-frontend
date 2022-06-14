import { combineReducers } from 'redux';
import counterReducer from './Counter/reducer.js';

import userReducer from './User/reducer.js';
import profileReducer from './Profile/reducer.js';
import contestReducer from './Contest/reducer';

const rootReducer = combineReducers({
    counter: counterReducer,
    user: userReducer,
    profile: profileReducer,
    contest: contestReducer,
});

export default rootReducer;
