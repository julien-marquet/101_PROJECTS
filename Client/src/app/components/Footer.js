import {Component} from "inferno";

class Footer extends Component {
    render() {
        return (
            <div className="container-fluid footer row">
                <div className={"col-3"}>
                    <p>Legal Mentions</p>
                </div>
                <div className={"col-3"}>
                    <p>Sources</p>
                </div>
                <div className={"col-6"}>
                    <p>Author legrivel@student.le-101.fr</p>
                    <p>Author jmarquet@student.le-101.fr</p>
                </div>
            </div>
        );
    }
}

export default Footer;
