import React, {Component} from 'react';
import {Button, Checkbox, Col, ConfigProvider, DatePicker, Form, Input, message, Modal, Row} from "antd";
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import axios from "axios";

import addStyle from './index.module.css';
import Store from '../../../../redux/store';
import {Code} from "../../../../resource/constant";
import UnAuth from "../../../../components/UnAuth";

moment.locale('zh-cn');
const {RangePicker} = DatePicker;
const {store} = Store;

class AddUser extends Component {

    state = {validity: {start: '', end: '', loading: false}}

    disabledDate = (current) => {
        return current < moment().startOf('day');
    }

    setValidity = (_, timeString) => {
        // console.log('1:',timeString);
        this.setState({validity: {start: timeString[0], end: timeString[1]}});
    }

    verifySysUid = () => ({
        validator(_, value) {
            return new Promise((resolve, reject) => {
                const timerId = setTimeout(reject, 15000, '网络连接超时，账号验证失败！');
                axios({
                    url: '/api/verifySysUid',
                    method: 'post',
                    data: {uid: value}
                }).then(response => {
                    if (response.data.code === Code.error) {
                        reject('该账号已存在，不允许重复注册！');
                    } else {
                        resolve();
                    }
                    clearTimeout(timerId);
                }).catch(err => {
                        reject(err.message);
                        clearTimeout(timerId);
                    }
                );
            });
        }
    })

    createSysUser = () => {
        // console.log(this.form.getFieldsValue());
        const data = this.form.getFieldsValue();
        data.view = data.permission.includes('view') ? 1 : -1;
        data.approve = data.permission.includes('approve') ? 1 : -1;
        data.userControl = data.permission.includes('userControl') ? 1 : -1;
        data.push = data.permission.includes('push') ? 1 : -1;
        data.app = data.permission.includes('app') ? 1 : -1;
        data.other = data.permission.includes('other') ? 1 : -1;
        delete data.configPwd;
        delete data.permission;
        delete data.validity;
        data.start = this.state.validity.start;
        data.end = this.state.validity.end;
        // console.log(store.getState());
        const timer = setTimeout(() => {
            this.setState({loading: false}, () => {
                Modal.error({
                    title: '错误',
                    content: '网络连接失败！请检查你的网络配置！'
                });
            });
        }, 15000);
        this.setState({loading: true});
        // console.log(store.getState())
        axios(
            {
                url: 'http://localhost:3000/api/addSysUser',
                method: 'post',
                data: {userinfo: data},
                headers: {authorization: store.getState().token}
            }
        ).then(() => {
            this.setState({loading: false}, () => {
                message.success('系统管理员账户已成功添加！').then();
                clearTimeout(timer);
            });
        }).catch(()=>{
            this.setState({loading: false}, () => {
                message.error('系统管理员账户添加失败！').then();
                clearTimeout(timer);
            });
        });
    }

    render() {
        return (


            <div className={addStyle.box}>
                {
                    !store.getState().userinfo.userControl ? <UnAuth/> :
                        <>
                            <h3 className={addStyle.title}>添加系统管理员账户</h3>
                            <Form labelCol={{span: 5}} wrapperCol={{span: 15}} validateTrigger='onBlur'
                                  onFinish={this.createSysUser} ref={(form) => {
                                this.form = form
                            }}>
                                <Form.Item label='登录账号' name='uid' hasFeedback validateFirst rules={[
                                    {
                                        required: true,
                                        type: 'string',
                                        pattern: /^[A-Za-z0-9]{8,16}$/,
                                        message: '登录账号必须为8~16位数字或字母的组合'
                                    },
                                    this.verifySysUid
                                ]}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label='初始密码' name='pwd' hasFeedback rules={[
                                    {
                                        required: true,
                                        type: 'string',
                                        pattern: /^[A-Za-z0-9]{8,16}$/,
                                        message: '登录密码必须为8~16位数字或字母的组合'
                                    }
                                ]}>
                                    <Input.Password/>
                                </Form.Item>
                                <Form.Item label='确认密码' name='configPwd' dependencies={['pwd']} hasFeedback
                                           rules={[
                                               {
                                                   required: true,
                                                   message: '请再次输入密码并确保两次密码输入一致！',
                                               },
                                               ({getFieldValue}) => ({
                                                       validator(_, value) {
                                                           if (!value || getFieldValue('pwd') === value) {
                                                               return Promise.resolve();
                                                           }
                                                           return Promise.reject('两次输入密码不一致！');
                                                       }
                                                   }
                                               )
                                           ]}>
                                    <Input.Password/>
                                </Form.Item>
                                <Form.Item label='联系电话' name='mobile' rules={[
                                    {
                                        required: true,
                                        type: 'string',
                                        pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
                                        message: '电话号码格式有误！'
                                    }
                                ]}>
                                    <Input placeholder='移动电话用于登录验证'/>
                                </Form.Item>
                                <Form.Item label='权限分配' className={addStyle.topItem} name='permission'>
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
                                <Form.Item label='用户有效期' name='validity'>
                                    <RangePicker disabledDate={this.disabledDate} className={addStyle.date}
                                                 onChange={this.setValidity}/>
                                </Form.Item>
                                <Form.Item wrapperCol={{offset: 5, span: 15}}>
                                    <Button type='primary' block loading={this.state.loading}
                                            htmlType='submit'>确&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;定</Button>
                                </Form.Item>
                            </Form>
                        </>
                }
            </div>
        );
    }
}

export default () => (
    <ConfigProvider locale={zhCN}>
        <AddUser/>
    </ConfigProvider>
);