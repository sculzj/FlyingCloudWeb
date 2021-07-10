import React from "react";
import axios from "axios";
import Store from "../../redux/store";
import navMemberStyle from "./index.module.css";
import {Avatar, Badge, Button, Dropdown, Space} from "antd";
import {saveUserInfo} from "../../redux/actions/byUserInfo";
import messageIcon from '../../images/messageIcon.png';
import system from '../../images/system.png';
import {NavLink} from "react-router-dom";
import {Redirect, Route, Switch} from "react-router";
import Index from "../../pages/Index";
import {PersonMenu, SystemMenu} from "../Menu";

class NavMember extends React.Component {

    constructor(props) {
        super(props);
        axios({
            url: 'api/home',
            method: 'post',
            headers: {
                Authorization: Store.store.getState().token
            }
        }).then(response => {
            Store.store.dispatch(saveUserInfo(response.data));
        }).catch(err => {
            console.log(err.message);
        });
    }

    render() {
        return (
            <>
                <div className={navMemberStyle.header}>
                    <div className={navMemberStyle.left}>
                        <img src={(Store.store.getState().userinfo.orgLogo ?
                            require('../../' + Store.store.getState().userinfo.orgLogo) :
                            require('../../resource/userResource/logoIcon_default.png')).default} alt=''/>
                    </div>
                    <div className={navMemberStyle.right}>
                        <Space size={60}>
                            <Dropdown overlay={<PersonMenu/>} placement='bottomCenter'>
                                <Button type='link' style={{height: '64px', padding: 0}}
                                        className={navMemberStyle.name}>
                                    <Avatar
                                        src={(Store.store.getState().userinfo.headIcon ?
                                            require('../../' + Store.store.getState().userinfo.headIcon) :
                                            require('../../resource/userResource/headIcon_default.jpg')).default}/>
                                    &nbsp;{Store.store.getState().userinfo.userName}
                                </Button>
                            </Dropdown>
                            <Badge count={Store.store.getState().userinfo.schedule} size='small'>
                                <Button type='link' style={{padding: 0}} href='/schedule.html' target='_blank'>
                                    <img src={messageIcon} alt='' style={{width: '30px', height: '30px'}} title='未读消息'/></Button>
                            </Badge>
                            <Dropdown overlay={<SystemMenu/>} placement='bottomCenter'>
                                <Button type='link' style={{height: '64px', padding: 0}}>
                                    <img src={system} alt='' style={{width: '30px', height: '30px'}}/></Button>
                            </Dropdown>
                        </Space>
                    </div>
                    <NavLink to='/home' style={{visible: false}}>home</NavLink>
                </div>
                <div>
                    <Switch>
                        <Route path='/home' component={Index}/>
                        <Redirect to='/home'/>
                    </Switch>
                </div>
            </>
        );
    }
}

export default NavMember;
