import React, {Component} from 'react';
import {Drawer, Menu} from "antd";
import {withRouter} from "react-router";

class ToggleManagerView extends Component {

    toggelRouter = ({_, key}) => {
        this.props.history.push(`/admin/${key}`);
    }

    render() {
        return (
            <Drawer visible={this.props.visible} placement='right' closable={false} maskClosable={true}
                    onClose={this.props.close}
                    bodyStyle={{padding: '0'}}>
                <Menu theme='dark' style={{height: '1426px'}} onClick={this.toggelRouter}>
                    <Menu.Item key='view'>数据视图</Menu.Item>
                    <Menu.Item key='workspace'>工作台</Menu.Item>
                </Menu>
            </Drawer>
        );
    }
}

export default withRouter(ToggleManagerView);
