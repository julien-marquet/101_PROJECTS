import {Component} from "inferno";

import "../../css/general.css";
import "../../css/header.css";
import config from "../../config/config";
import logo from "../../img/101_logo_light.svg";

class Header extends Component {
    constructor(props) {
        super(props);

        this.login = this.login.bind(this);
    }

    login() {
        window.location.replace(`${config.apiEndpoint}/oauth/authorize?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code`);
    }

    addDefaultSrc(ev) {
        if (ev.target.src.slice(-3) !== "jpg") {
            ev.target.src = `https://cdn.intra.42.fr/users/large_${this.props.user.login}.jpg`;
        }
    }

    renderInfos() {
        if (this.props.user.login === undefined) {
            return (
                <button
                    type={"button"}
                    className={"btn btn-dark w-50"}
                    onClick={this.login}
                >
                    {"Login"}
                </button>
            );
        }
        return (
            <div className={"row maxHeight"}>
                <div className={"col-6 maxHeight"}>
                    <div className={"circleWrapper"}>
                        <img
                            onError={this.addDefaultSrc}
                            src={`https://cdn.intra.42.fr/users/small_${this.props.user.login}.JPG`}
                            height={"100%"}
                            className={"userImg"}
                            alt={"User img"}
                        />
                    </div>
                </div>
                <div className={"col-6 maxHeight align-items-center"}>
                    <div className={"row"} style={{display: "flex"}}>
                        <p>{this.props.user.login}</p>
                    </div>
                    <div className={"row"}  style={{display: "flex"}}>
                        <p>{this.props.user.rank}</p>
                    </div>
                </div>
            </div>
        );
    }

    renderMyProjects() {
        if (this.props.user.login !== undefined) {
            return (
                <button
                    type={"button"}
                    className={"btn btn-dark headerFullButton"}
                >
                    {"My projects"}
                </button>
            );
        }
    }

    renderNewProject() {
        if (this.props.user.login !== undefined) {
            return (
                <button
                    type={"button"}
                    className={"btn btn-dark headerFullButton"}
                    onClick={() => this.props.changePage({mainPage: "newProject"})}
                >
                    {"New project"}
                </button>
            );
        }
    }

    render() {
        return (
            <div className={"container-fluid header"}>
                <div className={"row maxHeight align-items-center"}>
                    <div className={"col-4 maxHeight"}>
                        <div
                            className={"row logo bg-light maxHeight"}
                            onClick={() => this.props.changePage({mainPage: "projects"})}
                        >
                            <div className={"col-2 maxHeight"} >
                                <img
                                    src={logo}
                                    className={"maxHeight"}
                                />
                            </div>
                            <div className={"col maxHeight"}>
                                <h1>{"projects"}</h1>
                            </div>
                        </div>
                    </div>
                    <div className={"col-2 maxHeight"}>
                        {this.renderMyProjects()}
                    </div>
                    <div className={"col-2 maxHeight"}>
                        {this.renderNewProject()}
                    </div>
                    <div className={"col-2 maxHeight"}></div>
                    <div className={"col-2 maxHeight bg-dark"}>
                        {this.renderInfos()}
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;
