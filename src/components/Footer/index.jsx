import React, {Component} from 'react';
import {Button, Space} from "antd";
import {
    PhoneOutlined,
    UsergroupAddOutlined,
    CommentOutlined,
    AuditOutlined,
    DollarOutlined,
    ExceptionOutlined
} from '@ant-design/icons';
import footerStyle from './index.module.css'

class Footer extends Component {
    render() {
        return (
            <div className={footerStyle.footer}>
                <Space size={20}>
                    <Button className={footerStyle.btu} type='link' icon={<PhoneOutlined/>} size='middle'>联系我们</Button>
                    <span>|</span>
                    <Button className={footerStyle.btu} type='link' icon={<UsergroupAddOutlined/>} size='middle'>商务合作</Button>
                    <span>|</span>
                    <Button className={footerStyle.btu} type='link' icon={<CommentOutlined/>} size='middle'>在线客服</Button>
                    <span>|</span>
                    <Button className={footerStyle.btu} type='link' icon={<AuditOutlined/>} size='middle'>法律声明</Button>
                    <span>|</span>
                    <Button className={footerStyle.btu} type='link' icon={<DollarOutlined/>} size='middle'>投资者关系</Button>
                    <span>|</span>
                    <Button className={footerStyle.btu} type='link' icon={<ExceptionOutlined/>} size='middle'>投诉建议</Button>
                </Space>
            </div>
        );
    }
}

export default Footer;