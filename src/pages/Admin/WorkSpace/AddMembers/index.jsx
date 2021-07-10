import React, {Component} from 'react';
import {Button, Form, Input, Tabs, TreeSelect, Upload} from "antd";
import {DownloadOutlined, UploadOutlined} from "@ant-design/icons";

import Store from "../../../../redux/store";
import addMemberStyle from './index.module.css';

const {TabPane} = Tabs;
const {store} = Store;

class AddMembers extends Component {
    render() {
        return (
            <div className={addMemberStyle.container}>
                <Tabs defaultActiveKey='singal'>
                    <TabPane tab='单个添加' key='singal'>
                        <Form labelCol={{span: 7}} wrapperCol={{span: 10}}>
                            <Form.Item label='登录账号'><Input/></Form.Item>
                            <Form.Item label='归属组织'><TreeSelect/></Form.Item>
                            <Form.Item label='组织角色'><TreeSelect/></Form.Item>
                            <Form.Item label='职位名称'><Input/></Form.Item>
                            <Form.Item wrapperCol={{offset: 7, span: 10}}><Button block
                                                                                  type='primary'>确定</Button></Form.Item>
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
