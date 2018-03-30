import {Component} from "inferno";

import "../../../css/projects.css";
import ProjectRow from "./ProjectRow";

class Projects extends Component {
    render() {
        return (
            <div className={"container-fluid allProjects"}>
                <ProjectRow />
            </div>
        );
    }
}

export default Projects;
