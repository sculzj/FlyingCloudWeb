import React, {Component} from 'react';
import {Menu} from "antd";
import {KEYS} from "../../resource/constant";

export class PersonMenu extends Component {
    render() {
        return (
            <Menu>
                <Menu.Item key={KEYS.PERSONAL_ZONE}>个人中心</Menu.Item>
                <Menu.Item key=''>个人中心</Menu.Item>
                <Menu.Item key=''>个人信息</Menu.Item>
            </Menu>
        );
    }
}

export class SystemMenu extends Component {
    render() {
        return (
            <Menu>
                <Menu.Item key=''>退出登录</Menu.Item>
                <Menu.Item key=''>退出登录</Menu.Item>
                <Menu.Item key=''>退出登录</Menu.Item>
            </Menu>
        );
    }
}
