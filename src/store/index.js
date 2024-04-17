import { combineReducers } from 'redux';
import coordinateReducer from './coordinateReducer'
import placeNameReducer from './placeNameReducer';

const rootReducer = combineReducers({
    coordinate : coordinateReducer,
    placename : placeNameReducer
});

export default rootReducer;