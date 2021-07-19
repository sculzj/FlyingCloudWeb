import React, {Component} from 'react';
import {Breadcrumb} from "antd";
import {RightOutlined} from "@ant-design/icons";

class Guidepost extends Component {
    render() {
        return (
            <Breadcrumb separator={<RightOutlined />} style={{marginBottom:'20px',height:'20px'}}>
                {
                    this.props.guides.map((item,index)=>(
                        <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
                    ))
                }
            </Breadcrumb>
        );
    }
}

export default Guidepost;