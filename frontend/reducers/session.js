import { RECEIVE_CURRENT_USER, LOGOUT_CURRENT_USER } from '../actions/session';

// default state
const _nullSession = {
    currentUser: null,
    errors: {}
};

// session reducer
export default (state = _nullSession, action) => {
    Object.freeze(state);
    switch (action.type) {

        case RECEIVE_CURRENT_USER:
            return Object.assign({}, {  currentUser: action.response.user,
                                        errors: action.response.errors });

        case LOGOUT_CURRENT_USER:
            return _nullSession

        default:
            return state;
    }
}
