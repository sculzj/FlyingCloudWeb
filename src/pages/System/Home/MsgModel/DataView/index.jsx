import React, {Component} from 'react';
import {
    AppstoreAddOutlined,
    BlockOutlined,
    DollarCircleOutlined,
    FieldTimeOutlined,
    LikeOutlined, MessageOutlined
} from "@ant-design/icons";
import * as echarts from 'echarts/core';
import {List, Popover, Table} from "antd";

import style from './index.module.css';

const {Column} = Table;

class DataView extends Component {

    state = {
        timerId: '',
        lsitInfo: '',
        offset: 0,
        transformStyle: {transitionDuration: '1s', transitionTimingFunction: 'linear'},
        height:0
    };

    /**
     * 组件加载完成时加载图表数据，启动列表滚动定时器，并绑定窗口大小变的监听，动态调整图表的大小
     */
    componentDidMount() {
        const quoteOption = {
            title: {
                text: '最多引用模板TOP5',
                subtext: '仅统计自建模板',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['引用次数'],
                right: 20,
                top: 30
            },
            grid: {
                left: 20,
                right: 50,
                bottom: 20,
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: ['模板5', '模板4', '模板3', '模板2', '模板1']
            },
            series: [
                {
                    name: '引用次数',
                    type: 'bar',
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(
                            1, 0, 0, 0,
                            [
                                {offset: 0, color: '#ff5858'},
                                {offset: 1, color: '#f857a6'}
                            ]
                        )
                    },
                    emphasis: {
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(
                                1, 0, 0, 0,
                                [
                                    {offset: 0, color: '#f857a6'},
                                    {offset: 1, color: '#ff5858'}
                                ]
                            )
                        }
                    },
                    data: [18203, 23489, 29034, 104970, 131744]
                }
            ]
        };
        const likeOption = {
            title: {
                text: '最多点赞模板TOP5',
                subtext: '仅统计自建模板',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['点赞次数'],
                right: 20,
                top: 30
            },
            grid: {
                left: 20,
                right: 50,
                bottom: 20,
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: ['模板5', '模板4', '模板3', '模板2', '模板1']
            },
            series: [
                {
                    name: '点赞次数',
                    type: 'bar',
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(
                            1, 0, 0, 0,
                            [
                                {offset: 0, color: '#f7bb97'},
                                {offset: 1, color: '#dd5e89'}
                            ]
                        )
                    },
                    emphasis: {
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(
                                1, 0, 0, 0,
                                [
                                    {offset: 0, color: '#dd5e89'},
                                    {offset: 1, color: '#f7bb97'}
                                ]
                            )
                        }
                    },
                    data: [18203, 23489, 29034, 104970, 131744]
                }
            ]
        };
        const quote = echarts.init(this.quote);
        const like = echarts.init(this.like);
        quote.setOption(quoteOption);
        like.setOption(likeOption);
        this.setState({height:window.innerHeight-780});
        window.addEventListener('resize', () => {
            quote.resize();
            like.resize();
            this.setState({height:window.innerHeight-780});
        });
        this.runTimer();
    }

    /**
     * 组件卸载时，清除列表滚动定时器
     */
    componentWillUnmount() {
        clearInterval(this.state.timerId);
    }

    /**
     * 启动列表滚动定时器，并加入state维护
     */
    runTimer = () => {
        const list = document.getElementById("list");
        const timerId = setInterval(() => {
            if ((this.state.offset) < (list.offsetHeight - 260)) {
                this.setState({
                    offset: this.state.offset + 39,
                    transformStyle: {transitionDuration: '1s', transitionTimingFunction: 'linear'}
                });
            } else {
                this.setState({offset: 0, transformStyle: {transitionDuration: '0s', transitionTimingFunction: null}});
            }
        }, 3000);
        if (this.state.timerId) {
            clearInterval(this.state.timerId);
        }
        this.setState({timerId: timerId});
    }

    /**
     * 鼠标进入事件监听，展示列表项内容，并清除列表滚动定时器
     * @param e
     */
    showDetailInfo = (e) => {
        clearInterval(this.state.timerId);
        this.setState({listInfo: e.target.innerText});
    }

    /**
     * 鼠标离开事件监听，重新启动列表滚动定时器
     */
    startScroll = () => {
        this.runTimer();
    }

    render() {

        const data = [
            {type: 'quote', info: '张三引用了您的《缴费通知》模板。'},
            {type: 'like', info: 'Racing car sprays burning fuel into crowd.'},
            {type: 'like', info: 'Japanese princess to wed commoner.'},
            {type: 'comment', info: 'Man charged over missing wedding girl.'},
            {type: 'quote', info: 'Los Angeles battles huge wildfires.'},
            {type: 'quote', info: 'Racing car sprays burning fuel into crowd.'},
            {type: 'like', info: 'Racing car sprays burning fuel into crowd.'},
            {type: 'like', info: 'Japanese princess to wed commoner.'},
            {type: 'comment', info: 'Man charged over missing wedding girl.'},
            {type: 'quote', info: 'Los Angeles battles huge wildfires.'},
            {type: 'quote', info: 'Racing car sprays burning fuel into crowd.'},
            {type: 'like', info: 'Racing car sprays burning fuel into crowd.'},
            {type: 'like', info: 'Japanese princess to wed commoner.'},
            {type: 'comment', info: 'Man charged over missing wedding girl.'},
            {type: 'quote', info: 'Los Angeles battles huge wildfires.'}
        ];
        const source = [
            {
                key: '001',
                title: '模板实例',
                createTime: '2021-08-01',
                type: '公开免费',
                collect: 3200,
                quote: 10023,
                like: 4200,
                score: 9.0,
                efficiency: '23%'
            },
            {
                key: '002',
                title: '模板实例',
                createTime: '2021-08-01',
                type: '公开免费',
                collect: 3200,
                quote: 10023,
                like: 4200,
                score: 9.0,
                efficiency: '23%'
            },
            {
                key: '003',
                title: '模板实例',
                createTime: '2021-08-01',
                type: '公开免费',
                collect: 3200,
                quote: 10023,
                like: 4200,
                score: 9.0,
                efficiency: '23%'
            },
            {
                key: '004',
                title: '模板实例',
                createTime: '2021-08-01',
                type: '公开免费',
                collect: 3200,
                quote: 10023,
                like: 4200,
                score: 9.0,
                efficiency: '23%'
            },
            {
                key: '005',
                title: '模板实例',
                createTime: '2021-08-01',
                type: '公开免费',
                collect: 3200,
                quote: 10023,
                like: 4200,
                score: 9.0,
                efficiency: '23%'
            },
            {
                key: '006',
                title: '模板实例',
                createTime: '2021-08-01',
                type: '公开免费',
                collect: 3200,
                quote: 10023,
                like: 4200,
                score: 9.0,
                efficiency: '23%'
            },
            {
                key: '007',
                title: '模板实例',
                createTime: '2021-08-01',
                type: '公开免费',
                collect: 3200,
                quote: 10023,
                like: 4200,
                score: 9.0,
                efficiency: '23%'
            },
            {
                key: '008',
                title: '模板实例',
                createTime: '2021-08-01',
                type: '公开免费',
                collect: 3200,
                quote: 10023,
                like: 4200,
                score: 9.0,
                efficiency: '23%'
            },
            {
                key: '009',
                title: '模板实例',
                createTime: '2021-08-01',
                type: '公开免费',
                collect: 3200,
                quote: 10023,
                like: 4200,
                score: 9.0,
                efficiency: '23%'
            },
            {
                key: '010',
                title: '模板实例',
                createTime: '2021-08-01',
                type: '公开免费',
                collect: 3200,
                quote: 10023,
                like: 4200,
                score: 9.0,
                efficiency: '23%'
            }
        ];

        return (
            <div className={style.frame}>
                <div className={style.top}>
                    <div className={style.dataItem} style={{background: 'linear-gradient(45deg,#f78ca0,#fe9a8b)'}}>
                        <span className={style.data}>12<AppstoreAddOutlined className={style.icon}/></span>
                        <span>拥有的模板总数，其中自建模板XX个，收藏模板XX个</span>
                    </div>
                    <div className={style.dataItem} style={{background: 'linear-gradient(45deg,#fa709a,#fee140)'}}>
                        <span className={style.data}>12<BlockOutlined className={style.icon}/></span>
                        <span>自建模板累计被引用次数，单模板最多被引用XX次</span>
                    </div>
                    <div className={style.dataItem} style={{background: 'linear-gradient(45deg,#fccb90,#d57eeb)'}}>
                        <span className={style.data}>12<LikeOutlined className={style.icon}/></span>
                        <span>自建模板累计被点赞次数，单模板最多被点赞XX次</span>
                    </div>
                    <div className={style.dataItem} style={{background: 'linear-gradient(45deg,#5ee7df,#b490ca)'}}>
                        <span className={style.data}>12min<FieldTimeOutlined className={style.icon}/></span>
                        <span>模板被引用后的消息平均编辑用时XX，节省XX%时间</span>
                    </div>
                    <div className={style.dataItem} style={{background: 'linear-gradient(45deg,#a8edea,#fed6e3)'}}>
                        <span className={style.data}>¥12.00<DollarCircleOutlined className={style.icon}/></span>
                        <span>模板带来的累计收益，收费模板的平均收益XX/个</span>
                    </div>
                </div>
                <div className={style.center}>
                    <div className={style.rankByQuote} ref={element => {
                        this.quote = element
                    }}/>
                    <div className={style.rankByLike} ref={element => {
                        this.like = element
                    }}/>
                    <div className={style.realTime}>
                        <div className={style.listHeader}>模板实时动态</div>
                        <div className={style.listContent}>
                            <List className={style.list} style={{
                                top: `${-this.state.offset}px`,
                                transitionDuration: this.state.transformStyle.transitionDuration,
                                transitionTimingFunction: this.state.transformStyle.transitionTimingFunction
                            }} dataSource={data} itemLayout='vertical' size='small' split id='list'
                                  renderItem={item => (
                                      <Popover content={this.state.listInfo}>
                                          <List.Item onMouseEnter={this.showDetailInfo} onMouseLeave={this.startScroll}>
                                              {item.type === 'quote' ?
                                                  <BlockOutlined style={{color: '#ff2d51'}}/> : item.type === 'like' ?
                                                      <LikeOutlined style={{color: '#ff2d51'}}/> :
                                                      <MessageOutlined style={{color: '#ff2d51'}}/>}&nbsp;&nbsp;
                                              <span className={style.listInfo}>{item.info}</span>
                                          </List.Item>
                                      </Popover>
                                  )}>
                            </List>
                        </div>
                        <div className={style.listFooter}>每30分钟更新一次实时数据</div>
                    </div>
                </div>
                <div className={style.bottom}>
                    <Table dataSource={source} scroll={{y: this.state.height, scrollToFirstRowOnChange: true}}>
                        <Column align='center' title='模板名称' dataIndex='title' ellipsis width='12.5%'/>
                        <Column align='center' title='创建时间' dataIndex='createTime' ellipsis width='12.5%'
                                sorter={(a, b) => (new Date(a.createTime).getTime() - new Date(b.createTime).getTime())}
                                showSorterTooltip={{title: '按时间排序'}}/>
                        <Column align='center' title='模板类型' dataIndex='type' ellipsis width='12.5%'/>
                        <Column align='center' title='收藏人数' dataIndex='collect' ellipsis width='12.5%'
                                sorter={(a, b) => (a.collect - b.collect)} showSorterTooltip={{title: '按收藏排序'}}/>
                        <Column align='center' title='引用次数' dataIndex='quote' ellipsis width='12.5%'
                                sorter={(a, b) => (a.quote - b.quote)} showSorterTooltip={{title: '按引用排序'}}/>
                        <Column align='center' title='点赞次数' dataIndex='like' ellipsis width='12.5%'
                                sorter={(a, b) => (a.like - b.like)} showSorterTooltip={{title: '按点赞排序'}}/>
                        <Column align='center' title='综合评分' dataIndex='score' ellipsis width='12.5%'
                                sorter={(a, b) => (a.score - b.score)} showSorterTooltip={{title: '按评分排序'}}/>
                        <Column align='center' title='效率提升' dataIndex='efficiency' ellipsis width='12.5%'
                                sorter={(a, b) => (a.efficiency - b.efficiency)} showSorterTooltip={{title: '按效率排序'}}/>
                    </Table>
                </div>
            </div>
        );
    }
}

export default DataView;