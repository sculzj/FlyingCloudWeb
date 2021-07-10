/**
 * 企业发展历程
 */
import React, {Component} from 'react';
import {Timeline} from 'antd';
import {
    DashboardOutlined,
    DollarCircleOutlined,
    EnvironmentOutlined,
    RocketOutlined,
    TrophyOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined
} from '@ant-design/icons';
import courseStyle from './index.module.css';

class Course extends Component {

    state = {top: 0, upVisibility: 'hidden', downVisibility: 'hidden'};
    timerID = 0;

    showOptionBtu = () => {
        const top = getComputedStyle(this.scrollPanel).top;
        const height = getComputedStyle(this.scrollPanel).height;
        if (parseInt(top) < 0){
            this.setState({upVisibility: 'visible'});
        }
        if (((parseInt(height) - 344)) > Math.abs(parseInt(top))){
            this.setState({downVisibility: 'visible'});
        }
    }

    hiddenOptionBtu = () => {
        this.setState({upVisibility: 'hidden', downVisibility: 'hidden'});
    }

    scrollDown = () => {
        this.timerID = setInterval(() => {
                this.setState((state) => {
                    if (state.top < 0) {
                        return {top: state.top + 5, downVisibility: 'visible'};
                    } else {
                        clearInterval(this.timerID);
                        return {upVisibility: 'hidden'};
                    }
                })
            }, 100
        )
    }

    scrollUp = () => {
        this.timerID = setInterval(() => {
                const top = getComputedStyle(this.scrollPanel).top;
                const height = getComputedStyle(this.scrollPanel).height;
                this.setState((state) => {
                    if ((parseInt(height) - 344 + parseInt(top)) > 0) {
                        return {top: state.top - 5, upVisibility: 'visible'};
                    } else {
                        clearInterval(this.timerID);
                        return {downVisibility: 'hidden'};
                    }
                })
            }, 100
        )
    }

    stopScroll = () => {
        clearInterval(this.timerID);
    }

    render() {
        return (
            <div className={courseStyle.course}>
                <h3>飞云大事件</h3>
                <div className={courseStyle.scroll} onMouseEnter={this.showOptionBtu}
                     onMouseLeave={this.hiddenOptionBtu}>
                    <div className={courseStyle.scrollPanel} style={{top: `${this.state.top}px`}} ref={element => {
                        this.scrollPanel = element
                    }}>
                        <Timeline mode="alternate" pending='创新永不止步，奇迹正在诞生......'>
                            <Timeline.Item className={courseStyle.item}
                                           dot={<EnvironmentOutlined style={{fontSize: '16px', color: '#0aa344'}}/>}>
                                <b>2021.05.01</b> 飞云在成都市高新区注册成立</Timeline.Item>
                            <Timeline.Item className={courseStyle.item}
                                           dot={<DashboardOutlined style={{fontSize: '16px', color: '#FF1A1D'}}/>}>
                                <b>2021.10.01</b> 飞云注册企业突破50家，服务企业用户30,000+</Timeline.Item>
                            <Timeline.Item className={courseStyle.item}
                                           dot={<DollarCircleOutlined style={{fontSize: '16px', color: '#FF881A'}}/>}>
                                <b>2022.02.20</b> 飞云获得A轮融资2000万美元
                            </Timeline.Item>
                            <Timeline.Item className={courseStyle.item}
                                           dot={<TrophyOutlined style={{fontSize: '16px', color: '#FF1A1D'}}/>}>
                                <b>2022.04.16</b> 飞云荣获<b>“2021年度十大ERP解决方案”</b>金奖
                            </Timeline.Item>
                            <Timeline.Item className={courseStyle.item}
                                           dot={<DollarCircleOutlined style={{fontSize: '16px', color: '#FF881A'}}/>}>
                                <b>2022.07.23</b> 飞云再获B轮融资8000万美元
                            </Timeline.Item>
                            <Timeline.Item className={courseStyle.item}
                                           dot={<RocketOutlined style={{fontSize: '16px', color: '#FF1A1D'}}/>}>
                                <b>2022.07.23</b> 飞云注册企业突破500家，服务企业用户1,000,000+
                            </Timeline.Item>
                            <Timeline.Item className={courseStyle.item}
                                           dot={<DollarCircleOutlined style={{fontSize: '16px', color: '#FF881A'}}/>}>
                                <b>2022.12.31</b> 飞云年度营收2.8亿美元，同比扭亏盈利
                            </Timeline.Item>
                        </Timeline>
                    </div>
                    <VerticalAlignTopOutlined className={courseStyle.scrollUp}
                                              style={{visibility: this.state.upVisibility}}
                                              onMouseEnter={this.scrollDown} onMouseLeave={this.stopScroll}/>
                    <VerticalAlignBottomOutlined className={courseStyle.scrollDown}
                                                 style={{visibility: this.state.downVisibility}}
                                                 onMouseEnter={this.scrollUp} onMouseLeave={this.stopScroll}/>
                </div>
            </div>
        );
    }
}

export default Course;