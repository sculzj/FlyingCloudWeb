import React, {PureComponent} from 'react';
import {Form, Input, Tabs, Checkbox, Button, PageHeader} from "antd";
import {withRouter} from "react-router";
import QRcode from 'qrcode.react';

import loginStyle from './index.module.css';
import {LockOutlined, ScanOutlined, UserOutlined, VerifiedOutlined} from "@ant-design/icons";
import RandomCode from "../RandomCode";
import {nanoid} from "nanoid";

const {TabPane} = Tabs;

class Login extends PureComponent {

    /**
     * 初始化填充规则与激活选项卡
     * @type {{autoComplete: string, active: string}}
     */
    state={autoComplete:'off',active:'id'}

    /**
     * 切换id登录和二维码登录选项卡面板
     */
    toggleTab=()=> {
        if (this.state.active==='id'){
            this.setState({active:'code'});
        }else {
            this.setState({active:'id'});
        }
    }

    /**
     * 企业成员登录处理函数
     */
    loginWithMember=()=>{
        console.log(this.memberForm.getFieldsValue());
    }

    /**
     * 企业管理员登录处理函数
     */
    loginWithAdmin=()=>{

    }

    render() {
        return (
            <div className={loginStyle.login}>
                <Tabs tabBarStyle={{height:'0'}} activeKey={this.state.active} animated={{inkBar: true, tabPane: true}}>
                    <TabPane key='id'>
                        <Tabs type='card' size='large' animated={{inkBar: true, tabPane: true}} style={{height: '400px'}}>
                            <TabPane tab='企业成员登录' key='member'>
                                <Form wrapperCol={{span: 24}} style={{marginTop: '10px'}} ref={(element)=>{this.memberForm=element}}>
                                    <Form.Item name='identity' hasFeedback rules={[
                                        {
                                            required: true,
                                            type: 'string',
                                            pattern: /^[A-Za-z0-9]{3,8}$/,
                                            message: '企业标识为3~8位数字或字母'
                                        }
                                    ]}>
                                        <Input prefix={<VerifiedOutlined/>} placeholder='请输入企业标识' autoComplete={this.state.autoComplete==='off'?'off':'organization'}/>
                                    </Form.Item>
                                    <Form.Item name='uid' hasFeedback rules={[
                                        {
                                            required: true,
                                            type: 'string',
                                            pattern: /^[A-Za-z0-9]{8,16}$/,
                                            message: '登录账号为8~16位数字或字母'
                                        }
                                    ]}>
                                        <Input prefix={<UserOutlined/>} placeholder='请输入登录账号' autoComplete='username'/>
                                    </Form.Item>
                                    <Form.Item name='pwd'>
                                        <Input.Password prefix={<LockOutlined/>} placeholder='请输入登录密码'
                                                        autoComplete='current-password'/>
                                    </Form.Item>
                                    <Form.Item>
                                        <div style={{float: 'left'}}>
                                            <Checkbox>记住密码</Checkbox>
                                        </div>
                                        <div style={{float: 'right'}}>
                                            <Checkbox>自动登录</Checkbox>
                                        </div>
                                    </Form.Item>
                                    <Form.Item style={{marginBottom:'0'}}>
                                        <Form.Item name='random' style={{display:'inline-block',width:'205px'}}>
                                            <Input placeholder='请输入验证码' style={{width: '205px'}}/>
                                        </Form.Item>
                                        <Form.Item style={{display:'inline-block',width: '130px',marginLeft:'5px'}}>
                                            <RandomCode height={32}/>
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type='primary' block onClick={this.loginWithMember}>登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>
                            <TabPane tab='企业管理员登录' key='admin'>
                                <Form wrapperCol={{span: 24}} style={{marginTop: '10px'}} ref={(element)=>{this.adminForm=element}}>
                                    <Form.Item name='uid' style={{marginBottom:'40px'}} hasFeedback rules={[
                                        {
                                            required: true,
                                            type: 'string',
                                            pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                                            message: '登录账号不合法，必须为邮箱！'
                                        }
                                    ]}>
                                        <Input prefix={<UserOutlined/>} placeholder='请输入登录邮箱' autoComplete='username'/>
                                    </Form.Item>
                                    <Form.Item name='pwd' style={{marginBottom: '30px'}}>
                                        <Input.Password prefix={<LockOutlined/>} placeholder='请输入登录密码'
                                                        autoComplete='current-password'/>
                                    </Form.Item>
                                    <Form.Item style={{marginBottom:'0px'}}>
                                        <Form.Item style={{display:'inline-block',float: 'left'}}>
                                            <Checkbox>记住密码</Checkbox>
                                        </Form.Item>
                                        <Form.Item style={{display:'inline-block',float: 'right'}}>
                                            <Checkbox>自动登录</Checkbox>
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item style={{marginBottom:'10px'}}>
                                        <Form.Item  name='msgCode' style={{display:'inline-block',width:'205px',float:'left'}}>
                                            <Input placeholder='请输入验证码'/>
                                        </Form.Item >
                                        <Form.Item style={{display:'inline-block',width:'130px',float:'right'}}>
                                            <Button type='default' block>获取验证码</Button>
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type='primary' block onClick={this.loginWithAdmin}>登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>
                        </Tabs>
                        <div style={{height: '60px'}}>
                            <div style={{float: 'left'}}><a style={{color: 'black'}}>找回密码</a></div>
                            <div style={{float: 'right'}}><a style={{color: 'black'}}>找回密码</a></div>
                            <div style={{textAlign: 'right', clear: 'both', paddingTop: '15px'}}>
                                <ScanOutlined style={{fontSize: '20px'}} onClick={this.toggleTab}/>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane key='code'>
                        <div style={{width:'340px',height:'400px'}}>
                            <PageHeader title='返回' onBack={this.toggleTab} style={{marginLeft:'0',paddingLeft:'0'}}/>
                            <div style={{width:'340px',textAlign:'center',marginTop:'30px'}}>
                                <QRcode value={nanoid()} level='H' size={200}/>
                                <p style={{marginTop:'50px'}}>请使用飞云互联APP扫描二维码登录</p>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default withRouter(Login);
