import React, {Component} from 'react';
import {Avatar, Button, Form, Input, Modal, Select,message} from "antd";
import {DesktopOutlined, SettingOutlined} from "@ant-design/icons";
import axios from "axios";


import navStyle from './index.module.css';
import Store from '../../../../redux/store';
import {withRouter} from "react-router";

const {Option} = Select;
const {store} = Store;

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = ({visible: false, questions: [], selects: [], loading: false});
    }

    componentDidMount() {
        const {init} = store.getState().userinfo;
        if (!init) {
            axios({
                url: 'http://localhost:3000/api/questions',
                method: 'get'
            }).then(response => {
                // console.log(response.data);
                this.setState({visible: true, questions: response.data});
            }).catch(() => {

            });
        }
    }

    toSelect = (value) => {
        this.state.selects.push(value);
        this.setState({}, () => {
            // console.log(this.state);
        });
    }

    toModifyPwd = () => {
        this.setState({loading:true},()=>{
            const data=this.form.getFieldsValue();
            delete data.configPwd;
            data.uid=store.getState().userinfo.uid;
            const timer=setTimeout(()=>{
                this.setState({loading:false},()=>{
                    clearTimeout(timer);
                    Modal.error({
                        title:'错误',
                        content:'网络连接超时，请检查网络配置并重新尝试！'
                    });
                });
            },15000);
            axios({
                url:'http://localhost:3000/api/initSysPwd',
                method:'post',
                data:data
            }).then(response=>{
                clearTimeout(timer);
                this.setState({visible:false,loading:false},()=>{
                    message.success('账号初始化成功，即将跳转到登录界面，请重新登录！').then(()=>{
                        this.props.history.replace('/system');
                    });
                })
            }).catch(()=>{

            })
        })
    }

    render() {

        return (
            <div className={navStyle.frame}>
                <div className={navStyle.left}>
                    <img src={require('../../../../images/logoH.png').default} alt=''/>
                </div>
                <div className={navStyle.right}>
                    <div className={navStyle.user}>
                        <Avatar src={require('../../../../images/admin.png').default} alt='资源获取失败'
                                className={navStyle.icon}/>
                        <span className={navStyle.id}>{store.getState().userinfo.uid}</span>
                        <SettingOutlined title='快速设置' className={navStyle.set}/>
                        <DesktopOutlined title='返回主页' className={navStyle.set}/>
                    </div>
                </div>
                <Modal visible={this.state.visible} title='账号初始化' footer={null} closable={false}>
                    <Form labelCol={{span: 5}} wrapperCol={{span: 17}} validateTrigger='onBlur' ref={element => {
                        this.form = element
                    }} onFinish={this.toModifyPwd}>
                        <Form.Item label='请输入密码' name='pwd' hasFeedback rules={[
                            {
                                required: true,
                                type: 'string',
                                pattern: /^[A-Za-z0-9]{7,16}$/,
                                message: '密码为8~16位数字或字母的组合'
                            }
                        ]}>
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item label='请确认密码' name='configPwd' hasFeedback rules={[
                            {
                                required: true,
                                message: '请再次输入密码！',
                            },
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('pwd') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入密码不一致！'));
                                },
                            }),
                        ]}>
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item label='密保问题' name='question1' rules={[
                            {
                                required: true,
                                message: '请选择密保问题！'
                            }
                        ]}>
                            <Select value={this.state.selects[0] ? this.state.selects[0] : ''} onSelect={this.toSelect}>
                                {
                                    this.state.questions.map((item, index) => {
                                        if (!this.state.selects.includes(item.question)) {
                                            return (<Option value={item.question} key={index}>{item.question}</Option>);
                                        } else {
                                            return null;
                                        }
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label='输入答案' name='answer1' hasFeedback rules={[
                            {
                                required: true,
                                message: '请输入密保问题的答案！'
                            }
                        ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label='密保问题' name='question2' rules={[
                            {
                                required: true,
                                message: '请选择密保问题！'
                            }
                        ]}>
                            <Select value={this.state.selects[1] ? this.state.selects[1] : ''} onSelect={this.toSelect}>
                                {
                                    this.state.questions.map((item, index) => {
                                        if (!this.state.selects.includes(item.question)) {
                                            return (<Option value={item.question} key={index}>{item.question}</Option>);
                                        } else {
                                            return null;
                                        }
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label='输入答案' name='answer2' hasFeedback rules={[
                            {
                                required: true,
                                message: '请输入密保问题的答案！'
                            }
                        ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label='密保问题' name='question3' rules={[
                            {
                                required: true,
                                message: '请选择密保问题！'
                            }
                        ]}>
                            <Select value={this.state.selects[2] ? this.state.selects[2] : ''} onSelect={this.toSelect}>
                                {
                                    this.state.questions.map((item, index) => {
                                        if (!this.state.selects.includes(item.question)) {
                                            return (<Option value={item.question} key={index}>{item.question}</Option>);
                                        } else {
                                            return null;
                                        }
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label='输入答案' name='answer3' hasFeedback rules={[
                            {
                                required: true,
                                message: '请输入密保问题的答案！'
                            }
                        ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item wrapperCol={{offset: 5, span: 17}}>
                            <Button type='primary' htmlType='submit' loading={this.state.loading}
                                    block>提&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;交</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>

        );
    }
}

export default withRouter(Header);
