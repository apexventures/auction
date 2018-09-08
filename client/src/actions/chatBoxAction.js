import { UPDATE_CHATBOX, MESSAGE } from './types';

export const updateChatbox = (postData) => dispatch => {
    fetch('http://localhost:8812/users/update-about-chatBox', {
        method: 'POST',
        headers: {
            'content-type':'application/json'
        },
        body: JSON.stringify(postData)
    })
    .then(res => res.json())
    .then(res => dispatch({
        type: UPDATE_CHATBOX,
        updateChatbox: res
    }));
}

export const updateChat = (msg) => dispatch => {
    dispatch({
        type: MESSAGE,
        message : msg
    });
}