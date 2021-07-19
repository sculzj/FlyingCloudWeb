import React, {Component} from 'react';
import {Button, Checkbox, Col, Form, message, Modal, Row, Space, Spin, Table, DatePicker, ConfigProvider} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    LockOutlined,
    UnlockOutlined
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import zhCN from "antd/lib/locale/zh_CN";

import Store from '../../../../redux/store';
import UnAuth from "../../../../components/UnAuth";
import addStyle from "../AddUser/index.module.css";

const {store} = Store;
const {Column} = Table;
const {RangePicker} = DatePicker;

class Index extends Component {

    state = {dataSource: [], spin: true, modal: false, record: '', configLoading: false};

    updateSysUserList = () => {
        axios(
            {
                url: 'http://localhost:3000/api/authList',
                method: 'post',
                headers: {authorization: store.getState().token}
            }
        ).then(response => {
            const {list} = response.data;
            const dataSource = [];
            // console.log(list);
            list.forEach(item => {
                const tmp = {};
                let permission = '';
                tmp.key = item.uid;
                tmp.uid = item.uid;
                tmp.state = item.state;
                tmp.start = moment(item.start).format('YYYY-MM-DD');
                tmp.end = moment(item.end).format('YYYY-MM-DD');
                tmp.view = item.view;
                if (item.view === 1) {
                    permission += '数据看板/';
                }
                tmp.approve = item.approve;
                if (item.approve === 1) {
                    permission += '企业审批/';
                }
                tmp.userControl = item.userControl;
                if (item.userControl === 1) {
                    permission += '用户管理/';
                }
                tmp.push = item.push;
                if (item.push === 1) {
                    permission += '消息推送/';
                }
                tmp.app = item.app;
                if (item.app === 1) {
                    permission += '移动登录/';
                }
                tmp.other = item.other;
                if (item.other === 1) {
                    permission += '其他权限/';
                }
                tmp.permission = permission ? permission.slice(0, -1) : '--';
                dataSource.push(tmp);
            });
            this.setState({dataSource: dataSource, spin: false});
        }).catch();
    }

    componentDidMount() {
        if (!store.getState().userinfo.userControl) {
            return;
        }
        this.updateSysUserList();
    }

    editSysUser = (record) => {
        return () => {
            if (record.state === -1) {
                message.error('当前账户已冻结，请先启用账户后再编辑！').then();
                return;
            }
            this.setState({modal: true, record: record}, () => {
                const permission = [];
                this.state.dataSource.forEach(item => {
                    if (item.uid === record.uid) {
                        if (item.view === 1) {
                            permission.push('view');
                        }
                        if (item.approve === 1) {
                            permission.push('approve');
                        }
                        if (item.userControl === 1) {
                            permission.push('userControl');
                        }
                        if (item.push === 1) {
                            permission.push('push');
                        }
                        if (item.app === 1) {
                            permission.push('app');
                        }
                        if (item.other === 1) {
                            permission.push('other');
                        }
                    }
                });
                // console.log(permission);
                this.form.setFieldsValue({
                    permission: permission,
                    validity: [moment(record.start), moment(record.end)]
                });
            });
        }
    }

    disabledDate = (current) => {
        return current < (!this.state.record ? moment().startOf('day') : moment(this.state.record.end).endOf('day'));
    }

    freeze = (record) => {
        return () => {
            this.setState({spin: true}, () => {
                axios(
                    {
                        url: 'http://localhost:3000/api/freezeSyUser',
                        method: 'put',
                        data: {uid: record.uid},
                        headers: {authorization: store.getState().token}
                    }
                ).then(() => {
                    message.success('操作成功，已成功冻结账户！').then();
                    this.updateSysUserList();
                }).catch(() => {
                    message.error('操作失败，请重新尝试或联系系统管理员处理！').then();
                });
            });
        }
    }

    active = (record) => {
        return () => {
            if (record.state === 0) {
                message.warn('账户有效期超级，请调整有效期以启用账号！').then();
                return;
            }
            this.setState({spin: true}, () => {
                axios(
                    {
                        url: 'http://localhost:3000/api/activeSyUser',
                        method: 'put',
                        data: {uid: record.uid},
                        headers: {authorization: store.getState().token}
                    }
                ).then(() => {
                    message.success('操作成功，已成功启用账户！').then();
                    this.updateSysUserList();
                }).catch(() => {
                    message.error('操作失败，请重新尝试或联系系统管理员处理！').then();
                });
            });
        }
    }

    deleteUser = (record) => {
        return () => {
            this.setState({spin: true}, () => {
                axios(
                    {
                        url: 'http://localhost:3000/api/deleteSysUser',
                        method: 'delete',
                        data: {uid: record.uid},
                        headers: {authorization: store.getState().token}
                    }
                ).then(() => {
                        this.updateSysUserList();
                        message.success('操作成功，已成功删除账户信息！').then();
                    }
                ).catch(() => {
                    message.error('操作失败，请重新尝试或联系系统管理员处理！').then();
                });
            });
        }
    }

