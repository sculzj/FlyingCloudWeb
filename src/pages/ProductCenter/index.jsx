import React, {PureComponent} from 'react';
import Product from "../../components/Product";
import productionStyle from './index.module.css';
import axios from "axios";
import {Empty, Modal, Spin} from "antd";
import NavCommon from "../../components/NavCommon";
import Footer from "../../components/Footer";

class ProductionCenter extends PureComponent {

    state = {productInfo: ''};

    componentDidMount() {
        axios({
            method: 'get',
            url: '/api/product'
        }).then(response => {
                this.setState({productInfo: response.data})
            }
        ).catch(err => {
            Modal.error({
                title: '错误！',
                okText: '确认',
                content: '请求失败！请检测网络连接及配置！',
                onOk: () => {
                    this.setState({productInfo: 'empty'})
                }
            });
        });
    }

    render() {
        return (
            <>
                <NavCommon/>
                <div className={productionStyle.frame}>
                    {
                        this.state.productInfo === 'empty' ?
                            <Empty description={<p>商城空空如也！</p>}/> : this.state.productInfo ?
                            <Product productInfo={this.state.productInfo}/> : <Spin/>
                    }
                </div>
                <Footer/>
            </>

        );
    }

}

export default ProductionCenter;
