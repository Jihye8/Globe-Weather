import { combineReducers } from 'redux';
import coordinateReducer from './coordinateReducer'

const rootReducer = combineReducers({
    coordinate : coordinateReducer
});

export default rootReducer;