    cancelEdit = () => {
        if (this.state.configLoading) {
            message.warn('请等待服务器返回上一次任务执行结果！').then();
        } else {
            this.setState({modal: false});
        }
    }

    submitEditResult = () => {
        const result = this.form.getFieldsValue();
        // console.log(result);
        const data = {
            view: result.permission.includes('view') ? 1 : -1,
            approve: result.permission.includes('approve') ? 1 : -1,
            userControl: result.permission.includes('userControl') ? 1 : -1,
            push: result.permission.includes('push') ? 1 : -1,
            app: result.permission.includes('app') ? 1 : -1,
            other: result.permission.includes('other') ? 1 : -1,
            end: result.validity[1].format('YYYY-MM-DD'),
            state: this.state.record.state === 0 && result.validity[1] > moment().startOf('day') ? 1 : 0,
            uid:this.state.record.uid
        };
        // console.log(data);
        this.setState({configLoading: true}, () => {
            // console.log(data);
            axios(
                {
                    url: 'http://localhost:3000/api/editSysUser',
                    method: 'put',
                    data: {data: data},
                    headers: {authorization: store.getState().token}
                }
            ).then(() => {
                message.success('操作成功，已成功更新账户信息！').then();
                this.setState({modal: false, configLoading: false}, () => {
                    this.updateSysUserList();
                });
            }).catch(() => {
                message.error('账户信息更新失败，请联系管理员处理！').then();
                this.setState({modal: false, configLoading: false});
            });
        });
    }

    render() {

        return (
            <>
                {
                    !store.getState().userinfo.userControl ? <UnAuth/> : this.state.spin ?
                        <Spin tip='正在获取最新数据......' style={{width: '100%'}}/> :
                        <Table locale={{emptyText: '没有更多系统管理员账户，请先创建账户。'}} dataSource={this.state.dataSource}
                               pagination={{hideOnSinglePage: true}}>
                            <Column title='登录账户' dataIndex='uid' key='uid' align='center' width='15%'/>
                            <Column title='当前状态' dataIndex='state' key='state' align='center' width='15%'
                                    render={(text => (
                                        text === 1 ? '有效' : text === 0 ? '超期' : '冻结'
                                    ))}/>
                            <Column title='起始有效期' dataIndex='start' key='start' align='center' width='15%'/>
                            <Column title='结束有效期' dataIndex='end' key='end' align='center' width='15%'/>
                            <Column title='权限列表' dataIndex='permission' key='permission' align='center' width='25%'/>
                            <Column title='执行操作' dataIndex='option' key='option' align='center' width='15%'
                                    render={(_, record) => (
                                        <Space size={20}>
                                            <Button icon={<EditOutlined style={{fontSize: '20px'}}/>} type='link'
                                                    title='编辑账户' onClick={this.editSysUser(record)}/>
                                            {
                                                record.state === 1 ?
                                                    <Button icon={<LockOutlined style={{fontSize: '20PX'}}
                                                                                title='冻结账户'/>} type='link'
                                                            onClick={this.freeze(record)}/> :
                                                    <Button icon={<UnlockOutlined style={{fontSize: '20PX'}}/>}
                                                            title='启用账户' type='link' onClick={this.active(record)}/>
                                            }
                                            <Button icon={<DeleteOutlined style={{fontSize: '20PX'}}/>} type='link'
                                                    title='删除账户' onClick={this.deleteUser(record)}/>
                                        </Space>
                                    )}/>
                        </Table>
                }
                <Modal visible={this.state.modal} title='编辑账户' okText='提交' cancelText='取消' onCancel={this.cancelEdit}
                       onOk={this.submitEditResult} confirmLoading={this.state.configLoading}>
                    <Form labelCol={{span: 5}} wrapperCol={{span: 15}} ref={(form) => {
                        this.form = form
                    }}>
                        <Form.Item label='权限管理' name='permission'>
                            <Checkbox.Group>
                                <Row>
                                    <Col span={8}>
                                        <Checkbox className={addStyle.check} value='view'>数据看板</Checkbox>
                                    </Col>
                                    <Col span={8}>
                                        <Checkbox className={addStyle.check} value='approve'>企业审批</Checkbox>
                                    </Col>
                                    <Col span={8}>
                                        <Checkbox className={addStyle.check} value='userControl'>用户管理</Checkbox>
                                    </Col>
                                    <Col span={8}>
                                        <Checkbox className={addStyle.check} value='push'>消息推送</Checkbox>
                                    </Col>
                                    <Col span={8}>
                                        <Checkbox className={addStyle.check} value='app'>移动登录</Checkbox>
                                    </Col>
                                    <Col span={8}>
                                        <Checkbox className={addStyle.check} value='other'>其他权限</Checkbox>
                                    </Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        <Form.Item label='账户有效期' name='validity'>
                            <RangePicker disabled={[true, false]} disabledDate={this.disabledDate}
                                         className={addStyle.date}
                                         onChange={this.setValidity} allowClear={false}/>
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        );
    }
}

const Auth=() => (
    <ConfigProvider locale={zhCN}>
        <Index/>
    </ConfigProvider>
);

export default Auth;