import React, {Component} from 'react';
import * as echarts from 'echarts/core';
import {GaugeChart, GraphChart} from 'echarts/charts'

echarts.use([GraphChart, GaugeChart]);

class HotWord extends Component {
    componentDidMount() {
        const colorList = [
            '#929fff',
            '#9de0ff',
            '#ffa897',
            '#af87fe',
            '#7dc3fe',
            '#bb60b2',
            '#433e7c',
            '#f47a75',
            '#009db2',
            '#024b51',
            '#0780cf',
            '#765005',
            '#e75840',
            '#26ccd8',
            '#3685fe',
            '#9977ef',
            '#f5616f',
            '#f7b13f',
            '#f9e264',
            '#50c48f',
        ];

        const option = {
            title: {
                text: '一周热词',
                left: 'center',
                top: 15,
                textStyle: {
                    fontSize: 18,
                    fontWeight: 'bolder',
                    color: 'white',
                },
            },
            tooltip: {},
            animation:true,
            animationDurationUpdate: function (idx) {
                return idx * 100;
            },
            animationEasingUpdate: 'bounceIn',
            series: [
                {
                    type: 'graph',
                    layout: 'force',
                    force: {
                        repulsion: 250,
                        edgeLength: 30,
                    },
                    roam: false,
                    animation: true,
                    label: {
                        show: true,
                    },
                    data: [
                        {
                            name: '五一小长假',
                            value: 12373,
                            symbolSize: 70,
                            draggable: true,
                            itemStyle: {
                                shadowBlur: 100,
                                shadowColor: colorList[0],
                                color: colorList[0],
                            },
                        },
                        {
                            name: '考勤规则',
                            value: 5289,
                            symbolSize: 67,
                            draggable: true,
                            itemStyle: {
                                shadowBlur: 100,
                                shadowColor: colorList[2],
                                color: colorList[2],
                            },
                        },
                        {
                            name: '福利平台',
                            value: 3952,
                            symbolSize: 55,
                            draggable: true,
                            itemStyle: {
                                shadowBlur: 100,
                                shadowColor: colorList[5],
                                color: colorList[5],
                            },
                        },
                        {
                            name: '疫苗预约',
                            value: 7926,
                            symbolSize: 70,
                            draggable: true,
                            itemStyle: {
                                shadowBlur: 100,
                                shadowColor: colorList[6],
                                color: colorList[6],
                            },
                        },
                        {
                            name: '中美部长会谈',
                            value: 4536,
                            symbolSize: 67,
                            draggable: true,
                            itemStyle: {
                                shadowBlur: 100,
                                shadowColor: colorList[7],
                                color: colorList[7],
                            },
                        },
                        {
                            name: '与时光赛跑',
                            value: 34000,
                            symbolSize: 100,
                            draggable: true,
                            itemStyle: {
                                shadowBlur: 100,
                                shadowColor: colorList[12],
                                color: colorList[12],
                            },
                        },
                        {
                            name: '清澈的爱只为中国',
                            value: 27000,
                            symbolSize: 90,
                            draggable: true,
                            itemStyle: {
                                shadowBlur: 100,
                                shadowColor: colorList[16],
                                color: colorList[16],
                            },
                        },
                        {
                            name: '我们5岁了',
                            value: 53000,
                            symbolSize: 110,
                            draggable: true,
                            itemStyle: {
                                shadowBlur: 100,
                                shadowColor: colorList[13],
                                color: colorList[13],
                            },
                        },
                        {
                            name: 'IPO上市',
                            value: 42000,
                            symbolSize: 102,
                            draggable: true,
                            itemStyle: {
                                shadowBlur: 100,
                                shadowColor: colorList[18],
                                color: colorList[18],
                            },
                        },
                        {
                            name: '印度崩溃',
                            value: 20000,
                            symbolSize: 80,
                            draggable: true,
                            itemStyle: {
                                shadowBlur: 100,
                                shadowColor: colorList[19],
                                color: colorList[19],
                            },
                        },
                    ],
                },
            ],
        };
        echarts.init(this.container).setOption(option);
    }

    render() {
        return (
            <div id='main' ref={element => {
                this.container = element
            }} style={{width: '630px', height: '428px', position: 'absolute', top: '546px', left: '1524px'}}/>
        );
    }
}

export default HotWord;
