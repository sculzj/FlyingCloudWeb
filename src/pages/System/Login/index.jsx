import React, {Component} from 'react';
import {Button, Form, Input, Modal} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import axios from "axios";
import {withRouter} from "react-router";

import Store from '../../../redux/store';
import RandomCode from "../../../components/RandomCode";
import systemStyle from "./index.module.css";
import {Code} from "../../../resource/constant";
import {saveUserInfo} from "../../../redux/actions/byUserInfo";
import {saveToken} from "../../../redux/actions/byToken";

const {store} = Store;

class Login extends Component {

    state = {loading: false};

    toLogin = () => {
        if (this.form.getFieldValue('code').toLocaleLowerCase() !== store.getState().code.toLocaleLowerCase()) {
            Modal.error({
                title: '错误',
                content: '验证码有误，请重新输入！'
            });
        } else {
            const {uid, pwd} = this.form.getFieldsValue();
            this.setState({loading: true});
            //等待15S后超时
            const timer = setTimeout(() => {
                this.setState({loading: false}, () => {
                    Modal.error({
                        title: '错误',
                        content: '网络连接超时！请检查您的网络配置，并尝试再次登录。'
                    })
                })
            }, 15000);
            axios({
                url: 'http://localhost:3000/api/system',
                method: 'post',
                data: {uid, pwd}
            }).then(response => {
                //清除定时器
                clearTimeout(timer);
                console.log(response.data);
                switch (response.data.code) {
                    case Code.error:
                        Modal.error({title: '错误', content: '登录失败，该账号不存在，请检查登录账号及密码是否正确！'});
                        break;
                    case Code.success:
                        store.dispatch(saveUserInfo(response.data.userObj));
                        store.dispatch(saveToken(response.data.token));
                        this.props.history.replace('/system/home');
                        // console.log(store.getState().userInfo);
                        break;
                    default:
                        break;
                }
            }).catch(e => {
                // console.log(e);
                Modal.error({title: '错误', content: e});
            });
        }
    }

    render() {
        return (
            <div className={systemStyle.frame}>
                <img src={require('../../../images/system_back.jpg').default} className={systemStyle.back} alt=''/>
                <div className={systemStyle.content}>
                    <h3>系统管理员登录</h3>
                    <Form wrapperCol={{span: 24}} validateTrigger='onBlur' onFinish={this.toLogin}
                          ref={element => {
                              this.form = element
                          }} className={systemStyle.form}>
                        <Form.Item name='uid' className={systemStyle.item} hasFeedback rules={[
                            {
                                required: true,
                                type: 'string',
                                pattern: /^[A-Za-z0-9]{6,16}$/,
                                message: '账号必须位7~16位字母或数字的组合'
                            }
                        ]}>
                            <Input prefix={<UserOutlined/>} placeholder='请输入登录账号'/>
                        </Form.Item>
                        <Form.Item name='pwd' className={systemStyle.item}>
                            <Input.Password prefix={<LockOutlined/>} placeholder='请输入登录密码'/>
                        </Form.Item>
                        <Form.Item className={systemStyle.Item}>
                            <Form.Item className={systemStyle.left} name='code'>
                                <Input placeholder='请输入验证码'/>
                            </Form.Item>
                            <Form.Item className={systemStyle.right}>
                                <RandomCode height={30}/>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item>
                            <Button block type='primary' htmlType='submit' loading={this.state.loading}
                                    className={systemStyle.btu}>登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</Button>
                        </Form.Item>
                    </Form>
                    <div className={systemStyle.link}>
                        <a href='/system/resetPwd'>忘记密码</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);
