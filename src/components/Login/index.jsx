import React, {Component} from 'react';
import {Form, Input, Tabs, Checkbox, Button, PageHeader, Modal, Image} from "antd";
import {withRouter} from "react-router";
import QRcode from 'qrcode.react';
import axios from "axios";
import {nanoid} from "nanoid";
import {LockOutlined, ScanOutlined, UserOutlined, VerifiedOutlined} from "@ant-design/icons";
import MD5 from "MD5";

import RandomCode from "../RandomCode";
import Store from "../../redux/store";
import {Code, serverIP, Status} from "../../resource/constant";
import loginStyle from './index.module.css';
import {saveToken} from "../../redux/actions/byToken";

const {TabPane} = Tabs;
const {store} = Store;

class Login extends Component {

    /**
     * 初始化填充规则与激活选项卡
     * @type {{autoComplete: string, random: string, QRSatus: string, loading: boolean, actived: string}}
     * actived--激活的Tab类型，loading--按钮加载状态，random--二维码字符串，QRCode--二维码状态
     */
    state = {autoComplete: 'off', actived: 'id', dataLoading: false, random: '', QRSatus: ''}
    timer = 0;

    /**
     * 切换id登录和二维码登录选项卡面板
     */
    toggleTab = () => {
        if (this.state.actived === 'id') {
            this.setState({actived: 'code', random: nanoid(16)}, () => {
                this.roundCodeState();
            });
        } else {
            this.setState({actived: 'id'});
            clearInterval(this.timer);
        }
    }

    /**
     * 用户登录处理函数
     */
    loginToServer = () => {
        const result = this.loginForm.getFieldsValue();
        console.log(result);
        if (!result.uid || !result.pwd || !result.random) {
            Modal.error({title: '错误', content: '请输入账号、密码以及验证码！'});
            return;
        }
        if (result.random.toLowerCase() !== store.getState().code.toLowerCase()) {
            Modal.error({title: '错误', content: '验证码错误，请重新输入！'});
            return;
        }
        this.setState({loading: true});
        axios({
            url: `${serverIP}/api/login`,
            method: 'post',
            data: {uid: result.uid, pwd: MD5(result.pwd), admin: !!result.admin, identity: result.identity}
        }).then(response => {
            if (response.data.code === Code.success) {
                store.dispatch(saveToken(response.data.token));
                this.props.history.replace(`/${result.admin ? 'admin' : 'home'}`);
            } else {
                Modal.error({
                    title: '登录失败',
                    content: response.data.msg,
                    afterClose: () => {
                        this.setState({loading: false});
                    }
                });
            }
        }).catch(err => {
            Modal.error({
                title: '登录失败',
                content: '登录失败，请检查输入的账户信息后再次尝试！',
                afterClose: () => {
                    this.setState({loading: false});
                }
            });
            console.log(err);
        });
    }

    /**
     * 轮巡二维码状态，间隔1S
     */
    roundCodeState = () => {
        this.setState({QRSatus:Status.waiting});
        let num = 1;
        this.timer = setInterval(() => {
            axios(
                {
                    url: `${serverIP}/api/roundCodeState`,
                    method: 'post',
                    data: {random: this.state.random,valid:num < 59}
                }
            ).then(response => {
                const {status} = response.data;
                console.log('二维码状态：', status);
                switch (status) {
                    case Status.ready:
                        this.setState({QRSatus: Status.ready});
                        break;
                    case Status.refused:
                        clearInterval(this.timer);
                        this.setState({QRSatus: Status.refused});
                        break;
                    case Status.success:
                        clearInterval(this.timer);
                        store.dispatch(saveToken(response.data.token));
                        this.props.history.replace('/home');
                        break;
                    default:
                        break;
                }
            }).catch();
            num += 1;
            if (num===60){
                clearInterval(this.timer);
                this.setState({QRSatus:Status.overtime});
                this.timer=0;
            }
        }, 1000);
    }

    /**
     * 二维码超时后刷新
     */
    refreshRandom = () => {
        this.roundCodeState();
    }

