import {Component} from "inferno";
import {Motion, spring} from "inferno-motion";

import "../../css/general.css";
import Projects from "../containers/projects/projects";
import NewProject from "../components/projects/NewProject";
import Header from "../containers/header";
import Footer from "./Footer";

class App extends Component {
    constructor(props) {
        super(props);

        this.active =  {};
        this.pages = ["projects", "newProject"];
    }

    componentWillMount() {
        this.pages.map((page, index) => {
            this.active[page] = index === 0;
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mainPage !== this.props.mainPage) {
            this.pages.map(page => {
                this.active[page] = nextProps.mainPage === page;
            });
        }
    }

    renderPage(isActive, Child) {
        return (
            <Motion
                defaultStyle={{y: isActive ? 0 : -100, opacity: isActive ? 1: 0}}
                style={{
                    y: spring(isActive ? 0 : -100, {stiffness: 80, damping: 12}),
                    opacity: isActive ? 1 : spring(0, {stiffness: 130})
                }}
            >
                {({y, opacity}) => 
                    <div
                        className={"subWrapper"}
                        style={{
                            opacity,
                            transform: `translateY(${y}rem)`
                        }}
                    >
                        <Child />
                    </div>
                }
            </Motion>
        );
    }

    renderWrapper() {
        return (
            <div className="container wrapper">
                {this.renderPage(this.active.newProject, Projects)}
                {this.renderPage(this.active.projects, Projects)}
            </div>
        );
    }

    render() {
        return (
            <div style={{height: "100%", width: "100%"}}>
                <Header />
                {this.renderWrapper()}
                <Footer />
            </div>
        );
    }
}

export default App;
