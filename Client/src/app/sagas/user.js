import {all, fork, call, put} from "redux-saga/effects";

import {connectUserAPI} from "../api/user";
import {USER_CONNECT_SUCCESS} from "../actions/user";

function* checkUser() {
    let infos = {};
    if (localStorage.getItem("user") === null) {
        const code = new URL(window.location.href).searchParams.get("code");
        if (code !== null) {
            const {user, token} = yield call(connectUserAPI, code);
            if (user !== undefined) {
                infos.firstname = user.firstName;
                infos.lastname = user.lastName;
                infos.login = user.login;
                infos.rank = user.rank;
                infos.token = token.access_token;
                localStorage.setItem("user", JSON.stringify(infos));
            }
        }
    }
    else {
        infos = JSON.parse(localStorage.getItem("user"));
    }
    if (Object.keys(infos).length > 0) {
        yield put({type: USER_CONNECT_SUCCESS, payload: infos});
    }
}

function* flow() {
    yield all([
        fork(checkUser)
    ]);
}

export default flow;
