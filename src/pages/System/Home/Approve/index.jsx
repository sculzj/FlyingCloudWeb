import React, {Component} from 'react';
import {Button, Form, Image, Input, message, Modal, Progress, Select, Space, Table} from "antd";
import {FileSearchOutlined, SisternodeOutlined} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

import Store from "../../../../redux/store";
import PdfReader from "../../../../components/PdfReader";

const {Option} = Select;
const {Column} = Table;
const {store} = Store;

class Approve extends Component {

    state = {dataSource: [], visible: false, info: {}}

    componentDidMount() {
        axios(
            {
                method: 'post',
                url: 'http://localhost:3000/api/applyOrgs',
                headers: {authorization: store.getState().token}
            }
        ).then(response => {
            const {result} = response.data;
            const dataSource = [];
            result.forEach((item) => {
                dataSource.push({
                    key: item.identity,
                    name: item.name,
                    time: moment(item.apply_time).format('YYYY-MM-DD HH:mm:ss'),
                    state: '等待审批',
                    consum: Math.floor((new Date().getTime() - new Date(item.apply_time).getTime()) / 1000 / 60 / 60),
                    option: item.identity
                });
            });
            this.setState({dataSource: dataSource});
        }).catch();
    }

    approveOrgInfo = (key) => {
        return () => {
            axios(
                {
                    method: 'post',
                    url: 'http://localhost:3000/api/approveInfo',
                    data: {key: key},
                    headers: {authorization: store.getState().token}
                }
            ).then((response) => {
                console.log(response.data.result);
                const {code, name, site, address, identity} = response.data.result;
                this.setState({visible: true, info: response.data.result}, () => {
                    this.form.setFieldsValue({
                        code: code,
                        name: name,
                        site: site,
                        address: address,
                        identity: identity
                    });
                });
            }).catch(() => {
                message.error('注册信息获取失败，请重新尝试！').then();
            });
        }
    }

    toggleModal = () => {
        this.setState({visible: !this.state.visible});
    }

    getLicensePages=(pdf)=>{
        console.log(pdf.numPages);
    }

    render() {

        return (
            <>
                <Table dataSource={this.state.dataSource} locale={{emptyText: '暂无需要审批的企业'}}
                       pagination={{hideOnSinglePage: true}}>
                    <Column title='企业名称' dataIndex='name' key='name' align='center' width='20%'/>
                    <Column title='申请时间' dataIndex='time' key='time' align='center' width='20%'/>
                    <Column title='当前状态' dataIndex='state' key='state' align='center' width='20%'/>
                    <Column title='任务耗时' dataIndex='consum' key='consum' align='center' width='20%' render={(text) => {
                        let percent = Number.parseFloat(text) / 48;
                        let strokeColor = {
                            from: '#108ee9',
                            to: '#87d068'
                        };
                        if (percent > 1) {
                            percent = 100;
                        } else {
                            percent = Math.floor(percent * 100);
                        }
                        if (percent > 50) {
                            strokeColor = {
                                from: '#FFB6C1',
                                to: '#CD2626'
                            };
                        }
                        // console.log(percent);
                        return (<Progress status='active' showInfo={false} strokeColor={strokeColor} percent={percent}
                                          title={`当前耗时：${text}小时`}/>);
                    }}/>
                    <Column title='操作' dataIndex='option' key='option' align='center' width='20%' render={(text) => (
                        <Space size={20}>
                            <Button icon={<FileSearchOutlined style={{fontSize: '20px'}}/>} type='link' title='查看详情'
                                    onClick={this.approveOrgInfo(text)}/>
                            <Button icon={<SisternodeOutlined style={{fontSize: '20PX'}}/>} type='link' title='任务指派'/>
                        </Space>
                    )}/>
                </Table>
                <Modal visible={this.state.visible} title='注册信息审核' footer={null} width={1050}
                       bodyStyle={{height: '1020px'}} onCancel={this.toggleModal}>
                    <Form labelCol={{span: 5}} wrapperCol={{span: 15}} ref={(form) => {
                        this.form = form
                    }}>
                        <Form.Item label='企业代码' name='code'>
                            <Input readOnly/>
                        </Form.Item>
                        <Form.Item label='企业名称' name='name'>
                            <Input readOnly/>
                        </Form.Item>
                        <Form.Item label='企业官网' name='site'>
                            <Input readOnly/>
                        </Form.Item>
                        <Form.Item label='企业地址' name='address'>
                            <Input readOnly/>
                        </Form.Item>
                        <Form.Item label='企业标识' name='identity'>
                            <Input readOnly/>
                        </Form.Item>
                        <Form.Item label='营业执照' name='license'>
                            {
                                this.state.info.license ? this.state.info.license.endsWith('.pdf') ?
                                    <PdfReader height='240px' file={require(`../../../../${this.state.info.license}`).default}/> :
                                    <Image src={require(`../../../../${this.state.info.license}`).default} height={240}
                                           style={{border: 'solid 1px #D9D9D9'}}/> : <Image src='error' width={200} height={200}/>
                            }
                        </Form.Item>
                        <Form.Item label='授权书' name='letter'>
                            {
                                this.state.info.letter ? this.state.info.letter.endsWith('.pdf') ?
                                    <PdfReader height='240px' file={require(`../../../../${this.state.info.letter}`).default}/>  :
                                    <Image src={require(`../../../../${this.state.info.letter}`).default } height={240}
                                           style={{border: 'solid 1px #D9D9D9'}}/> : <Image src='error' width={200} height={200}/>
                            }
                        </Form.Item>
                        <Form.Item label='审批意见' name='letter'>
                            <Input placeholder='请输入审批意见'/>
                        </Form.Item>
                        <Form.Item label='审批结果'>
                            <Select placeholder='请选择审批结果'>
                                <Option value='approve'>通过</Option>
                                <Option value='refused'>拒绝</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item wrapperCol={{offset: 5, span: 15}}>
                            <Form.Item style={{display: 'inline-block', width: '270px', float: 'left'}}>
                                <Button block type='primary'>提&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;交</Button>
                            </Form.Item>
                            <Form.Item style={{display: 'inline-block', width: '270px', float: 'right'}}>
                                <Button block>取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</Button>
                            </Form.Item>
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        );
    }
}

export default Approve;
