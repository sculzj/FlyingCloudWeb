// noinspection TypeScriptUMDGlobal,JSValidateTypes

import React, {Component} from 'react';
import {AutoComplete, Button, Form, Input, message, Radio, Space, Spin, Tabs, TreeSelect, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";

import Store from "../../../../redux/store";
import addMemberStyle from './index.module.css';
import {serverIP, SEX} from "../../../../resource/constant";
import axios from "axios";

const {TabPane} = Tabs;
const {store} = Store;

class AddMembers extends Component {

    constructor(props) {
        super(props);
        this.state = {loading: true, orgs: [], roles: [], candidate: []};
        this.getOrgs();
    }

    /**
     * 从服务器获取组织信息
     */
    getOrgs = () => {
        axios({
            method: 'get',
            url: `${serverIP}/api/orgsInfo`,
            headers: {authorization: store.getState().token}
        }).then(response => {
            const {orgsInfo} = response.data;
            this.getRolesInfo(orgsInfo);
        }).catch(err => {
            message.error('组织信息获取失败，请联系系统管理员！').then();
            console.log(err);
        });
    }

    /**
     * 从服务器获取角色信息
     */
    getRolesInfo = (orgsInfo) => {
        axios({
            method: 'get',
            url: `${serverIP}/api/role`,
            headers: {authorization: store.getState().token}
        }).then(response => {
            const {roles} = response.data;
            const rolesData = roles.map(role => ({
                key: role.name,
                value: role.name,
                title: role.name,
            }));
            this.setState({loading: false, orgs: this.transDateToTreeSelect(orgsInfo), roles: rolesData})
        }).catch(err => {
            message.error('角色信息获取失败，请联系系统管理员！').then();
            console.log(err);
        });
    }

    /**
     * 生成树选择输入节点
     * @param orgsInfo 基础组织信息
     * @returns {*[]} 树选择数据
     */
    transDateToTreeSelect = (orgsInfo) => {
        const orgs = [];
        const copy = orgsInfo.map(item => {
            const tmp = {};
            tmp.title = item.name;
            tmp.value = item.code;
            tmp.parentCode = item.parentCode;
            return tmp;
        });
        for (let i = 0; i < copy.length; i++) {
            if (copy[i].parentCode) {
                for (let j = i + 1; j < copy.length; j++) {
                    if (copy[j].value === copy[i].parentCode) {
                        if (!copy[j].children) {
                            copy[j].children = [];
                        }
                        copy[j].children.push(copy[i]);
                        break;
                    }
                }
            }
            if (i === copy.length - 1) {
                orgs.push(copy[i]);
            }
        }
        return orgs;
    }


    /**
     * 获取候选用户列表
     */
    getCandidate = (value) => {
        console.log(value);
        if (value.length < 2) {
            return;
        }
        axios({
            url: `${serverIP}/api/candidate`,
            method: 'get',
            params: {key: value},
            headers: {authorization: store.getState().token}
        }).then(response => {
            const {users} = response.data;
            users.forEach(user => {
                user.label = user.name;
                user.value = user.name;
            });
            this.setState({candidate: users});
        }).catch();
    }

    /**
     * 提交用户注册信息
     * @param values 表单数据
     */
    createUser = (values) => {
        values.jobNum=values.jobNum?Number.parseInt(values.jobNum):null;
        // noinspection JSCheckFunctionSignatures
        values.phone=Number.parseInt(values.phone);
        values.shortPhone=values.shortPhone?Number.parseInt(values.shortPhone):null;
        values.email=values.email?values.email:null;
        values.leader=values.leader?values.leader:null;
        axios({
            url: `${serverIP}/api/user`,
            method: 'post',
            data: values,
            headers: {authorization: store.getState().token}
        }).then(()=>{
            message.success('成员创建成功！').then();
            this.form.resetFields();
        }).catch(err=>{
            console.log(err);
            message.error('成员创建失败！').then();
        });
    }

    /**
     * 根据选择的组织节点添加组织名称属性（隐藏）
     * @param _
     * @param node 选中的树节点
     */
    setOrgName = (_, node) => {
        this.form.setFields([{name: 'orgName', value: node.title}]);
    }

    render() {
        return (
            <div className={addMemberStyle.container}>
                {
                    this.state.loading ?
                        <Spin tip='正在初始化资源，请稍候...' style={{width: '100%'}}/> :
                        <Tabs defaultActiveKey='singal'>
                            <TabPane tab='单个添加' key='singal'>
                                <Form labelCol={{span: 7}} wrapperCol={{span: 10}} validateTrigger={'onBlur'}
                                      onFinish={this.createUser} ref={(form) => {
                                    this.form = form
                                }}>
                                    <Form.Item label='登录账号' name='uid' hasFeedback validateFirst rules={[
                                        {
                                            required: true,
                                            message: '输入不合法！',
                                            pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$|^[A-Za-z0-9]{4,24}$/
                                        },
                                        () => ({
                                            validator(_, value) {
                                                return new Promise((resolve, reject) => {
                                                    axios({
                                                        method: 'get',
                                                        url: `${serverIP}/api/uid`,
                                                        params: {uid: value},
                                                        headers: {authorization: store.getState().token}
                                                    }).then(response => {
                                                        // console.log(response.data);
                                                        if (response.data.uid.length) {
                                                            reject('该账号已存在，请重新输入！');
                                                        } else {
                                                            resolve();
                                                        }
                                                    }).catch(err => {
                                                        reject(err.message, '系统错误，请重新尝试！');
                                                    });
                                                });
                                            }
                                        })
                                    ]}>
                                        <Input placeholder='最长24位字符并保持唯一'/>
                                    </Form.Item>
                                    <Form.Item label='工&emsp;&emsp;号' name='jobNum' hasFeedback validateFirst rules={[
                                        {
                                            message: '输入不合法！',
                                            pattern: /^\d{1,8}$/
                                        },
                                        () => ({
                                            validator(_, value) {
                                                return new Promise((resolve, reject) => {
                                                    axios({
                                                        method: 'get',
                                                        url: `${serverIP}/api/jobNum`,
                                                        params: {jobNum: value},
                                                        headers: {authorization: store.getState().token}
                                                    }).then(response => {
                                                        if (response.data.jobNum.length) {
                                                            reject('该工号已存在，请重新输入！');
                                                        } else {
                                                            resolve();
                                                        }
                                                    }).catch(err => {
                                                        reject(err, '系统错误，请重新尝试！');
                                                    })
                                                });
                                            }
                                        })
                                    ]}>
                                        <Input placeholder='最长8位数字并保持唯一'/>
                                    </Form.Item>
                                    <Form.Item label='姓&emsp;&emsp;名' name='name' hasFeedback validateFirst rules={[
                                        {
                                            required: true,
                                            message: '请输入姓名！'
                                        },
                                        () => ({
                                                validator(_, value) {
                                                    return new Promise((resolve, reject) => {
                                                        axios({
                                                            method: 'get',
                                                            url: `${serverIP}/api/userName`,
                                                            params: {name: value},
                                                            headers: {authorization: store.getState().token}
                                                        }).then(response => {
                                                            // console.log(response.data);
                                                            if (response.data.name.length) {
                                                                reject('该姓名已存在，请重新输入！');
                                                            } else {
                                                                resolve();
                                                            }
                                                        }).catch(err => {
                                                            reject(err.message, '系统错误，请重新尝试！');
                                                        });
                                                    });
                                                }
                                            }
                                        )
                                    ]}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item label='性&emsp;&emsp;别' name='sex' required>
                                        <Radio.Group>
                                            <Space size={40}>
                                                <Radio value={SEX.MAN}>男</Radio>
                                                <Radio value={SEX.WOMAN}>女</Radio>
                                            </Space>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label='电&emsp;&emsp;话' name='phone' rules={[
                                        {
                                            required: true,
                                            len: 11,
                                            pattern: /^\d{11}$/,
                                            message: '输入不合法！'
                                        }
                                    ]}>
                                        <Input placeholder='11位长度的电话号码'/>
                                    </Form.Item>
                                    <Form.Item label='短&emsp;&emsp;号' name='shortPhone'>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item label='邮&emsp;&emsp;箱' name='email' rules={[
                                        {
                                            type: 'email',
                                            message: '输入不合法！'
                                        }
                                    ]}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item label='归属组织' name='orgCode' initialValue='001' rules={[
                                        {
                                            required: true,
                                            message: '组织不能为空！'
                                        }
                                    ]}>
                                        <TreeSelect treeData={this.state.orgs} onSelect={this.setOrgName}/>
                                    </Form.Item>
                                    <Form.Item name='orgName' label='组织名称' hidden>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item label='角&emsp;&emsp;色' name='post' rules={[
                                        {
                                            required: true,
                                            message: '角色不能为空！'
                                        }
                                    ]}>
                                        <TreeSelect treeData={this.state.roles} placeholder='请选择角色属性'/>
                                    </Form.Item>
                                    <Form.Item name='leader' label='直接上级' rules={[
                                        () => {
                                            const self = this;
                                            return {
                                                validator(_, value) {
                                                    return new Promise((resolve, reject) => {
                                                        if (!value) {
                                                            resolve();
                                                            return;
                                                        }
                                                        const user = self.state.candidate.find(item => item.value === value);
                                                        if (!user) {
                                                            reject('直接上级用户不存在！');
                                                        } else {
                                                            resolve();
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    ]}>
                                        <AutoComplete notFoundContent='未查找到成员，请至少输入2个字符' options={this.state.candidate}
                                                      placeholder='通过名称或账号进行搜索'>
                                            <Input.Search onSearch={this.getCandidate}/>
                                        </AutoComplete>
                                    </Form.Item>
                                    <Form.Item wrapperCol={{offset: 7, span: 10}}>
                                        <Button block type='primary' htmlType='submit'>确&emsp;&emsp;定</Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>
                            <TabPane tab='批量添加' key='batch'>
                                <Form labelCol={{span: 7}} wrapperCol={{span: 10}}>
                                    <Form.Item label='导入文件'>
                                        <Upload accept='.xlsx,.xls' action={`${serverIP}/api/batchAddMembers`}
                                                headers={{authorization: store.getState().token}} name='tmpFile'>
                                            <Button icon={<UploadOutlined/>}>浏览本地文件目录</Button>
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item label='下载模板'><a
                                        href={require('../../../../resource/common/成员批量添加数据模板.xlsx').default}
                                        download='成员批量添加数据模板.xlsx'>成员批量添加数据模板.xsxl</a></Form.Item>
                                </Form>
                            </TabPane>
                        </Tabs>
                }
            </div>
        );
    }
}

export default AddMembers;
