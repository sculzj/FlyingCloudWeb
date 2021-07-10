import React, {Component} from 'react';
import {Button, Form, Input, Result, Steps} from "antd";

import resetStyle from './index.module.css';
import RandomCode from "../../../components/RandomCode";

const {Step} = Steps;

class ResetPwd extends Component {

    state = {current: 0}

    toNext = () => {
        const {current} = this.state;
        this.setState({current: current + 1});
    }

    render() {
        return (
            <div className={resetStyle.frame}>
                <h3>找回密码</h3>
                <Steps current={this.state.current}>
                    <Step title='账号校验' disabled description='输入登录账号'/>
                    <Step title='密码校验' disabled description='请输入密保答案'/>
                    <Step title='设置密码' disabled description='请设置新密码'/>
                    <Step title='完成' disabled/>
                </Steps>
                <div className={resetStyle.content}>
                    {
                        this.state.current === 0 && (
                            <Form labelCol={{span: 6}} wrapperCol={{span: 14}}>
                                <Form.Item label='请输入账号' name='uid' style={{marginBottom: '40px'}}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label='请输入验证码' style={{marginBottom: '20px'}}>
                                    <Form.Item name='code'
                                               style={{display: 'inline-block', width: '330px', float: 'left'}}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item
                                        style={{
                                            display: 'inline-block',
                                            width: '130px',
                                            float: 'right',
                                            height: '30px'
                                        }}>
                                        <RandomCode height={30}/>
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item wrapperCol={{offset: 6, span: 14}}>
                                    <Button type='primary' onClick={this.toNext}
                                            block>下&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;步</Button>
                                </Form.Item>
                            </Form>
                        )
                    }
                    {
                        this.state.current === 1 && (
                            <Form labelCol={{span: 6}} wrapperCol={{span: 14}}>
                                <Form.Item label='密保问题1：' name='question1' style={{marginBottom: '40px'}}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label='请输入答案：' name='answer1' style={{marginBottom: '40px'}}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label='密保问题2：' name='question2' style={{marginBottom: '40px'}}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label='请输入答案：' name='answer2' style={{marginBottom: '40px'}}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label='密保问题3：' name='question3' style={{marginBottom: '40px'}}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label='请输入答案：' name='answer3' style={{marginBottom: '40px'}}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item wrapperCol={{offset: 6, span: 14}}>
                                    <Button type='primary' onClick={this.toNext}
                                            block>下&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;步</Button>
                                </Form.Item>
                            </Form>
                        )
                    }
                    {
                        this.state.current === 2 && (
                            <Form labelCol={{span: 6}} wrapperCol={{span: 14}}>
                                <Form.Item label='请输入新的密码：' name='pwd' style={{marginBottom: '40px'}}>
                                    <Input.Password/>
                                </Form.Item>
                                <Form.Item label='请再次输入密码：' name='pwdConfig' style={{marginBottom: '40px'}}>
                                    <Input.Password/>
                                </Form.Item>
                                <Form.Item wrapperCol={{offset: 6, span: 14}}>
                                    <Button type='primary' block
                                            onClick={this.toNext}>提&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;交</Button>
                                </Form.Item>
                            </Form>
                        )
                    }
                    {
                        this.state.current === 3 && (
                            <Result status="success" title="密码重置成功！"
                                    subTitle="已完成密码重置，您可以点击下方按钮跳转到登录界面，也可以等待X秒后自动跳转！"
                                    extra={[<Button type="primary" key="login">登录</Button>]}/>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default ResetPwd;
