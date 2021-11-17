// noinspection TypeScriptUMDGlobal,JSValidateTypes

import React, {Component} from 'react';
import {Button, Form, Input, message, Space, Spin, Table, Tooltip, TreeSelect} from "antd";
import {CopyOutlined, DeleteOutlined, EditOutlined, QuestionCircleOutlined} from "@ant-design/icons";

import style from './index.module.css';
import {OPERATE_TYPE, serverIP} from "../../../../resource/constant";
import axios from "axios";
import Store from "../../../../redux/store";

const {Column} = Table;
const {store} = Store;

class Role extends Component {

    constructor(props) {
        super(props);
        this.state = {permissionList: [], roles: [], loading: true, operation: OPERATE_TYPE.NEW, role: {}};
        this.getPermissionInfo();
    }

    submit = (values) => {
        if (this.state.operation === OPERATE_TYPE.NEW) {
            this.createRole(values);
        } else {
            this.updateRole(values);
        }
    }

    /**
     * 提交表单创建角色
     * @param values
     */
    createRole = (values) => {
        values.permission = values.permission.join('');
        console.log(values);
        axios({
            url: `${serverIP}/api/role`,
            method: 'post',
            data: values,
            headers: {authorization: store.getState().token}
        }).then(() => {
            this.getRolesInfo();
            this.resetFrom();
            message.success('角色创建成功！').then();
        }).catch(err => {
            message.error('角色创建失败！').then();
            console.log(err);
        });
    }

    /**
     * 提交表单修改角色信息，需要先检查是否修改过信息
     * @param values
     */
    updateRole = (values) => {
        const {role} = this.state;
        if (values.name === role.name && values.level === role.level && values.permission.join('') === role.permission && values.cloud_storage === role.cloud_storage) {
            message.warn('未修改角色信息！').then();
        } else {
            values.permission = values.permission.join('');
            axios({
                url: `${serverIP}/api/role`,
                method: 'put',
                data: values,
                headers: {authorization: store.getState().token}
            }).then(() => {
                message.success('角色信息修改成功！').then();
                this.getRolesInfo();
            }).catch();
        }
        this.resetFrom();
    }

    /**
     * 首次进入页面从服务器获取权限列表
     */
    getPermissionInfo = () => {
        axios({
            url: `${serverIP}/api/permission`,
            method: 'get',
            headers: {authorization: store.getState().token}
        }).then(response => {
            const permissionList = response.data.result;
            permissionList.forEach(item => {
                item.key = item.code;
                item.value = item.code;
            });
            this.setState({permissionList}, () => {
                this.getRolesInfo();
            });
        }).catch(err => {
            message.error('权限列表获取失败！请联系管理员处理。').then();
            console.log(err);
        });
    }

    /**
     * 获取角色信息
     */
    getRolesInfo = () => {
        axios({
            url: `${serverIP}/api/role`,
            method: 'get',
            headers: {authorization: store.getState().token}
        }).then(response => {
            const {roles} = response.data;
            roles.forEach(role => {
                role.key = role.name;
            });
            this.setState({roles, loading: false});
        }).catch(err => {
            message.error('角色信息获取失败！请联系管理员处理。').then();
            console.log(err);
        });
    }

    /**
     * 修改角色信息
     * @param role 要修改的角色信息
     * @returns {(function(): void)|*}
     */
    editRoleInfo = (role) => {
        const self = this;
        return function () {
            const {name, level, permission, cloud_storage} = role;
            self.form.setFieldsValue({name, level, permission: permission.split(''), cloud_storage});
            self.setState({operation: OPERATE_TYPE.UPDATE, role: role});
        }
    }

    /**
     * 复制角色信息
     * @param role 要复制的角色信息
     * @returns {(function(): void)|*}
     */
    copyRoleInfo=(role)=>{
        const self = this;
        return function () {
            const {name, level, permission, cloud_storage} = role;
            self.form.setFieldsValue({name, level, permission: permission.split(''), cloud_storage});
            self.setState({operation: OPERATE_TYPE.NEW, role: role});
        }
    }

    /**
     * 删除角色信息
     * @param role
     */
    deleteRole=(role)=>{
        const selef=this;
        return function(){
            axios({
                url:`${serverIP}/api/role`,
                method:'delete',
                data:{name:role.name},
                headers:{authorization:store.getState().token}
            }).then(()=>{
                message.success('角色删除成功！').then();
                selef.getRolesInfo();
            }).catch(err=>{
                message.error('角色删除失败，请联系系统管理员！').then();
                console.log(err);
            });
        }
    }

