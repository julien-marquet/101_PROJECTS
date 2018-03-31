import {Component} from "inferno";

import "../../css/general.css";
import "../../css/header.css";
import config from "../../config/config";

class Header extends Component {
    constructor(props) {
        super(props);

        this.login = this.login.bind(this);
    }

    login() {
        window.location.replace(`${config.apiEndpoint}/oauth/authorize?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code`);
    }

    render() {
        return (
            <div className={"container-fluid header"}>
                <div className={"row headerWrapper align-items-center"}>
                    <div className={"col-4"}></div>
                    <div className={"col-2"}></div>
                    <div className={"col-2"}></div>
                    <div className={"col-2"}></div>
                    <div className={"col-2 "}>
                        <button
                            type={"button"}
                            className={"btn btn-dark w-50"}
                            onClick={this.login}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;
