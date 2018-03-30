import {Component} from "inferno";

class ProjectBox extends Component {
    render() {
        return (
            <div className={`col-${this.props.gridSize}`}>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        <a href="#" className="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProjectBox;
