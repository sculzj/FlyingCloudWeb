import React, {Component} from 'react';

import * as echarts from 'echarts/core';
import {GaugeChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([GaugeChart, CanvasRenderer]);

class GroupRate extends Component {

    componentDidMount() {
        const echart = echarts.init(this.container);
        const highlight = '#03b7c9';
        const demoData = [
            {name: '效率评级', value: 78, unit: '分', pos: ['25%', '60%'], range: [0, 100]},
            {name: '数据评级', value: 92, unit: '分', pos: ['75%', '60%'], range: [0, 100]},
        ];

        const option = {
            title: {text: '综合评级', left: 'center', textStyle: {color: 'white'}, top: 15},
            series: (function () {
                const result = [];
                demoData.forEach(function (item) {
                    result.push(
                        // 外围刻度
                        {
                            type: 'gauge',
                            center: item.pos,
                            radius: 135,
                            splitNumber: item.splitNum || 10,
                            min: item.range[0],
                            max: item.range[1],
                            startAngle: 180,
                            endAngle: 0,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    width: 3,
                                    shadowBlur: 0,
                                    color: [
                                        [1, highlight]
                                    ]
                                }
                            },
                            axisTick: {
                                show: true,
                                lineStyle: {
                                    color: highlight,
                                    width: 1
                                },
                                length: -5,
                                splitNumber: 10
                            },
                            splitLine: {
                                show: true,
                                length: -14,
                                lineStyle: {
                                    color: highlight,
                                }
                            },
                            axisLabel: {
                                distance: -15,
                                color: highlight,
                                fontSize: '14',
                                fontWeight: 'bold'
                            },
                            pointer: {
                                show: 0
                            },
                            detail: {
                                show: 0
                            }
                        },

                        // 内侧指针、数值显示
                        {
                            name: item.name,
                            type: 'gauge',
                            center: item.pos,
                            radius: 115,
                            startAngle: 180,
                            endAngle: 0,
                            min: item.range[0],
                            max: item.range[1],
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    width: 10,
                                    color: [
                                        [1, 'rgba(255,255,255,.1)']
                                    ]
                                }
                            },
                            axisTick: {
                                show: 0,
                            },
                            splitLine: {
                                show: 0,
                            },
                            axisLabel: {
                                show: 0
                            },
                            pointer: {
                                show: true,
                                length: '105%'
                            },
                            detail: {
                                show: true,
                                offsetCenter: [0, '40%'],
                                fontSize: 20,
                                color: '#fff',
                                formatter: [
                                    '{value} ' + (item.unit || ''),
                                    '{name|' + item.name + '}'
                                ].join('\n'),
                                rich: {
                                    name: {
                                        fontSize: 16,
                                        lineHeight: 30,
                                        color: '#ddd'
                                    }
                                }
                            },
                            itemStyle: {
                                color: highlight,
                            },
                            data: [{
                                value: item.value
                            }]
                        }
                    );
                });

                return result;
            })()
        };
        option && echart.setOption(option);
    }

    render() {
        return (
            <div id='main' ref={element => {
                this.container = element
            }} style={{
                width: '630px',
                height: '428px',
                position: 'absolute',
                top: '546px',
                left: '12px'
            }}/>
        );
    }
}

export default GroupRate;
