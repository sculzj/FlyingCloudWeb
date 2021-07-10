import React, {Component} from 'react';
import {Table, InputNumber} from "antd";

class PriceCard extends Component {

    add = () => {
    };

    render() {

        const columns = [
            {title: '套餐', dataIndex: 'combo', align: 'center'},
            {title: '内容', dataIndex: 'detail', align: 'center'},
            {title: '价格', dataIndex: 'price', align: 'center'},
            {
                title: '数量', key: 'action', align: "center", render: (text, record) => (
                    <InputNumber defaultValue={0} min={0} size='middle'/>)
            }
        ];

        const rowSelection = {
            type: 'checkbox'
        };

        return (
            <Table rowSelection={rowSelection} columns={columns} dataSource={this.props.dataSource} pagination={false}/>
        );
    }
}

export default PriceCard;