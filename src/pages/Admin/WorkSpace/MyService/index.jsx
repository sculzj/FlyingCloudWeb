import React, {Component} from 'react';
import {Button, Card} from "antd";

import style from './index.module.css';

const {Meta} = Card;

class MyService extends Component {
    render() {
        return (
            <div className={style.content}>
                <div className={style.box}>
                    <Card hoverable cover={<img alt='' src={require('../../../../images/cover_license.jpg').default}/>}
                          bodyStyle={{padding: '16px', paddingBottom: '8px'}}>
                        <Meta title='账号授权【基础服务】' description='默认包含1000个永久账号授权，超出数量的授权需要单独订购，支持按年付费、一次性买断两种订购方式。'/>
                        <div className={style.option}>
                            <span className={style.tag}>总共授权：1000个</span>
                            <span className={style.tag}>可用授权：100个</span>
                            <Button type='link' className={style.btu}>快速订购</Button>
                        </div>
                    </Card>
                </div>
                <div className={style.box}>
                    <Card hoverable cover={<img alt='' src={require('../../../../images/cover_deskOA.jpg').default}/>}
                          bodyStyle={{padding: '16px', paddingBottom: '8px'}}>
                        <Meta title='桌面OA系统【基础服务】' description='飞云桌面端基础办公系统，永久免费授权，包括事件流转、流程审批等基础功能，支持Web浏览器以及客户端。'/>
                        <div className={style.option}>
                            <span className={style.tag}>永久授权</span>
                            {/*<span className={style.tag}/>*/}
                            {/*<Button type='link' className={style.btu}>快速订购</Button>*/}
                        </div>
                    </Card>
                </div>
                <div className={style.box}>
                    <Card hoverable cover={<img alt='' src={require('../../../../images/cover_save.jpg').default}/>}
                          bodyStyle={{padding: '16px', paddingBottom: '8px'}}>
                        <Meta title='企业云盘【基础服务】' description='默认包含2000G云盘空间，超出数量的云盘需要单独订购。支持按年付费、一次性买断两种订购方式。'/>
                        <div className={style.option}>
                            <span className={style.tag}>总共空间：2000G</span>
                            <span className={style.tag}>可用授权：1900G</span>
                            <Button type='link' className={style.btu}>快速订购</Button>
                        </div>
                    </Card>
                </div>
                <div className={style.box}>
                    <Card hoverable cover={<img alt='' src={require('../../../../images/cover_mobileOA.jpg').default}/>}
                        bodyStyle={{padding: '16px', paddingBottom: '8px'}}>
                        <Meta title='移动OA系统【基础服务】' description='飞云移动端基础办公系统，支持Android、IOS两大平台，默认包含1000个永久免费授权，与桌面端数据同步，超出数量的授权需要单独订购。'/>
                        <div className={style.option}>
                            <span className={style.tag}>总共授权：1000个</span>
                            <span className={style.tag}>可用授权：100个</span>
                            <Button type='link' className={style.btu}>快速订购</Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }
}

export default MyService;