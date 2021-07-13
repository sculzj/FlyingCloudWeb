import React, {Component} from 'react';
import {Checkbox, ConfigProvider, DatePicker, Form, Input, Space} from "antd";
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';


import addStyle from './index.module.css';

moment.locale('zh-cn');
const {RangePicker} = DatePicker;

class AddUser extends Component {

    disabledDate = (current) => {
        return current && current < moment().endOf('day');
    }

    render() {
        return (
            <div className={addStyle.box}>
                <h3 className={addStyle.title}>添加系统管理员账户</h3>
                <Form labelCol={{span: 5}} wrapperCol={{span: 15}}>
                    <Form.Item label='登录账号'>
                        <Input/>
                    </Form.Item>
                    <Form.Item label='初始密码'>
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item label='确认密码'>
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item label='联系电话'>
                        <Input placeholder='移动电话用于登录验证'/>
                    </Form.Item>
                    <Form.Item label='权限分配' className={addStyle.topItem}>
                        <Space size={19}>
                            <Form.Item className={addStyle.item}><Checkbox>数据看板</Checkbox></Form.Item>
                            <Form.Item className={addStyle.item}><Checkbox>企业审批</Checkbox></Form.Item>
                            <Form.Item className={addStyle.item}><Checkbox>用户管理</Checkbox></Form.Item>
                            <Form.Item className={addStyle.item}><Checkbox>消息推送</Checkbox></Form.Item>
                            <Form.Item className={addStyle.item}><Checkbox>移动登录</Checkbox></Form.Item>
                            <Form.Item className={addStyle.item}><Checkbox>企业审批</Checkbox></Form.Item>
                        </Space>
                    </Form.Item>
                    <Form.Item label='用户有效期'>
                        <RangePicker disabledDate={this.disabledDate} className={addStyle.date}/>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default () => (
    <ConfigProvider locale={zhCN}>
        <AddUser/>
    </ConfigProvider>
);