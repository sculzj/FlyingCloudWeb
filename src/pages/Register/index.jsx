import React, {Component} from 'react';
import {Button, Form, Input, Upload, Modal, Checkbox, message} from "antd";
import {EnvironmentOutlined, UploadOutlined} from "@ant-design/icons";
import axios from "axios";

import {Status} from '../../resource/constant';
import NavCommon from "../../components/NavCommon";
import Footer from "../../components/Footer";
import Results from "./Results";
import registerStyle from './index.module.css';
import MapPanel from "./MapPanel";

const formItemLayout = {
    labelCol: {
        sm: {span: 5}
    },
    wrapperCol: {
        sm: {span: 17}
    }
}

const tailLayout = {
    wrapperCol: {offset: 5, span: 17}
}

class Sign extends Component {

    componentDidMount() {
        this.files = new FormData();
    }

    state = {
        codeState: {verify: '', message: ''},
        EmailState: {verify: '', message: ''},
        loading: false,
        percent: 0,
        result: '',
        map: false,
        point: '',
        address:''
    };

    verifyCode = () => ({
        validator(_, value) {
            return new Promise((resolve, reject) => {
                axios({
                    url: '/api/verifyOrgCode',
                    method: 'post',
                    data: {code: value}
                }).then(response => {
                    if (response.data.state === Status.success) {
                        reject('该企业已注册，不允许重复注册！');
                    } else {
                        resolve();
                    }
                }).catch(err => {
                        reject(err.message);
                    }
                );
            });
        }
    })

    verifyEmail = () => ({
        validator(_, value) {
            return new Promise((resolve, reject) => {
                axios({
                    url: '/api/verifyOrgEmail',
                    method: 'post',
                    data: {email: value}
                }).then(response => {
                    if (response.data.state === Status.success) {
                        reject('该邮箱已绑定企业，不允许重复绑定！');
                    } else {
                        resolve();
                    }
                }).catch(err => {
                        reject(err.message);
                    }
                );
            });
        }
    })

    verifyIdentity = () => ({
        validator(_, value) {
            return new Promise((resolve, reject) => {
                axios({
                    url: '/api/verifyIdentity',
                    method: 'post',
                    data: {identity: value}
                }).then(response => {
                    if (response.data.state === Status.failed) {
                        reject('该识别码已存在，请更换！');
                    } else {
                        resolve();
                    }
                }).catch(err => {
                        reject(err.message);
                    }
                );
            });
        }
    })

    readyLicense = file => {
        if (!this.formRef.getFieldValue('identity')||!this.formRef.getFieldValue('code')){
            message.error({content:'上传文件之前请先填写机构代码及识别码信息！'}).then();
            return Upload.LIST_IGNORE;
        }
        if (this.files.has('license')) {
            this.files.delete('license');
        }
        this.files.append('license', file,
            `${this.formRef.getFieldValue('identity')}_License${file.name.slice(file.name.lastIndexOf('.'))}`);
        console.log(`${this.formRef.getFieldValue('identity')}_License${file.name.slice(file.name.lastIndexOf('.'))}`);
        return false;
    }

    readyAuthLeter = file => {
        if (!this.formRef.getFieldValue('identity')||!this.formRef.getFieldValue('code')){
            message.error({content:'上传文件之前请先填写机构代码及识别码信息！'}).then();
            return Upload.LIST_IGNORE;
        }
        if (this.files.has('authLeter')) {
            this.files.delete('authLeter');
        }
        this.files.append('authLeter', file,
            `${this.formRef.getFieldValue('identity')}_AuthLeter${file.name.slice(file.name.lastIndexOf('.'))}`);
        return false;
    }

    toRegister = (values) => {
        if (!this.clause.state.checked) {
            Modal.error({
                title: '错误！',
                okText: '确认！',
                content: '您必须同意服务条款后才能进行注册！'
            });
            return;
        }
        if (!this.files.get('authLeter') || !this.files.get('license')) {
            Modal.error({
                title: '错误！',
                okText: '确认！',
                content: '必须上传营业执照和法人授权函！'
            });
            return;
        }
        const {code, name, email, site, address, mobile, telephone, identity, pwd} = values;
        this.setState({loading: true});
        setTimeout(() => {
            this.setState({loading: false});
        }, 15000);
        axios({
            method: 'post',
            url: '/api/register',
            data: {code, name, email, site, address, mobile, telephone, identity, pwd}
        }).then(response => {
            if (response.data.state === Status.success) {
                axios({
                    url: '/api/upload',
                    method: 'post',
                    headers: {'Content-Type': 'multipart/form-data'},
                    data: this.files
                }).then(() => {
                    this.setState({result: Status.success})
                }).catch(err => {
                    alert(err.message);
                });
            }
        }).catch()
    }

    showMap = () => {
        this.setState({map:true},);
    }

    hideMap=()=>{
        this.setState({map:false});
        this.formRef.validateFields(['address']).then().catch(e=>{});
    }

    saveAddress=(value)=>{
        this.setState({address:value});
    }

    onOk=()=>{
        const {address}=this.state;
        if (address){
            if (!address.includes('市')&&!address.includes('省')){
                message.warn({content:'当前地址未包含省级或市级信息，请从搜索列表中选择正确的地址信息！',duration:5}).then();
                return;
            }
        }else {
            message.warn({content:'不接受自定义输入的地址信息，请从搜索列表中选择正确的地址信息！',duration:5}).then();
            return;
        }
        this.formRef.setFieldsValue({address: address});
        this.hideMap();
    }

