import React, {Component} from 'react';
import {Collapse} from "antd";
import PriceCard from "../PriceCard";

const {Panel} = Collapse;

class Product extends Component {

    render() {
        let oa=[];
        let email=[];

        for (let item of this.props.productInfo){
            if (item.product==='OA系统'){
                oa=[...oa,item];
            }
            if (item.product==='商务邮箱'){
                email=[...email,item];
            }
        }

        return (
            <Collapse accordion defaultActiveKey={[1]}>
                <Panel header='OA系统' key={1}>
                    <PriceCard dataSource={oa}/>
                </Panel>
                <Panel header='商务邮箱' key={2}>
                    <PriceCard dataSource={email}/>
                </Panel>
            </Collapse>
        );
    }
}

export default Product;