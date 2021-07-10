import React from "react";
import navCommonStyle from "./index.module.css";
import {NavLink} from "react-router-dom";
import {Button} from "antd";
import {UserOutlined} from "@ant-design/icons";

class NavCommon extends React.Component {
    render() {
        return (
            <>
                <div className={navCommonStyle.header}>
                    <div className={navCommonStyle.left}>
                        <NavLink className={navCommonStyle.listItem} activeClassName={navCommonStyle.active}
                                 to='/index'>首页</NavLink>
                        <NavLink className={navCommonStyle.listItem} activeClassName={navCommonStyle.active}
                                 to='/product'>产品中心</NavLink>
                        <NavLink className={navCommonStyle.listItem} activeClassName={navCommonStyle.active}
                                 to='/community'>飞云社区</NavLink>
                        <NavLink className={navCommonStyle.listItem} activeClassName={navCommonStyle.active}
                                 to='/join'>加入飞云</NavLink>
                        <NavLink className={navCommonStyle.listItem} activeClassName={navCommonStyle.active}
                                 to='/wiki'>开发wiki</NavLink>
                    </div>
                    <div className={navCommonStyle.right}>
                        <NavLink to='/register'>
                            <Button type='link' size='large' icon={<UserOutlined/>}
                                    className={navCommonStyle.sign}>企业注册</Button>
                        </NavLink>
                    </div>
                </div>
            </>
        );
    }
}

export default NavCommon;
