import React, {Component} from 'react';
import {Badge, Button, Card, Checkbox, Form, Input, InputNumber, Modal, Radio, Space} from "antd";
import Icon, {ShoppingCartOutlined} from "@ant-design/icons";
import axios from "axios";
import QRcode from 'qrcode.react';

import style from './index.module.css';
import {ReactComponent as SubscribeOutLined} from '../../../../images/svgs/subscribe.svg';
import {ReactComponent as PayOutLined} from '../../../../images/svgs/pay.svg';
import {serverIP} from "../../../../resource/constant";
import Store from "../../../../redux/store";
import {ReactComponent as UnionPayIcon} from '../../../../images/svgs/unionpay.svg';
import {ReactComponent as AliPayIcon} from '../../../../images/svgs/alipay.svg';
import {ReactComponent as WechatPayIcon} from '../../../../images/svgs/wechat.svg';
import moment from "moment";

const {Meta} = Card;
const {store} = Store;

class ServiceMarket extends Component {

    constructor(props) {
        super(props);
        this.state = {product: [], shopping: [],paying:'',visible:false};
        this.getProductinfo();
    }

    getProductinfo = () => {
        axios(
            {
                url: `${serverIP}/api/productInfo`,
                method: 'get',
                headers: {authorization: store.getState().token}
            }
        ).then(response => {
            const {product, shopping} = response.data;
            this.setState({product, shopping});
        }).catch();
    }

    payForService=(item)=> {
        const self=this;
        return function () {
            self.setState({paying:item},()=>{
                console.log(item);
                self.setState({visible:true});
            });
        }
    }

    render() {
        return (
            <>
                <div className={style.header}>
                    <div className={style.left}>
                        <Space size={20}>
                            <Input.Search placeholder='根据服务名称进行搜索' style={{width: '320px'}} enterButton/>
                            <div className={style.filter}>
                                <Checkbox>限时优惠</Checkbox>
                            </div>
                        </Space>
                    </div>
                    <div className={style.right}>
                        <Badge count={this.state.shopping.length} size='small' offset={[-5, 5]}>
                            <ShoppingCartOutlined style={{fontSize: '30px'}}/>
                        </Badge>
                    </div>
                </div>
                <div className={style.content}>
                    {
                        this.state.product.map(item => (
                            <div className={style.box} key={item.sku}>
                                <img alt='' className={style.onSale}
                                     style={{visibility: item.price_off === 0 ? 'hidden' : 'visible'}}
                                     src={require('../../../../images/onSale.png').default}/>
                                <Card hoverable
                                      cover={<img alt='' src={require(`../../../../images/${item.cover}`).default}/>}
                                      bodyStyle={{padding: '16px', paddingBottom: '8px'}} actions={[
                                    <ShoppingCartOutlined key='shop' title='加入购物车' style={{fontSize: '24px'}}/>,
                                    <Icon component={PayOutLined} key='pay' title='购买支付' style={{fontSize: '24px'}} onClick={this.payForService(item)}/>,
                                    <Icon component={SubscribeOutLined} key='subscribe' title='订阅促销信息'
                                          style={{fontSize: '24px'}}/>,
                                ]}>
                                    <Meta title={`${item.name}【增值服务】`} description={
                                        <>
                                            <p>服务简介：{item.info}</p>
                                            <p>价目信息：按年付费--{item.price_year}{item.unit_year}&nbsp;|&nbsp;永久买断--{item.price_forever}{item.unit_forever}</p>
                                        </>
                                    }/>
                                </Card>
                            </div>
                        ))
                    }
                </div>
                <Modal title='订单支付' visible={this.state.visible} footer={<Button>取消</Button>}
                       bodyStyle={{padding: '20px 10px 0'}} destroyOnClose>
                    <Form labelCol={{span:6}} wrapperCol={{span:16}} preserve={false}>
                        <Form.Item label='订单编号' name='orderCode' initialValue={moment(Date.now()).format('YYYYMMDDHHmmss')}>
                            <Input disabled bordered={false}/>
                        </Form.Item>
                        <Form.Item label='服务名称' name='product' initialValue={this.state.paying.name}>
                            <Input disabled bordered={false}/>
                        </Form.Item>
                        <Form.Item label='订购方式' name='buyway' initialValue='year'>
                            <Radio.Group>
                                <Space size={20}>
                                    <Radio value='year'>按年付费</Radio>
                                    <Radio value='forever'>永久付费</Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label='服务单价' name='price' initialValue={`${this.state.paying.price_year}${this.state.paying.unit_year}`}>
                            <Input disabled bordered={false}/>
                        </Form.Item>
                        <Form.Item label='订购数量' name='buyNum' initialValue={1}>
                            <InputNumber min={1} max={999}/>
                        </Form.Item>
                        <Form.Item label='限时折扣' name='rate' initialValue={1}>
                            <Input disabled bordered={false}/>
                        </Form.Item>
                        <Form.Item label='应付金额' name='total' initialValue={`${this.state.paying.price_year}元`}>
                            <Input disabled bordered={false}/>
                        </Form.Item>
                        <Form.Item label='支付方式' name='payway' initialValue='unionpay'>
                            <Radio.Group>
                                <Space size={40}>
                                    <Radio value='unionpay'><Icon title='银联支付' component={UnionPayIcon}
                                                                  style={{fontSize: '30px', verticalAlign: 'middle'}}/></Radio>
                                    <Radio value='alipay'><Icon title='支付宝支付' component={AliPayIcon} style={{
                                        fontSize: '30px',
                                        verticalAlign: 'middle'
                                    }}/></Radio>
                                    <Radio value='wechat'><Icon title='微信支付' component={WechatPayIcon} style={{
                                        fontSize: '30px',
                                        verticalAlign: 'middle'
                                    }}/></Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item wrapperCol={{offset:6}}>
                            <QRcode value='1234' size={150}/>
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        );
    }
}

export default ServiceMarket;