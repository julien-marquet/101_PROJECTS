import {APP_PAGE_CHANGE} from "../actions/app";

const initialState = {
    mainPage: "projects"
};

const app = (state = initialState, {type, payload}) => {
    switch (type) {
    case APP_PAGE_CHANGE:
        return {
            ...state,
            ...payload
        };
    default:
        return state;
    }
};

export default app;