    render() {
        return (
            <>
                <NavCommon/>
                {
                    this.state.result === Status.success ? <Results statu={Status.success}/> :
                        <div className={registerStyle.frame}>
                            <img src={require("../../images/register_background.jpg").default}
                                 className={registerStyle.back}
                                 alt=''/>
                            <div className={registerStyle.content}>
                                <h2 className={registerStyle.title}>企业用户注册</h2>
                                <Form name='register' scrollToFirstError {...formItemLayout}
                                      size='large' ref={element => {
                                    this.formRef = element
                                }} onFinish={this.toRegister}>
                                    <Form.Item name='code' label='组织机构代码' hasFeedback validateFirst rules={
                                        [
                                            {
                                                required: true,
                                                message: '组织机构代码不合法！',
                                                type: 'string',
                                                pattern: /^[A-Z0-9]+$/,
                                                len: 18
                                            },
                                            this.verifyCode
                                        ]
                                    }>
                                        <Input allowClear onBlur={this.verifyOrgCode}/>
                                    </Form.Item>
                                    <Form.Item name='name' label='企业名称' hasFeedback
                                               rules={[{required: true, message: '企业名称不能为空！'}]}>
                                        <Input allowClear/>
                                    </Form.Item>
                                    <Form.Item name='identity' label='识别码' hasFeedback validateFirst rules={
                                        [
                                            {
                                                required: true,
                                                message: '识别码包含大小写字母与数字的组合，长度为3-8位中间',
                                                type: 'string',
                                                pattern: /^[A-Za-z0-9]{3,8}$/
                                            },
                                            this.verifyIdentity
                                        ]
                                    }>
                                        <Input placeholder='识别码将作为区分企业的主要标识，不可修改，请谨慎填写！'/>
                                    </Form.Item>
                                    <Form.Item name='email' label='管理邮箱' validateFirst
                                               rules={
                                                   [
                                                       {
                                                           required: true,
                                                           message: '邮箱地址不合法！',
                                                           type: 'email'
                                                       },
                                                       this.verifyEmail]
                                               }
                                               hasFeedback>
                                        <Input allowClear/>
                                    </Form.Item>
                                    <Form.Item name='site' label='企业官网'
                                               rules={[{required: true, message: '企业站点不合法！', type: 'url'}]}
                                               hasFeedback>
                                        <Input allowClear/>
                                    </Form.Item>
                                    <Form.Item label='企业地址' name='address' hasFeedback
                                               rules={[{required: true, message: '企业地址不能为空！'}]}
                                               >
                                        <Input suffix={<EnvironmentOutlined/>}  onFocus={this.showMap} ref={element=>{this.address=element}}/>
                                    </Form.Item>
                                    <Form.Item name='orgLicense' getValueProps={() => {
                                        return 'fileList'
                                    }} label='营业执照' required>
                                        <Upload maxCount={1} accept='.png,.jpg,.pdf' className={registerStyle.upload}
                                                beforeUpload={this.readyLicense}>
                                            <Button icon={<UploadOutlined/>} block>上传文件</Button>
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item name='orgAuthLeter' getValueProps={() => {
                                        return 'fileList'
                                    }} label='法人授权函' required>
                                        <Upload maxCount={1} accept='.png,.jpg,.pdf' className={registerStyle.upload}
                                                beforeUpload={this.readyAuthLeter}>
                                            <Button icon={<UploadOutlined/>} block>上传文件</Button>
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item label='移动电话' name='mobile' hasFeedback rules={[{
                                        required: true,
                                        message: '移动电话号码为1开头的11位数字组合',
                                        type: 'string',
                                        pattern: /^1\d{10}$/
                                    }]}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item label='固定电话' name='telephone' hasFeedback rules={[{
                                        required: true,
                                        message: '固定电话为“区号-座机号码”格式的11位或12为数字组合',
                                        type: "string",
                                        pattern: /\d{3}-\d{8}|\d{4}-\d{7}/
                                    }]}>
                                        <Input placeholder='格式为：区号-座机号码，例：010-12345678'/>
                                    </Form.Item>
                                    <Form.Item name='pwd' label='登录密码' rules={[{
                                        required: true,
                                        message: '密码必须包含大小写字母和数字的组合，长度在8-16位之间',
                                        type: 'string',
                                        pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/
                                    }]} hasFeedback>
                                        <Input.Password placeholder='请输入登录密码' allowClear autoComplete='off'/>
                                    </Form.Item>
                                    <Form.Item name='configPwd' label='确认密码' dependencies={['pwd']} hasFeedback
                                               rules={[
                                                   {
                                                       required: true,
                                                       message: '请再次输入密码并确保两次密码输入一致！',
                                                   },
                                                   ({getFieldValue}) => ({
                                                           validator(_, value) {
                                                               if (!value || getFieldValue('pwd') === value) {
                                                                   return Promise.resolve();
                                                               }
                                                               return Promise.reject('两次输入密码不一致！');
                                                           }
                                                       }
                                                   )
                                               ]}>
                                        <Input.Password placeholder='请再次输入登录密码' allowClear autoComplete='off'/>
                                    </Form.Item>
                                    <Form.Item wrapperCol={{offset: 5}} name='clause' getValueProps={() => {
                                        return 'checked';
                                    }}>
                                        <Checkbox ref={elment => {
                                            this.clause = elment
                                        }}>同意<a>飞云互联服务协议</a></Checkbox>
                                    </Form.Item>
                                    <Form.Item {...tailLayout}>
                                        <Button type='primary' htmlType='submit' style={{width: '100%'}}
                                                loading={this.state.loading}>提交</Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                }
                <Footer/>
                <Modal visible={this.state.map} width={800} bodyStyle={{height: '800px'}} title='在线地图' maskClosable={false} okText='确认'
                       cancelText='取消' onCancel={this.hideMap} onOk={this.onOk} focusTriggerAfterClose={false}>
                    <MapPanel saveAddress={this.saveAddress}/>
                </Modal>
            </>
        );
    }
}

export default Sign;
