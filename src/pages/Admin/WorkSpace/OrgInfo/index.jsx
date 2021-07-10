import React, {Component} from 'react';
import {Button, Form, Image, Input, Tabs} from "antd";
import orgInfoStyle from './index.module.css';
import Store from '../../../../redux/store';
const {store}=Store;

const {TabPane} =Tabs;

class OrgInfo extends Component {
    render() {
        return (
            <div className={orgInfoStyle.container}>
                <Tabs defaultActiveKey='about'>
                    <TabPane tab='关于企业' key='about'>
                        <Form labelCol={{span:8}} wrapperCol={{span:10}}>
                            <Form.Item label='组织机构代码' name='code'><Input disabled/></Form.Item>
                            <Form.Item label='组织机构名称' name='name'><Input/></Form.Item>
                            <Form.Item label='管理员账号' name='admin'><Input disabled/></Form.Item>
                            <Form.Item label='唯一标识' name='tag'><Input disabled/></Form.Item>
                            <Form.Item label='官方站点' name='site'><Input/></Form.Item>
                            <Form.Item label='联系地址' name='address'><Input/></Form.Item>
                            <Form.Item label='联系方式' name='tel'><Input/></Form.Item>
                            <Form.Item label='企业Logo' name='logo'>
                                <Image width={320} height={40} src={require('../../../../resource/userResource/' + store.getState().userinfo.orgLogo).default} alt='' style={{background:'rgba(0,21,41)'}}/></Form.Item>
                            <Form.Item label='企业头像' name='icon'><Input/></Form.Item>
                            <Form.Item label='企业简介' name='abstract'><Input.TextArea maxLength={1024} allowClear autoSize={{minRows:3,maxRows:6}}/></Form.Item>
                        </Form>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default OrgInfo;
