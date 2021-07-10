import React, {Component} from 'react';
import * as echarts from 'echarts/core';
import {BarChart, ScatterChart} from "echarts/charts";
import {TooltipComponent, GridComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([BarChart, ScatterChart, TooltipComponent, GridComponent, CanvasRenderer]);

class Efficiency extends Component {

    componentDidMount() {
        const myColor = ['#00a381', '#b44c97', '#a2d7dd', '#00a3af', '#33FFCC'];
        const option = {
            title: {
                text: '部门流转效率排名',
                left: 'center',
                top: 15,
                textStyle: {
                    color: 'white'
                }
            },
            tooltip: {
                trigger: 'item',
                show: false
            },
            grid: {
                left: 70,
                top: '12%',
                right: 50,
                bottom: '8%',
                containLabel: true
            },
            xAxis: [
                {
                    show: false,
                }
            ],
            yAxis: [
                {
                    axisTick: 'none',
                    axisLine: 'none',
                    offset: '27',
                    axisLabel: {
                        color: '#ffffff',
                        fontSize: 16,
                    },
                    data: ['市场经营部', '销售管理部', '业务支撑中心', '产品研发部', '行政中心']
                },
                {
                    axisTick: 'none',
                    axisLine: 'none',
                    axisLabel: {
                        color: '#ffffff',
                        fontSize: 16,
                    },
                    data: ['5', '4', '3', '2', '1']
                },
                {
                    nameGap: '50',
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(0,0,0,0)'
                        }
                    },
                    data: [],
                }
            ],
            series: [
                {
                    name: '流转效率',
                    type: 'bar',
                    yAxisIndex: 0,
                    data: [44, 50, 52, 60, 72],
                    tooltip: {
                        show: true,
                        formatter: (params) => {
                            return `${params.seriesName}   ${params.data}次/小时`
                        }
                    },
                    label: {
                        show: true,
                        position:'right',
                        color: '#ffffff',
                        fontSize: 14,
                    },
                    barWidth: 12,
                    itemStyle: {
                        color: function (params) {
                            const num = myColor.length;
                            return myColor[params.dataIndex % num]
                        },

                    },
                    z: 2
                },
                {
                    type: 'bar',
                    yAxisIndex: 1,
                    barGap: '-100%',
                    data: [99, 99.5, 99.5, 99.5, 99.5],
                    barWidth: 20,
                    itemStyle: {
                        color: '#0e2147',
                        borderRadius: 5,
                    },
                    z: 1
                },
                {
                    name: '外框',
                    type: 'bar',
                    yAxisIndex: 2,
                    barGap: '-100%',
                    data: [100, 100, 100, 100, 100],
                    barWidth: 24,
                    itemStyle: {
                        color: function (params) {
                            const num = myColor.length;
                            return myColor[params.dataIndex % num]
                        },
                        borderRadius: 5,
                    },
                    z: 0
                },
                {
                    name: '外圆',
                    type: 'scatter',
                    hoverAnimation: false,
                    data: [0, 0, 0, 0, 0],
                    yAxisIndex: 2,
                    symbolSize: 35,
                    itemStyle: {
                        color: function (params) {
                            const num = myColor.length;
                            return myColor[params.dataIndex % num]
                        },
                        opacity: 1,
                    },
                    z: 2
                }
            ]
        };
        echarts.init(this.container).setOption(option);
    }

    render() {
        return (
            <div ref={element => {
                this.container = element
            }} style={{width: '630px', height: '428px', position: 'absolute', left: '1524px', top: '96px'}}/>
        );
    }
}

export default Efficiency;
