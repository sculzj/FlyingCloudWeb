import React, {Component} from 'react';
import * as echarts from 'echarts/core';
import {TitleComponent, TooltipComponent,LegendComponent} from 'echarts/components';
import {PieChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

class Members extends Component {

    componentDidMount() {
        const echart = echarts.init(this.container);
        const option = {
            title: {
                text: '成员结构',
                left: 'center',
                top:15,
                textStyle: {
                    color:'white'
                }
            },
            tooltip:{

            },
            legend: {
                bottom: 40,
                textStyle: {
                    color: 'white'
                }
            },
            series: [
                {
                    name: '人员分布',
                    type: 'pie',
                    radius: [30, 120],
                    center: ['50%', '45%'],
                    roseType: 'area',
                    itemStyle: {
                        borderRadius: 8
                    },
                    data: [
                        {value: 40, name: '销售人员'},
                        {value: 38, name: '研发人员'},
                        {value: 32, name: '生产人员'},
                        {value: 30, name: '管理人员'},
                        {value: 28, name: '中高级工程师'},
                        {value: 26, name: '高级科学家'},
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
            }} style={{width: '630px', height: '428px',position:'absolute',top:'995px',left:'12px'}}/>
        );
    }
}

export default Members;
