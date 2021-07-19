import React, {Component} from 'react';
import {Menu} from "antd";
import {AppstoreAddOutlined, BarChartOutlined, MailOutlined, UserSwitchOutlined} from "@ant-design/icons";
import {withRouter} from "react-router";

import navStyle from './index.module.css';


const {SubMenu}=Menu;

class Nav extends Component {

    state = {height: '1000px'};

    componentDidMount() {
        this.setState({height: `${window.innerHeight - 64}px`});
        window.addEventListener('resize',()=>{
            this.setState({height:`${window.innerHeight-64}px`});
        });
    }

    toToggleRouter=(item)=>{
        // console.log(item);
        this.props.history.push(`/system/home/${item.key}`);
    }

    render() {
        return (
            <>
                <Menu theme='dark' mode='inline' className={navStyle.frame} style={{height: this.state.height}}
                      onSelect={this.toToggleRouter}>
                    <SubMenu key='dataView' title='数据看板' icon={<BarChartOutlined style={{fontSize: '16px'}}/>}>
                        <Menu.Item key='run' className={navStyle.item}>经营数据</Menu.Item>
                    </SubMenu>
                    <SubMenu key='enterprise' title='企业管理' icon={<AppstoreAddOutlined style={{fontSize: '16px'}}/>}>
                        <Menu.Item key='approve' className={navStyle.item}>注册申请</Menu.Item>
                        <Menu.Item key='update' className={navStyle.item}>信息变更</Menu.Item>
                        <Menu.Item key='meal' className={navStyle.item}>服务管理</Menu.Item>
                        <Menu.Item key='infoList' className={navStyle.item}>基础信息</Menu.Item>
                    </SubMenu>
                    <SubMenu key='role' title='用户管理' icon={<UserSwitchOutlined style={{fontSize: '16px'}}/>}>
                        <Menu.Item key='addUser' className={navStyle.item}>创建用户</Menu.Item>
                        <Menu.Item key='auth' className={navStyle.item}>权限管理</Menu.Item>
                    </SubMenu>
                    <SubMenu key='broadcast' title='消息推送' icon={<MailOutlined style={{fontSize: '16px'}}/>}>
                        <Menu.Item key='post' className={navStyle.item}>新建推送</Menu.Item>
                        <Menu.Item key='feedback' className={navStyle.item}>消息管理</Menu.Item>
                        <Menu.Item key='template' className={navStyle.item}>消息模板</Menu.Item>
                    </SubMenu>
                </Menu>
            </>
        );
    }
}

export default withRouter(Nav);
