import {Component} from "inferno";

import ProjectBox from "./ProjectBox";

class Projects extends Component {
    renderItem() {
        return (
            <div className={"row"}>
                <ProjectBox gridSize={4} />
                <ProjectBox gridSize={4} />
                <ProjectBox gridSize={4} />
            </div>
        );
    }

    render() {
        return (
            <div className={"row projectRow"}>
                <div className={"col-2"}>
                    <a className={"carousel-control-prev"} href={"#carouselExampleIndicators"} role={"button"} data-slide={"prev"}>
                        <span className={"carousel-control-prev-icon"} aria-hidden={"true"}></span>
                    </a>
                </div>
                <div id={"carouselExampleIndicators"} className={"carousel col-8 mx-auto slide"} data-ride={"false"}>
                    <div className={"carousel-inner"}>
                        <div className={"carousel-item active"}>
                            {this.renderItem()}
                        </div>
                        <div className={"carousel-item"}>
                            {this.renderItem()}
                        </div>
                        <div className={"carousel-item"}>
                            {this.renderItem()}
                        </div>
                    </div>
                </div>
                <div className={"col-2"}>
                    <a className={"carousel-control-next"} href={"#carouselExampleIndicators"} role={"button"} data-slide={"next"}>
                        <span className={"carousel-control-next-icon"} aria-hidden={"true"}></span>
                    </a>
                </div>
            </div>
        );
    }
}

export default Projects;
