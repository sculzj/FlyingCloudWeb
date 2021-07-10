import React, {Component} from 'react';
import {Button, Result} from "antd";
import {withRouter} from "react-router";


class Results extends Component {

    state = {time: 5};

    componentDidMount() {
        const id = setInterval(() => {
            this.setState(state => {
                    if (state.time > 0)
                        return {time: state.time-1}
                    else {
                        clearInterval(id);
                        this.toUrl();
                    }
                }
            )
        }, 1000)
    }

    toUrl = () => {
        this.props.history.replace('/index');
    }

    render() {
        return (
            <div style={{margin:'20px auto',width:'1600px', minHeight:'1200px'}}>
                <Result status={this.props.statu} title='注册成功！'
                        subTitle={`恭喜您，已成功注册为飞云企业用户！我们将为您提供优质服务！${this.state.time}s后将自动跳转到登录页面，您也可以点击下方按钮直接跳转。`}
                        extra={[<Button type='link' key='login' onClick={this.toUrl}>立即登录</Button>]}/>
            </div>
        );
    }
}

export default withRouter(Results);
