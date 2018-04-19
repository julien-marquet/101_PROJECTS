import {connect} from "inferno-redux";

import App from "../components/App";

const mapStateToProps = ({app}) => {
    return {
        ...app
    };
};

export default connect(mapStateToProps)(App);
