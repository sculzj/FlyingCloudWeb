import React, {Component} from 'react';
import NavCommon from "../NavCommon";
import NavMember from "../NavMember";

class HeaderUI extends Component {
    render() {
        return (
            <>
                {
                    !this.props.state.token ?
                        <NavCommon/> :
                        <NavMember/>
                }
            </>
        )
    }
}

export default HeaderUI;