    render() {
        return (
            <div className={loginStyle.login}>
                <Tabs tabBarStyle={{height: '0'}} activeKey={this.state.actived}
                      animated={{inkBar: true, tabPane: true}}>
                    <TabPane key='id'>
                        <span className={loginStyle.title}>用户登录</span>
                        <Form wrapperCol={{span: 24}} style={{marginTop: '10px'}} validateTrigger='onBlur'
                              ref={(element) => {
                                  this.loginForm = element
                              }}>
                            <Form.Item name='identity' hasFeedback rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    pattern: /^[A-Za-z0-9]{3,8}$/,
                                    message: '企业标识为3~8位数字或字母'
                                }
                            ]}>
                                <Input prefix={<VerifiedOutlined/>} placeholder='请输入企业标识'
                                       autoComplete={this.state.autoComplete === 'off' ? 'off' : 'organization'}/>
                            </Form.Item>
                            <Form.Item name='uid' hasFeedback rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$|^[A-Za-z0-9]{8,16}$/,
                                    message: '登录账号为8~16位数字与字母组合或邮箱'
                                }
                            ]}>
                                <Input prefix={<UserOutlined/>} placeholder='请输入登录账号' autoComplete='username'/>
                            </Form.Item>
                            <Form.Item name='pwd'>
                                <Input.Password prefix={<LockOutlined/>} placeholder='请输入登录密码'
                                                autoComplete='current-password' rules={[
                                    {
                                        required: true,
                                        type: 'string',
                                        message: '登录密码不能为空'
                                    }]
                                }/>
                            </Form.Item>
                            <Form.Item style={{marginBottom: '0'}}>
                                <Form.Item name='savePwd' valuePropName='checked'
                                           style={{display: 'inline-block', float: 'left'}}>
                                    <Checkbox>记住密码</Checkbox>
                                </Form.Item>
                                <Form.Item name='admin' valuePropName='checked'
                                           style={{display: 'inline-block', float: 'right'}}>
                                    <Checkbox>管理员登录</Checkbox>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item style={{marginBottom: '0'}}>
                                <Form.Item name='random' style={{display: 'inline-block', width: '205px'}}>
                                    <Input placeholder='请输入验证码' style={{width: '205px'}}/>
                                </Form.Item>
                                <Form.Item style={{display: 'inline-block', width: '130px', marginLeft: '5px'}}>
                                    <RandomCode height={32}/>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item>
                                <Button type='primary' block loading={this.state.loading}
                                        onClick={this.loginToServer}>登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</Button>
                            </Form.Item>
                        </Form>
                        <div style={{height: '60px'}}>
                            <div style={{float: 'left'}}><a style={{color: 'black'}}
                                                            href='http://www.baidu.com'>找回密码</a></div>
                            <div style={{float: 'right'}}><a style={{color: 'black'}}
                                                             href='http://www.baidu.com'>找回密码</a></div>
                            <div style={{textAlign: 'right', clear: 'both', paddingTop: '15px'}}>
                                <ScanOutlined style={{fontSize: '20px'}} onClick={this.toggleTab}/>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane key='code'>
                        <div style={{width: '340px', height: '400px'}}>
                            <PageHeader title='返回' onBack={this.toggleTab} style={{marginLeft: '0', paddingLeft: '0'}}/>
                            <div style={{width: '340px', textAlign: 'center', marginTop: '30px'}}>
                                {
                                    this.state.QRSatus === Status.waiting ?
                                        <>
                                            <QRcode value={`FlyingCloud:${this.state.random}`} level='H' size={200}/>
                                            <p style={{marginTop: '50px'}}>请使用飞云互联APP扫描二维码登录</p>
                                        </> : this.state.QRSatus=== Status.ready ?
                                            <>
                                                <Image src={require('../../images/qrcode_app_ready.png').default}/>
                                                <p style={{marginTop: '50px'}}>请在飞云互联APP进行确认操作</p>*/}
                                            </> : this.state.QRSatus === Status.refused ?
                                                <>
                                                    <Image src={require('../../images/qrcode_app_refused.png').default}/>
                                                    <p style={{marginTop: '50px'}}>飞云互联APP已拒绝登录</p>*/}
                                                </> : this.state.QRSatus === Status.overtime ?
                                                    <>
                                                        <Image src={require('../../images/qrcode_overtime.png').default}/>
                                                        <p style={{marginTop: '50px'}}>
                                                            二维码已过期，请<Button type='link'
                                                                            onClick={this.refreshRandom}>刷新</Button>
                                                        </p>
                                                    </>
                                                    :
                                                    <></>
                                }
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default withRouter(Login);
