import React, {Component} from 'react';
import * as echarts from 'echarts/core';
import 'echarts-liquidfill/src/liquidFill';

class Resource extends Component {

    componentDidMount() {
        const option = {
            title: {
                text: '资源使用率',
                left: 'center',
                top: 15,
                textStyle: {
                    color: 'white'
                }
            },
            series: [
                {
                    type: 'liquidFill',
                    name: '企业云盘',
                    radius: '40%',
                    center: ['30%', '30%'],
                    //  shape: 'roundRect',
                    data: [0.35, 0.35, 0.35],
                    backgroundStyle: {
                        color: {
                            type: 'linear',
                            x: 1,
                            y: 0,
                            x2: 0.5,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 1,
                                    color: 'rgba(68, 145, 253, 0)',
                                },
                                {
                                    offset: 0.5,
                                    color: 'rgba(68, 145, 253, .25)',
                                },
                                {
                                    offset: 0,
                                    color: 'rgba(68, 145, 253, 1)',
                                },
                            ],
                            globalCoord: false,
                        },
                    },
                    outline: {
                        borderDistance: 0,
                        itemStyle: {
                            borderWidth: 10,
                            borderColor: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: 'rgba(69, 73, 240, 0)',
                                    },
                                    {
                                        offset: 0.5,
                                        color: 'rgba(69, 73, 240, .25)',
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(69, 73, 240, 1)',
                                    },
                                ],
                                globalCoord: false,
                            },
                            shadowBlur: 10,
                            shadowColor: '#000',
                        },
                    },
                    color:
                        [{
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 1,
                                    color: 'rgba(0, 153, 0, 0)',
                                },
                                {
                                    offset: 0.5,
                                    color: 'rgba(0, 153, 0, .2)',
                                },
                                {
                                    offset: 0,
                                    color: 'rgba(0, 153, 0, 1)',
                                },
                            ],
                            globalCoord: false
                        }]
                    ,
                    label: {
                        x:'50%',
                        y:'50%',
                        formatter: (params) => {
                            return `${params.value * 100}%\n\n\n${params.seriesName}`
                        },
                        fontSize: 18,
                        color:'white'
                    },
                },
                {
                    type: 'liquidFill',
                    name: '成员授权',
                    radius: '40%',
                    center: ['70%', '30%'],
                    //  shape: 'roundRect',
                    data: [0.83, 0.83, 0.83],
                    backgroundStyle: {
                        color: {
                            type: 'linear',
                            x: 1,
                            y: 0,
                            x2: 0.5,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 1,
                                    color: 'rgba(68, 145, 253, 0)',
                                },
                                {
                                    offset: 0.5,
                                    color: 'rgba(68, 145, 253, .25)',
                                },
                                {
                                    offset: 0,
                                    color: 'rgba(68, 145, 253, 1)',
                                },
                            ],
                            globalCoord: false,
                        },
                    },
                    outline: {
                        borderDistance: 0,
                        itemStyle: {
                            borderWidth: 10,
                            borderColor: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: 'rgba(69, 73, 240, 0)',
                                    },
                                    {
                                        offset: 0.5,
                                        color: 'rgba(69, 73, 240, .25)',
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(69, 73, 240, 1)',
                                    },
                                ],
                                globalCoord: false,
                            },
                            shadowBlur: 10,
                            shadowColor: '#000',
                        },
                    },
                    color: [{
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 1,
                                color: 'rgba(255, 102, 102, 0)',
                            },
                            {
                                offset: 0.5,
                                color: 'rgba(255, 102, 102, .2)',
                            },
                            {
                                offset: 0,
                                color: 'rgba(255, 102, 102, 1)',
                            },
                        ],
                        globalCoord: false,
                    }],
                    label: {
                        x:'50%',
                        y:'50%',
                        formatter: (params) => {
                            return `${params.value * 100}%\n\n\n${params.seriesName}`
                        },
                        fontSize: 18,
                        color: 'white'
                    },
                },
                {
                    type: 'liquidFill',
                    name: '邮箱授权',
                    radius: '40%',
                    center: ['30%', '75%'],
                    //  shape: 'roundRect',
                    data: [0.60, 0.60, 0.60],
                    backgroundStyle: {
                        color: {
                            type: 'linear',
                            x: 1,
                            y: 0,
                            x2: 0.5,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 1,
                                    color: 'rgba(68, 145, 253, 0)',
                                },
                                {
                                    offset: 0.5,
                                    color: 'rgba(68, 145, 253, .25)',
                                },
                                {
                                    offset: 0,
                                    color: 'rgba(68, 145, 253, 1)',
                                },
                            ],
                            globalCoord: false,
                        },
                    },
                    outline: {
                        borderDistance: 0,
                        itemStyle: {
                            borderWidth: 10,
                            borderColor: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: 'rgba(69, 73, 240, 0)',
                                    },
                                    {
                                        offset: 0.5,
                                        color: 'rgba(69, 73, 240, .25)',
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(69, 73, 240, 1)',
                                    },
                                ],
                                globalCoord: false,
                            },
                            shadowBlur: 10,
                            shadowColor: '#000',
                        },
                    },
                    color: [{
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 1,
                                color: 'rgba(58, 71, 212, 0)',
                            },
                            {
                                offset: 0.5,
                                color: 'rgba(31, 222, 225, .2)',
                            },
                            {
                                offset: 0,
                                color: 'rgba(31, 222, 225, 1)',
                            },
                        ],
                        globalCoord: false,
                    }],
                    label: {
                        x:'50%',
                        y:'50%',
                        formatter: (params) => {
                            return `${params.value * 100}%\n\n\n${params.seriesName}`
                        },
                        fontSize: 18,
                        color: 'white'
                    },
                },
                {
                    type: 'liquidFill',
                    name: '账户余额',
                    radius: '40%',
                    center: ['70%', '75%'],
                    //  shape: 'roundRect',
                    data: [0.13, 0.13, 0.13],
                    backgroundStyle: {
                        color: {
                            type: 'linear',
                            x: 1,
                            y: 0,
                            x2: 0.5,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 1,
                                    color: 'rgba(69, 73, 240, 0)',
                                },
                                {
                                    offset: 0.5,
                                    color: 'rgba(69, 73, 240, .25)',
                                },
                                {
                                    offset: 0,
                                    color: 'rgba(69, 73, 240, 1)',
                                },
                            ],
                            globalCoord: false,
                        },
                    },
                    outline: {
                        borderDistance: 0,
                        itemStyle: {
                            borderWidth: 10,
                            borderColor: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: 'rgba(69, 73, 240, 0)',
                                    },
                                    {
                                        offset: 0.5,
                                        color: 'rgba(69, 73, 240, .25)',
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(69, 73, 240, 1)',
                                    },
                                ],
                                globalCoord: false,
                            },
                            shadowBlur: 10,
                            shadowColor: '#000',
                        },
                    },
                    color: [{
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 1,
                                color: 'rgba(255, 51, 102, 0)',
                            },
                            {
                                offset: 0.5,
                                color: 'rgba(255, 51, 102, .2)',
                            },
                            {
                                offset: 0,
                                color: 'rgba(255, 51, 102, 1)',
                            },
                        ],
                        globalCoord: false,
                    }],
                    label: {
                        x:'50%',
                        y:'50%',
                        formatter: (params) => {
                            return `${params.value * 100}%\n\n\n${params.seriesName}`
                        },
                        fontSize: 18,
                        color:'white'
                    },
                },
            ],
        };

        echarts.init(this.container).setOption(option);
    }

    render() {
        return (
            <div id='main' ref={element => {
                this.container = element
            }} style={{width: '630px', height: '428px',position:'absolute',top:'990px',left:'1524px'}}/>
        );
    }
}

export default Resource;
