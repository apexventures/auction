import { RECEIVER_ID, CHAT_BOX, UPDATE_CHATBOX, MESSAGE, MESSAGE_REMOVE } from '../actions/types';

const initialState = {
    receiverId: '',
    receiverName: '',
    collapse: false, 
    updateChatbox: '',
    messages: []
};

export default (state = initialState, action) => {
    switch(action.type) {
        case RECEIVER_ID:
            return{
                ...state,
                receiverId: action.receiverId,
                receiverName: action.receiverName
            };
        case CHAT_BOX:
            return{
                ...state,
                collapse: action.collapse,
            };
        case UPDATE_CHATBOX:
            return{
                ...state,
                updateChatbox: action.updateChatbox
            }
        case MESSAGE:
            return{
                ...state,
                messages: state.messages.concat(action.message)
            }
        case MESSAGE_REMOVE:
            return{
                ...state,
                messages: action.messages
            }
        default:
            return state;
    }
}