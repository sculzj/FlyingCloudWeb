import React, {Component} from 'react';
import {Menu} from "antd";
import navStyle from './index.module.css';

const {SubMenu} = Menu;

class WikiNav extends Component {
    render() {
        return (
            <Menu mode='inline' className={navStyle.nav}>
                <SubMenu title='1 开发前须知'>
                    <Menu.Item><a href='/wiki#dhguoe'>1.1Wiki法律条款</a></Menu.Item>
                    <Menu.Item>1.2 Wiki适用范围</Menu.Item>
                </SubMenu>
                <SubMenu title='2 开发环境准备'>
                    <Menu.Item>2.1 Wiki法律条款</Menu.Item>
                    <Menu.Item>2.2 Wiki适用范围</Menu.Item>
                </SubMenu>
                <SubMenu title='3 接口文档'>
                    <Menu.Item>3.1 Wiki法律条款</Menu.Item>
                    <Menu.Item>3.2 Wiki适用范围</Menu.Item>
                    <Menu.Item>3.3 Wiki法律条款</Menu.Item>
                    <Menu.Item>3.4 Wiki适用范围</Menu.Item>
                </SubMenu>
            </Menu>
        );
    }
}

export default WikiNav;