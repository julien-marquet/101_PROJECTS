import {connect} from "inferno-redux";

import Header from "../components/Header";

const mapStateToProps = ({user}) => {
    return {
        user
    };
};

export default connect(mapStateToProps)(Header);
