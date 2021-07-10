import React, {Component} from 'react';
import Block from "../../components/Block";
import communityStyle from './index.module.css';
import {Affix, Button, Modal, Space} from "antd";
import Banner from "../../components/Banner";
import by2021 from '../../images/2021.png';
import dream from '../../images/dream.png'
import autumn from '../../images/mid-autumn.jpg';
import {createFromIconfontCN} from "@ant-design/icons";
import Rank from "../../components/Rank";
import axios from "axios";
import NavCommon from "../../components/NavCommon";
import Footer from "../../components/Footer";

const RankIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2461384_qoonzz9k9k.js'
});

class Community extends Component {

    state = {visible: false, rank: []}

    toggleRank = () => {
        axios({
            url: '/api/topicRank',
            method: 'get'
        }).then(response => {
            this.setState((state) => ({visible: !state.visible, rank: response.data}));
        }).catch(err => {
            Modal.error({
                title: '错误！',
                okText: '确认',
                content: err.message,
                afterClose: () => {

                }
            });
        })

    }

    render() {
        return (
            <>
                <NavCommon/>
                <Affix className={communityStyle.affix}>
                    <Button icon={<RankIcon type='icon-paihangbang1'/>} className={communityStyle.rank}
                            danger onClick={this.toggleRank}><br/>热<br/>门<br/>话<br/>题</Button>
                </Affix>
                <div className={communityStyle.container}>
                    <div className={communityStyle.drawer}>
                        <Banner imgs={[autumn, by2021, dream]}/>
                        <Rank visible={this.state.visible} toggleRank={this.toggleRank} rank={this.state.rank}/>
                    </div>
                    <Space direction='vertical' size={20}>
                        <Space size={20}>
                            <Block/>
                            <Block/>
                            <Block/>
                        </Space>
                        <Space size={20}>
                            <Block/>
                            <Block/>
                            <Block/>
                        </Space>
                    </Space>
                </div>
                <Footer/>
            </>
        );
    }
}

export default Community;
