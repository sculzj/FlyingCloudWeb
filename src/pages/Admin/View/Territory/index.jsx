import React, {Component} from 'react';
import * as echarts from 'echarts/core';
import {MapChart, EffectScatterChart} from 'echarts/charts';
import {TitleComponent,TooltipComponent,GeoComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import china from '../../../../resource/china.json';
echarts.use([MapChart, EffectScatterChart,TitleComponent,TooltipComponent,GeoComponent,CanvasRenderer]);

class Territory extends Component {

    componentDidMount() {
        const outname = ['北京市', '浙江省', '四川省', '广东省', '陕西省'];
        const outvalue = [2210, 1210, 2650, 2100, 890];
        const outdata = [];
        let max = 6000, min = 10;
        let maxSize4Pin = 100, minSize4Pin = 20;
        for (let i = 0; i < outname.length; i++) {
            outdata.push({
                name: outname[i],
                value: outvalue[i]
            })
        }
        const geoCoordMap = {};
        /*获取地图数据*/
        echarts.registerMap('china',china);
        const mapFeatures = echarts.getMap('china').geoJSON.features;
        mapFeatures.forEach(function (v) {
            // 地区名称
            const name = v.properties.name;
            // 地区经纬度
            geoCoordMap[name] = v.properties.center;

        });
        const convertData = function (outdata) {
            const res = [];
            for (let i = 0; i < outdata.length; i++) {
                const geoCoord = geoCoordMap[outdata[i].name];
                if (geoCoord) {
                    res.push({
                        name: outdata[i].name,
                        value: geoCoord.concat(outdata[i].value),
                    });
                }
            }
            return res;
        };
        const option = {
            title: {
                text: 'XX热力分布图',
                left: 'center',
                top: 15,
                textStyle: {
                    color: 'white',
                    fontSize:24
                }
            },
            geo: {
                map: 'china',
                show: true,
                roam: false,
                layoutSize: "110%",
                left: 100,
                right:100,
                top:50,
                itemStyle: {
                    borderColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: '#00F6FF'
                        },
                        {
                            offset: 1,
                            color: '#53D9FF'
                        }
                    ], false),
                    borderWidth: 2,
                    shadowColor: 'rgba(10,76,139,1)',
                    shadowOffsetY: 0,
                    shadowBlur: 60
                }
            },
            series: [
                {
                    type: 'map',
                    map: 'china',
                    left: 100,
                    right:100,
                    top:50,
                    aspectScale: 0.75,
                    label: {
                        show: false
                    },
                    itemStyle: {
                        areaColor: {
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: '#073684' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#061E3D' // 100% 处的颜色
                            }],
                        },
                        borderColor: '#215495',
                        borderWidth: 1,
                    },
                    data: outdata,
                },
                {
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    showEffectOn: 'render',
                    itemStyle: {
                        color: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.5,
                            colorStops: [{
                                offset: 0,
                                color: 'rgba(5,80,151,0.2)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(5,80,151,0.8)'
                            }, {
                                offset: 1,
                                color: 'rgba(0,108,255,0.7)'
                            }],
                            global: false // 缺省为 false
                        },
                    },
                    label: {
                        show: true,
                        color: '#fff',
                        fontWeight: 'normal',
                        x:'50%',
                        y:'50%',
                        formatter: function (para) {
                            return `${para.name} ${para.data.value[2]}人`;
                        }
                    },
                    symbol: 'circle',
                    symbolSize: function (val) {
                        if (val[2] === 0) {
                            return 0;
                        }
                        const a = (maxSize4Pin - minSize4Pin) / (max - min);
                        const b = maxSize4Pin - a * max;
                        return a * val[2] + b * 1.2;
                    },
                    data: convertData(outdata),
                    zlevel: 1,
                }
            ]
        };
        echarts.init(this.container).setOption(option);
    }

    render() {
        return (
            <div ref={element => {
                this.container = element
            }} style={{width: '870px', height: '828px', position: 'absolute', top: '184px', left: '656px'}}/>
        );
    }
}

export default Territory;
