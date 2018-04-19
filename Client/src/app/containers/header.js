import {connect} from "inferno-redux";

import Header from "../components/Header";
import {APP_PAGE_CHANGE} from "../actions/app";

const mapStateToProps = ({user}) => {
    return {
        user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changePage: payload => dispatch({type: APP_PAGE_CHANGE, payload})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
