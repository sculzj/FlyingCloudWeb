import React, {Component} from 'react';
import {Button, Result} from "antd";

class UnAuth extends Component {
    render() {
        return (
            <Result
                status="404"
                title="权限不足"
                subTitle="该账号权限不足，不能进行相关操作！"
                extra={<Button type="primary">申请授权</Button>}
            />
        );
    }
}

export default UnAuth;