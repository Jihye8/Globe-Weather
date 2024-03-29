const CHANGE = 'coordinate/CHANGE';

export const change = (lngLat) =>({
    type : CHANGE, 
    lngLat
});

const initalState = {
    longitude : -122.4,
    latitude:37.8,
};

const coordinateReducer = (state = initalState, action) => {
    switch (action.type) {
        case CHANGE:
            return {
                ...state,
                longitude : action.lngLat.lng,
                latitude : action.lngLat.lat
            }   
        default:
            return state;
    }
}

export default coordinateReducer