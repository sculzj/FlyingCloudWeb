import React, {Component} from 'react';
import VisitorVolume from "./VisitorVolume";
import GroupRate from "./GroupRate";
import Members from "./Members";
import Territory from "./Territory";
import Efficiency from "./Efficiency";
import HotWord from "./HotWord";
import Resource from "./Resource";
import KeyData from "./KeyData";
import viewStyle from './index.module.css';
import {MenuFoldOutlined} from "@ant-design/icons";
import ToggleManagerView from "../ToggleAdminView";

class View extends Component {

    state = {drawVisible: false};

    toggleView = () => {
        this.setState(state => ({drawVisible: !state.drawVisible}));
    }

    render() {
        return (
            <div className={viewStyle.box}>
                <h2 className={viewStyle.header}>企业管理数据魔墙</h2>
                <VisitorVolume/>
                <GroupRate/>
                <Members/>
                <Territory/>
                <KeyData/>
                <Efficiency/>
                <HotWord/>
                <Resource/>
                <MenuFoldOutlined title='打开菜单' style={{
                    position: 'absolute',
                    right: '0',
                    top: '600px',
                    fontSize: '30px',
                    color: 'rgba(255,255,255,0.3)',
                    cursor: 'pointer'
                }} onClick={this.toggleView}/>
                <ToggleManagerView visible={this.state.drawVisible} close={this.toggleView}/>
            </div>
        );
    }
}

export default View;

