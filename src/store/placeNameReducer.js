const SAVE = 'placename/SAVE';

export const save = (place)=>({
    type : SAVE,
    place,
});
    
const initalState = {
    placeName : ''
}

const placeNameReducer = (state = initalState,action)=>{
    switch(action.type){
        case SAVE:
            console.log('action',action)
            return{
                ...state,
                placeName : action.place
            }
        default:
            return state;
    }
}

export default placeNameReducer;