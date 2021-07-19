import React, {Component} from 'react';
import {Button, Form, Input, Radio, Space, Tabs, TreeSelect, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";

import Store from "../../../../redux/store";
import addMemberStyle from './index.module.css';
import {SEX} from "../../../../resource/constant";

const {TabPane} = Tabs;
const {store} = Store;

class AddMembers extends Component {
    render() {
        return (
            <div className={addMemberStyle.container}>
                <Tabs defaultActiveKey='singal'>
                    <TabPane tab='单个添加' key='singal'>
                        <Form labelCol={{span: 7}} wrapperCol={{span: 10}}>
                            <Form.Item label='工&emsp;&emsp;号' name='jobNum'>
                                <Input placeholder='请输入最长8位的唯一数字'/>
                            </Form.Item>
                            <Form.Item label='登录账号' name='uid'>
                                <Input placeholder='账号最长16位并保持唯一'/>
                            </Form.Item>
                            <Form.Item label='姓&emsp;&emsp;名' name='name'>
                                <Input/>
                            </Form.Item>
                            <Form.Item label='性&emsp;&emsp;别' name='sex'>
                                <Radio.Group>
                                    <Space size={40}>
                                        <Radio value={SEX.MAN}>男</Radio>
                                        <Radio value={SEX.WOMAN}>女</Radio>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label='电&emsp;&emsp;话' name='phone'>
                                <Input placeholder='11位长度的电话号码'/>
                            </Form.Item>
                            <Form.Item label='短&emsp;&emsp;号' name='shortPhone'>
                                <Input/>
                            </Form.Item>
                            <Form.Item label='邮&emsp;&emsp;箱' name='shortPhone'>
                                <Input/>
                            </Form.Item>
                            <Form.Item label='归属组织' name='department'>
                                <TreeSelect/>
                            </Form.Item>
                            <Form.Item label='组织角色' name='role'>
                                <Radio.Group>
                                    <Space size={40}>
                                        <Radio value=''>一级管理</Radio>
                                        <Radio value=''>二级管理</Radio>
                                        <Radio value=''>普通职员</Radio>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label='职位名称' name='post'>
                                <Input/>
                            </Form.Item>
                            <Form.Item wrapperCol={{offset: 7, span: 10}}
                            ><Button block type='primary'>确定</Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                    <TabPane tab='批量添加' key='batch'>
                        <Form labelCol={{span: 7}} wrapperCol={{span: 10}}>
                            <Form.Item label='导入文件'>
                                <Upload accept='.xlsx,.xls' action='http://localhost:3000/api/batchAddMembers'
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
            </div>
        );
    }
}

export default AddMembers;
