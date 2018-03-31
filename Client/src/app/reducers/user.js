import {USER_CONNECT_SUCCESS} from "../actions/user";

const initialState = {
    firstname: null,
    lastname: null,
    token: null,
    rank: null
};

const user = (state = initialState, {type, payload}) => {
    switch (type) {
    case USER_CONNECT_SUCCESS:
        return {
            ...state,
            ...payload
        };
    default:
        return state;
    }
};

export default user;
