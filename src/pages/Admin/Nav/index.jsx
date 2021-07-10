import React, {Component} from 'react';
import {Menu} from "antd";
import adminNavStyle from './index.module.css';
import {ApartmentOutlined, AppstoreOutlined, HomeOutlined, TeamOutlined} from "@ant-design/icons";
import { withRouter} from "react-router";

const {SubMenu} = Menu;

class AdminNav extends Component {

    state = {height: '1000px'};

    componentDidMount() {
        this.setState({height: `${window.innerHeight - 64}px`});
        window.addEventListener('resize',()=>{
            this.setState({height:`${window.innerHeight-64}px`});
        });
    }

    toggleRouter = ({_, key}) => {
        this.props.history.push(`/admin/workspace/${key}`)
    };

    render() {
        return (
            <>
                <div className={adminNavStyle.box}>
                    <Menu mode='inline' theme='dark' className={adminNavStyle.menu}
                          style={{height: this.state.height}} onClick={this.toggleRouter}>
                        <SubMenu key='ManagerMembers' title='成员管理' icon={<TeamOutlined/>}>
                            <Menu.Item key='addmembers' className={adminNavStyle.item}>增加成员</Menu.Item>
                            <Menu.Item key='searchmembers' className={adminNavStyle.item}>查找成员</Menu.Item>
                        </SubMenu>
                        <SubMenu key='ManagerGroup' title='组织管理' icon={<ApartmentOutlined/>}>
                            <Menu.Item key='addgroups' className={adminNavStyle.item}>添加组织</Menu.Item>
                            <Menu.Item key='searchgroup' className={adminNavStyle.item}>查找组织</Menu.Item>
                        </SubMenu>
                        <SubMenu key='ManagerService' title='服务管理' icon={<AppstoreOutlined/>}>
                            <Menu.Item key='CurrentService' className={adminNavStyle.item}>当前服务</Menu.Item>
                            <Menu.Item key='ServiceStore' className={adminNavStyle.item}>服务商城</Menu.Item>
                        </SubMenu>
                        <SubMenu key='ManagerCompany' title='关于企业' icon={<HomeOutlined/>}>
                            <Menu.Item key='basicinfo' className={adminNavStyle.item}>基本信息</Menu.Item>
                            <Menu.Item key='ExtendInfo' className={adminNavStyle.item}>扩展信息</Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
            </>


        );
    }
}

export default withRouter(AdminNav);