    /**
     * 清空表单内容
     */
    resetFrom=()=>{
        this.form.resetFields();
    }

    render() {
        return (
            <div className={style.container}>
                <div className={style.left}>
                    <p><Tooltip title='角色表示成员的属性，可以帮助您高效的管理成员。'>关于角色<QuestionCircleOutlined/></Tooltip></p>
                    <Form labelCol={{span: 5}} wrapperCol={{span: 18}} onFinish={this.submit} ref={(form) => {
                        this.form = form
                    }}>
                        <Form.Item label='角色名称' name='name' rules={[
                            {
                                required: true,
                                message: '角色名称不能为空！'
                            },
                            () => {
                                const {roles,operation} = this.state;
                                return {
                                    validator(_, value) {
                                        return new Promise((resolve, reject) => {
                                            const role =roles.find(item => item.name === value);
                                            if (role&&operation===OPERATE_TYPE.NEW) {
                                                reject('角色名称不能重复！');
                                            } else {
                                                resolve();
                                            }
                                        });
                                    }
                                }
                            }
                        ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label='角色等级' name='level' rules={[
                            {
                                required: true,
                                message: '角色等级不能为空，且必须为数字！',
                                pattern: /^[0-9]*$/
                            }
                        ]}>
                            <Input placeholder='请输入数字'
                                   addonAfter={<Tooltip title='数字越小等级越高'><QuestionCircleOutlined/></Tooltip>}/>
                        </Form.Item>
                        <Form.Item label='角色权限' name='permission'>
                            <TreeSelect treeData={this.state.permissionList} treeCheckable/>
                        </Form.Item>
                        <Form.Item label='云盘空间' name='cloud_storage' initialValue={0} rules={[
                            {
                                required: true,
                                message: '请输入数字！',
                                pattern: /^[0-9]*$/
                            }
                        ]}>
                            <Input addonAfter='GB'/>
                        </Form.Item>
                        <Form.Item wrapperCol={{offset: 5, span: 18}}>
                            <Button type='primary' block
                                    htmlType='submit'>{this.state.operation === OPERATE_TYPE.UPDATE ?
                                <span>修&emsp;&emsp;改</span> : <span>创&emsp;&emsp;建</span>}</Button>
                        </Form.Item>
                        <Form.Item wrapperCol={{offset: 5, span: 18}}>
                            <Button block onClick={this.resetFrom}>重&emsp;&emsp;置</Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className={style.right}>
                    <p>角色列表</p>
                    {
                        this.state.loading ? <Spin style={{width: '100%'}} tip='正在获取角色信息，请稍候...'/> :
                            <Table locale={{emptyText: '角色可以帮助您更好的管理成员，请先创建角色！'}} dataSource={this.state.roles}>
                                <Column title='角色名称' dataIndex='name' align='center' width='20%'/>
                                <Column title='角色等级' dataIndex='level' align='center' width='20%'
                                        render={(text) => (<span>LV{text}</span>)}/>
                                <Column title='角色权限' dataIndex='permission' align='center' width='20%' ellipsis
                                        render={(text) => {
                                            let str = '';
                                            for (let i = 0; i < text.length; i++) {
                                                const permission = this.state.permissionList.find(item => item.code === text.charAt(i));
                                                if (i === text.length - 1) {
                                                    str += permission.title;
                                                } else {
                                                    str += permission.title + '|';
                                                }

                                            }
                                            return (<span>{str}</span>);
                                        }}/>
                                <Column title='云盘空间' dataIndex='cloud_storage' align='center' width='20%'
                                        render={(text) => (<span>{text}GB</span>)}/>
                                <Column title='快速操作' dataIndex='option' align='center' width='20%'
                                        render={(_, record) => (<Space size={20}>
                                            <Button icon={<EditOutlined/>} type='link' title='修改'
                                                    onClick={this.editRoleInfo(record)}/>
                                            <Button icon={<CopyOutlined/>} onClick={this.copyRoleInfo(record)} type='link' title='复制'/>
                                            <Button icon={<DeleteOutlined/>} type='link' title='删除' onClick={this.deleteRole(record)}/>
                                        </Space>)}/>
                            </Table>
                    }

                </div>
            </div>
        );
    }
}

export default Role;