import { AUTHENTICATION, ROLE } from '../actions/types';

const initialState = {
    user: 'empty',
    userId: '',
    role: '',
    userDetails: '',
    accountType: ''
};

export default (state = initialState, action) => {
    switch(action.type) {
        case AUTHENTICATION:
            return{
                ...state,
                user: action.user,
                userId: action.userId,
                userDetails: action.userDetails,
                accountType: action.accountType
            };
        case ROLE:
            return{
                ...state,
                role: action.role
            }
        default:
            return state;
    }   
}