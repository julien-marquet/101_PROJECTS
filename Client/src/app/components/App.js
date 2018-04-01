import {Component} from "inferno";

import "../../css/general.css";
import Projects from "../containers/projects/projects";
import Header from "../containers/header";
import Footer from "./Footer";

class App extends Component {
    render() {
        return (
            <div style={{height: "100%", width: "100%"}}>
                <Header />
                <div className="container wrapper">
                    <Projects />
                </div>
                <Footer />
            </div>
        );
    }
}

export default App;
