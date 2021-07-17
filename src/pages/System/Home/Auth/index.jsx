import React, {Component} from 'react';
import {Button, Space, Table} from "antd";

import Store from '../../../../redux/store';
import UnAuth from "../../../../components/UnAuth";
import {
    DeleteOutlined,
    EditOutlined,
    LockOutlined,
    UnlockOutlined
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const {store} = Store;
const {Column} = Table;

class Auth extends Component {

    state={dataSource:[]};

    componentDidMount() {
        if (!store.getState().userinfo.userControl){
            return;
        }
        axios(
            {
                url:'http://localhost:3000/api/authList',
                method:'post',
                headers:{authorization:store.getState().token}
            }
        ).then(response=>{
            const {list}=response.data;
            const dataSource=[];
            // console.log(list);
            list.forEach(item=>{
                const tmp={};
                let permission='';
                tmp.uid=item.uid;
                tmp.state=item.state;
                tmp.start=moment(item.start).format('YYYY-MM-DD');
                tmp.end=moment(item.end).format('YYYY-MM-DD');
                if (item.view===1){
                    permission+='数据看板/';
                }
                if (item.approve===1){
                    permission+='企业审批/';
                }
                if (item.userControl===1){
                    permission+='用户管理/';
                }
                if (item.push===1){
                    permission+='消息推送/';
                }
                if (item.app===1){
                    permission+='移动登录/';
                }
                if (item.other===1){
                    permission+='其他权限/';
                }
                tmp.permission=permission?permission.slice(0,-1):'--';
                dataSource.push(tmp);
            });
            this.setState({dataSource:dataSource});
        }).catch();
    }

    render() {

        return (
            <>
                {
                    !store.getState().userinfo.userControl ? <UnAuth/> :
                        <Table locale={{emptyText: '没有更多系统管理员账户，请先创建账户。'}} dataSource={this.state.dataSource}
                               pagination={{hideOnSinglePage: true}}>
                            <Column title='登录账户' dataIndex='uid' key='uid' align='center' width='15%'/>
                            <Column title='当前状态' dataIndex='state' key='state' align='center' width='15%'
                                    render={(text => (
                                        text === 1 ? '有效' : '无效'
                                    ))}/>
                            <Column title='起始有效期' dataIndex='start' key='start' align='center' width='15%'/>
                            <Column title='结束有效期' dataIndex='end' key='end' align='center' width='15%'/>
                            <Column title='权限列表' dataIndex='permission' key='permission' align='center' width='25%'/>
                            <Column title='执行操作' dataIndex='option' key='option' align='center' width='15%'
                                    render={(text, record) => (
                                        <Space size={20}>
                                            <Button icon={<EditOutlined style={{fontSize: '20px'}}/>} type='link'
                                                    title='编辑权限'/>
                                            <Button icon={record.state === 1 ? <LockOutlined style={{fontSize: '20PX'}}/> :
                                                    <UnlockOutlined style={{fontSize: '20PX'}}/>} type='link'
                                                title={record.state === 1 ? '冻结账户' : '启用账户'}/>
                                            <Button icon={<DeleteOutlined style={{fontSize: '20PX'}}/>} type='link'
                                                    title='删除账户'/>
                                        </Space>
                                    )
                                    }/>
                        </Table>
                }
            </>
        );
    }
}

export default Auth;