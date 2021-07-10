import React, {Component} from 'react';
import * as echarts from 'echarts/core';
import {TimelineComponent, TitleComponent, TooltipComponent, GridComponent, LegendComponent} from "echarts/components";
import {BarChart, LineChart} from 'echarts/charts';
import {CanvasRenderer} from "echarts/renderers";

echarts.use([TimelineComponent, TitleComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, BarChart, CanvasRenderer]);


class VisitorVolume extends Component {

    componentDidMount() {
        const echart = echarts.init(this.container);
        const option = {
            timeline: {
                axisType: 'category',
                data: ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00'],
                autoPlay: true,
                playInterval: '2000',
                realtime: true,
                bottom: 10,
                left: 100,
                right: 100
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#57617B',
                    },
                },
            },
            grid: {
                left: 100,
                right: 100,
                bottom: 90,
                top: 80,
                // containLabel: true,
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: '#57617B',
                        },
                    },
                    axisLabel: {
                        color: 'white'
                    },
                    data: ['OA', '邮箱', '云盘', '飞书', '论坛', '知识库'],
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '累计值',
                    min: 0,
                    max: 10000,
                    splitNumber: 5,
                    axisLine: {
                        lineStyle: {
                            color: '#57617B'
                        },
                    },
                    axisLabel: {
                        margin: 40,
                        fontSize: 14,
                        color: 'white'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#57617B',
                        },
                    },
                },
                {
                    type: 'value',
                    name: '净增值',
                    min: 0,
                    max: 1000,
                    splitNumber: 5,
                    axisLine: {
                        lineStyle: {
                            color: '#57617B',
                        },
                    },
                    axisLabel: {
                        margin: 40,
                        fontSize: 14,
                        color: 'white'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#57617B',
                        },
                    },
                },
            ],
            series: [
                {
                    name: '净增访问量 PV',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    yAxisIndex: 1,
                    showSymbol: false,
                    lineStyle: {
                        width: 1,
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgba(0, 204, 153, 0.3)',
                                },
                                {
                                    offset: 0.8,
                                    color: 'rgba(0, 204, 153,  0)',
                                },
                            ],
                            false
                        ),
                        shadowColor: 'rgba(0, 204, 153, 0.1)',
                        shadowBlur: 10,
                    },
                    itemStyle: {
                        color: 'rgb(0, 204, 153)',
                        borderColor: 'rgba(0, 204, 153,0.27)',
                        borderWidth: 12,
                    },
                },
                {
                    name: '净增访问量 UV',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    yAxisIndex: 1,
                    showSymbol: false,
                    lineStyle: {
                        width: 1,
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [
                                {
                                    offset: 0,
                                    color: 'rgba(137, 189, 27, 0.3)',
                                },
                                {
                                    offset: 0.8,
                                    color: 'rgba(137, 189, 27, 0)',
                                },
                            ],
                            false
                        ),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10,
                    },
                    itemStyle: {
                        color: 'rgb(137,189,27)',
                        borderColor: 'rgba(137,189,2,0.27)',
                        borderWidth: 12,
                    },
                },
                {
                    name: '累计访问量 PV',
                    type: 'bar',
                    barWidth: 20,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: '#fccb05',
                            },
                            {
                                offset: 1,
                                color: '#f5804d',
                            },
                        ]),
                        borderRadius: 12,
                    },
                },
                {
                    name: '累计访问量 UV',
                    type: 'bar',
                    barWidth: 20,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: '#8bd46e',
                            },
                            {
                                offset: 1,
                                color: '#09bcb7',
                            },
                        ]),
                        borderRadius: 11,
                    },
                },
            ],
            options: [
                {
                    title: {
                        text: '1点流量统计',
                        left: 'center',
                        top: 15,
                        textStyle: {
                            color: 'white'
                        }
                    },
                    series: [
                        {data: [700, 800, 750, 600, 705, 820]},
                        {data: [430, 500, 601, 480, 500, 600]},
                        {data: [6000, 7000, 8000, 9000, 8000, 7300]},
                        {data: [5000, 5500, 6000, 7000, 6200, 4300]},
                    ]
                },
                {
                    title: {
                        text: '2点流量统计',
                        left: 'center',
                        top: 15,
                        textStyle: {
                            color: 'white'
                        }
                    },
                    series: [
                        {data: [800, 900, 850, 800, 805, 920]},
                        {data: [530, 600, 701, 580, 550, 670]},
                        {data: [7000, 8000, 9000, 9400, 8900, 7900]},
                        {data: [6000, 6500, 6800, 7200, 6700, 5300]},
                    ]
                },
                {
                    title: {
                        text: '3点流量统计',
                        left: 'center',
                        top: 15,
                        textStyle: {
                            color: 'white'
                        }
                    },
                    series: [
                        {data: [700, 800, 750, 600, 705, 820]},
                        {data: [430, 500, 601, 480, 500, 600]},
                        {data: [6000, 7000, 8000, 9000, 8000, 7300]},
                        {data: [5000, 5500, 6000, 7000, 6200, 4300]},
                    ]
                },
                {
                    title: {
                        text: '4点流量统计',
                        left: 'center',
                        top: 15,
                        textStyle: {
                            color: 'white'
                        }
                    },
                    series: [
                        {data: [800, 900, 850, 800, 805, 920]},
                        {data: [530, 600, 701, 580, 550, 670]},
                        {data: [7000, 8000, 9000, 9400, 8900, 7900]},
                        {data: [6000, 6500, 6800, 7200, 6700, 5300]},
                    ]
                },
                {
                    title: {
                        text: '5点流量统计',
                        left: 'center',
                        top: 15,
                        textStyle: {
                            color: 'white'
                        }
                    },
                    series: [
                        {data: [700, 800, 750, 600, 705, 820]},
                        {data: [430, 500, 601, 480, 500, 600]},
                        {data: [6000, 7000, 8000, 9000, 8000, 7300]},
                        {data: [5000, 5500, 6000, 7000, 6200, 4300]},
                    ]
                },
                {
                    title: {
                        text: '6点流量统计',
                        left: 'center',
                        top: 15,
                        textStyle: {
                            color: 'white'
                        }
                    },
                    series: [
                        {data: [800, 900, 850, 800, 805, 920]},
                        {data: [530, 600, 701, 580, 550, 670]},
                        {data: [7000, 8000, 9000, 9400, 8900, 7900]},
                        {data: [6000, 6500, 6800, 7200, 6700, 5300]},
                    ]
                }
            ]
        };
        option && echart.setOption(option);
    }

    render() {
        return (
            <div id='main' ref={element => {
                this.container = element
            }} style={{width: '630px', height: '428px', position: 'absolute', top: '96px', left: '12px'}}/>
        );
    }
}

export default VisitorVolume;
