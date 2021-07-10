import React from "react";
import navMemberStyle from "./index.module.css";
import {Avatar, Badge, Button, Dropdown, Space} from "antd";
import messageIcon from '../../../images/messageIcon.png';
import system from '../../../images/system.png';
import {PersonMenu, SystemMenu} from "../../../components/Menu";
import Store from "../../../redux/store";
const {store}=Store;

class Header extends React.Component {

    render() {
        return (
            <>
                <div className={navMemberStyle.header}>
                    <div className={navMemberStyle.left}>
                        <img src={(store.getState().userinfo.orgLogo ?
                            require('../../../resource/userResource/' + store.getState().userinfo.orgLogo) :
                            require('../../../resource/userResource/logoIcon_default.png')).default} alt=''/>
                    </div>
                    <div className={navMemberStyle.right}>
                        <Space size={60}>
                            <Dropdown overlay={<PersonMenu/>} placement='bottomCenter'>
                                <Button type='link' style={{height: '64px', padding: 0}}
                                        className={navMemberStyle.name}>
                                    <Avatar
                                        src={(store.getState().userinfo.headIcon ?
                                            require('../../../resource/userResource/' + store.getState().userinfo.headIcon) :
                                            require('../../../resource/userResource/headIcon_default.jpg')).default}/>
                                    &nbsp;{store.getState().userinfo.userName}
                                </Button>
                            </Dropdown>
                            <Badge count={store.getState().userinfo.schedule} size='small'>
                                <Button type='link' style={{padding: 0}} href='/schedule.html' target='_blank'>
                                    <img src={messageIcon} alt='' style={{width: '30px', height: '30px'}} title='未读消息'/></Button>
                            </Badge>
                            <Dropdown overlay={<SystemMenu/>} placement='bottomCenter'>
                                <Button type='link' style={{height: '64px', padding: 0}}>
                                    <img src={system} alt='' style={{width: '30px', height: '30px'}}/></Button>
                            </Dropdown>
                        </Space>
                    </div>
                </div>
            </>
        );
    }
}

export default Header;
