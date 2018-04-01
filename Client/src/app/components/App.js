import {Component} from "inferno";
import {Motion, spring} from "inferno-motion";

import "../../css/general.css";
import Projects from "../containers/projects/projects";
import Header from "../containers/header";
import Footer from "./Footer";

class App extends Component {
    constructor(props) {
        super(props);

        this.pages = ["projects", "newProject"];
        this.state = {
            wrapperY: -((this.pages.length - 1) * 100)
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mainPage !== this.props.mainPage) {
            this.pages.forEach(page => {
                if (page === this.props.mainPage) {
                    this.setState({
                        wrapperY: this.state.wrapperY - 100
                    });
                    return ;
                }
                else if (page === nextProps.mainPage) {
                    this.setState({
                        wrapperY: this.state.wrapperY + 100
                    });
                    return ;
                }
            });
        }
    }

    isActive(page) {
        return (this.state.wrapperY === -((this.pages.length - 1 - this.pages.findIndex(el => el === page)) * 100));
    }

    renderWrapper() {
        return [
            <Motion
                defaultStyle={{y: this.state.wrapperY}}
                style={{
                    y: spring(this.state.wrapperY, {stiffness: 80, damping: 12})
                }}
            >
                {({y}) => 
                    <div
                        className="container wrapper"
                        style={{
                            transform: `translateY(${y}rem)`
                        }}
                    >
                        <Projects />
                    </div>
                }
            </Motion>,
            <Motion
                defaultStyle={{y: this.state.wrapperY, opacity: 1}}
                style={{
                    y: spring(this.state.wrapperY, {stiffness: 50}),
                    opacity: this.isActive("projects") ? 1 : spring(0, {stiffness: 130})
                }}
            >
                {({y, opacity}) => 
                    <div
                        className="container wrapper"
                        style={{
                            transform: `translateY(${y}rem)`,
                            opacity: `${opacity}`
                        }}
                    >
                        <Projects />
                    </div>
                }
            </Motion>
        ];
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
