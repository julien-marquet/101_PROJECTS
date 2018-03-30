import {Component} from "inferno";

import "../../../css/projects.css";
import ProjectRow from "./ProjectRow";

class Projects extends Component {
    constructor(props) {
        super(props);

        this.rows = ["Popular", "Trending", "Categories", "Hiring"];
    }

    renderRows() {
        return this.rows.map((row, nbr) => <ProjectRow index={nbr} name={row} />);
    }

    render() {
        return (
            <div className={"container-fluid allProjects"}>
                {this.renderRows()}
            </div>
        );
    }
}

export default Projects;
