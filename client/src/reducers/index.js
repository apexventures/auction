import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import BidReducer from './BidReducer';
import ChatReducer from './ChatReducer';

export default combineReducers({
    authentication: AuthReducer,
    bidReducer: BidReducer,
    chatReducer: ChatReducer
    // another reducer
});