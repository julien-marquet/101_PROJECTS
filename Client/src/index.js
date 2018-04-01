import "bootstrap";

import {render} from "inferno";
import {Provider} from "inferno-redux";
import createSagaMiddleware from "redux-saga";
import {
    createStore,
    applyMiddleware,
    compose
} from "redux";
import reducers from "./app/reducers/index";
import sagas from "./app/sagas/index";
import App from "./app/components/App";
import "./index.css";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducers, compose(applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(sagas);

render(
    (<Provider store={store}>
        <App />
    </Provider>),
    document.getElementById("app")
);
