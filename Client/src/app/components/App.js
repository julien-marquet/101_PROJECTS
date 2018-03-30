import {Component} from "inferno";

import "../../css/general.css";
import Projects from "../containers/projects/projects";
import Header from "./Header";

class App extends Component {
    render() {
        return (
            <div style={{height: "100%", width: "100%"}}>
                <Header />
                <div className="container wrapper">
                    <Projects />
                </div>
            </div>
        );
    }
}

export default App;
