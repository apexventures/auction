import { CURRENT_BID } from '../actions/types';

const initialState = {
    currentBidDetail: {}
};

export default (state = initialState, action) => {
    switch(action.type) {
        case CURRENT_BID:
            return{
                ...state,
                currentBidDetail: action.currentBidDetail
        };
        default:
            return state;
    }
}