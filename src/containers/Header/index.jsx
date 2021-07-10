import HeaderUI from "../../components/HeaderUI";
import {connect} from "react-redux";
import {saveUserInfo} from "../../redux/actions/byUserInfo";

export default connect(state => ({state}), {saveUserInfo: saveUserInfo})(HeaderUI);