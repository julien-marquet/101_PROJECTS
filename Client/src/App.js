import {version, Component} from "inferno";

import "./registerServiceWorker";
import Logo from "./logo";
import "./App.css";

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <Logo width="80" height="80" />
                    <h1>{`Welcome to Inferno ${version}`}</h1>
                </header>
                <p className="App-intro"></p>
            </div>
        );
    }
}

export default App;
