import React, {Component} from 'react';
import {
    AutoComplete,
    Button,
    Input,
    message,
    Progress,
    Space,
    Spin,
    Table,
    DatePicker,
    ConfigProvider,
    Checkbox,
    Slider
} from "antd";
import {
    CalendarOutlined, CheckOutlined,
    DeliveredProcedureOutlined,
    DownloadOutlined, FilterOutlined,
    LockOutlined,
    MailOutlined, PercentageOutlined, RedoOutlined, SearchOutlined, TeamOutlined,
    UnlockOutlined
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import 'moment/locale/zh-cn';
import zhCN from "antd/lib/locale/zh_CN";
import ExcelJS from 'exceljs';
import FileSaver from 'file-saver';

import Guidepost from "../Guidepost";
import Store from "../../../../redux/store";

const {Column} = Table;
const {store} = Store;
const {RangePicker} = DatePicker;

moment.locale('zh-cn');

class Index extends Component {

    /**
     * 初始化state
     * @type {{stateKeys: [], sourceKeys: [], memberKeys: [], selectedRowKeys: [], spin: boolean, options: [], timeKeys: [], dataSource: [], nameKeys: []}}
     */
    state = {
        spin: true,//数据加载状态
        dataSource: [],//表格数据源
        selectedRowKeys: [],//选中表格行的keys
        options: [],//企业名称搜索框自动展示数据源
        nameKeys: [],//通过企业名称筛选的keys
        timeKeys: [],//通过注册时间筛选的keys
        stateKeys: [],//通过状态筛选的keys
        memberKeys: [],//通过成员熟练给筛选的keys
        sourceKeys: [],//通过资源使用筛选的keys
    }

    componentDidMount() {
        this.updateCompaniesList();
    }

    updateCompaniesList = () => {
        this.setState({spin: true});
        axios(
            {
                url: 'http://192.168.101.4:3000/api/getCompaniesList',
                method: 'post',
                headers: {authorization: store.getState().token}
            }
        ).then(response => {
            const {result} = response.data;
            // console.log(result);
            if (result.length === 0) {
                this.setState({spin: false});
            } else {
                const dataSource = result.map(item => {
                    item.key = item.identity;
                    delete item.identity;
                    return item;
                });
                this.setState({spin: false, dataSource: dataSource}, () => {
                    message.success('企业信息更新成功！').then();
                });
            }
        }).catch(err => {
            console.log(err);
            this.setState({spin: false});
            message.error('企业信息获取失败，请联系后台管理员处理！').then();
        });
    }

    rowOnChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys: selectedRowKeys});
    }

    filterRules = (_, record) => {
        const {nameKeys, timeKeys, stateKeys, memberKeys, sourceKeys} = this.state;
        // console.log('姓名筛选：',nameKeys);
        // console.log('时间筛选：',timeKeys);
        // console.log('状态筛选：',stateKeys);
        // console.log('成员筛选：',memberKeys);
        // console.log('资源筛选：',sourceKeys);
        if (!nameKeys.length && !timeKeys.length && !stateKeys.length && !memberKeys.length && !sourceKeys.length) {//如果都没有执行筛选
            return true;
        } else if (nameKeys.includes(-1) || timeKeys.includes(-1) || stateKeys.includes(-1) || memberKeys.includes(-1) || sourceKeys.includes(-1)) {//如果任一筛选结果为空
            return false;
        } else {
            return ((nameKeys.length && nameKeys.includes(record.key)) || !nameKeys.length) &&
                ((timeKeys.length && timeKeys.includes(record.key)) || !timeKeys.length) &&
                ((stateKeys.length && stateKeys.includes(record.key)) || !stateKeys.length) &&
                ((memberKeys.length && memberKeys.includes(record.key)) || !memberKeys.length) &&
                ((sourceKeys.length && sourceKeys.includes(record.key)) || !sourceKeys.length)
        }
    }

    searchByName = () => ({
        filterDropdown: ({setSelectedKeys, _, confirm, clearFilters}) => (
            <div style={{padding: 8, width: '200px'}}>
                <AutoComplete dropdownMatchSelectWidth={240} notFoundContent='未搜索到结果' options={this.state.options}
                              onChange={value => {
                                  if (!value) {
                                      this.setState({options: []});
                                      return;
                                  }
                                  const options = [];
                                  const keys = [];
                                  this.state.dataSource.forEach(item => {
                                      if (item.name.includes(value)) {
                                          options.push({value: item.name});
                                          keys.push(item.key);
                                      }
                                  });
                                  setSelectedKeys(keys);
                                  this.setState({options: options});
                              }}
                              children={<Input.Search allowClear placeholder={'按名称搜索'} onSearch={value => {
                                  if (!value) {
                                      clearFilters();
                                      this.setState({nameKeys: []});
                                  } else {
                                      const keys = [];
                                      this.state.dataSource.forEach(item => {
                                          if (item.name.includes(value)) {
                                              keys.push(item.key);
                                          }
                                      });
                                      if (keys.length === 0) {
                                          keys.push(-1);
                                      }
                                      setSelectedKeys(keys);
                                      confirm();
                                      this.setState({nameKeys: keys});
                                  }
                              }}
                              />}
                />
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#1890ff' : 'darkgray'}}/>,
        onFilter: this.filterRules
    })

    searchByTime = () => ({
        filterDropdown: ({setSelectedKeys, _, confirm, clearFilters}) => (
            <div style={{padding: 8, width: '240px'}}>
                <RangePicker disabledDate={current => (current > moment().endOf('day'))} onChange={dates => {
                    if (!dates) {
                        clearFilters();
                        setSelectedKeys([]);
                        this.setState({timeKeys: []});
                    } else {
                        const {dataSource} = this.state;
                        const keys = [];
                        dataSource.forEach(item => {
                            if (moment(item.register_time).endOf('day') > dates[0].startOf('day') && moment(item.register_time).startOf('day') < dates[1].endOf('day')) {
                                keys.push(item.key);
                            }
                        });
                        if (keys.length === 0) {
                            keys.push(-1);
                        }
                        setSelectedKeys(keys);
                        confirm();
                        this.setState({timeKeys: keys});
                    }
                }}/>
            </div>
        ),
        filterIcon: filtered => <CalendarOutlined style={{color: filtered ? '#1890ff' : 'darkgray'}}/>,
        onFilter: this.filterRules
    })

    searchByState = () => ({
        filterDropdown: ({setSelectedKeys, _, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Space direction='vertical' size={10}>
                    <Checkbox defaultChecked ref={node => {
                        this.checkValid = node
                    }}>有效</Checkbox>
                    <Checkbox defaultChecked ref={node => {
                        this.checkFreeze = node
                    }}>冻结</Checkbox>
                    <Checkbox defaultChecked ref={node => {
                        this.checkBlacklist = node
                    }}>黑名单</Checkbox>
                </Space>
                <div style={{marginTop: '10px', textAlign: 'right'}}>
                    <Button size='small' icon={<RedoOutlined/>} title='重置筛选' style={{float: 'left'}} onClick={() => {
                        if (this.checkValid.state.checked && this.checkFreeze.state.checked && this.checkBlacklist.state.checked) {
                            return;
                        }
                        // noinspection JSUnresolvedFunction
                        this.checkValid.setState({checked: true});
                        // noinspection JSUnresolvedFunction
                        this.checkFreeze.setState({checked: true});
                        // noinspection JSUnresolvedFunction
                        this.checkBlacklist.setState({checked: true});
                        clearFilters();
                        this.setState({stateKeys: []});
                    }}/>
                    <Button size='small' type='primary' icon={<CheckOutlined/>} title='执行筛选' onClick={() => {
                        if (this.checkValid.state.checked && this.checkFreeze.state.checked && this.checkBlacklist.state.checked) {
                            setSelectedKeys([]);
                            confirm();
                            this.setState({stateKLeys: []});
                            return;
                        }
                        const tmp = [];
                        if (this.checkValid.state.checked) {
                            tmp.push(1);
                        }
                        if (this.checkFreeze.state.checked) {
                            tmp.push(-1);
                        }
                        if (this.checkBlacklist.state.checked) {
                            tmp.push(-2);
                        }
                        const keys = [];
                        this.state.dataSource.forEach(item => {
                            if (tmp.includes(item.state)) {
                                keys.push(item.key);
                            }
                        });
                        if (keys.length === 0) {
                            keys.push(-1)
                        }
                        setSelectedKeys(keys);
                        console.log('状态筛选结果：', keys);
                        confirm();
                        this.setState({stateKeys: keys});
                    }}/>
                </div>
            </div>
        ),
        filterIcon: filtered => <FilterOutlined style={{color: filtered ? '#1890ff' : 'darkgray'}}/>,
        onFilter: this.filterRules
    })

    searchByMembers = () => ({
        filterDropdown: ({setSelectedKeys, _, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Space direction='vertical' size={10}>
                    <div>
                        <Input size='small' style={{width: '120px'}} placeholder='请输入最小值' onChange={e => {
                            const value = e.currentTarget.value;
                            if (isNaN(Number.parseInt(value)) || Number.parseInt(value) < 0) {
                                message.warn({content: '必须输入不小于0的整数！', duration: 1}).then();
                            }
                        }} ref={node => {
                            this.minNum = node
                        }}/>
                    </div>
                    <div>
                        <Input size='small' style={{width: '120px'}} placeholder='请输入最大值' onChange={(e) => {
                            const value = e.currentTarget.value;
                            if (isNaN(Number.parseInt(value)) || Number.parseInt(value) < 0) {
                                message.warn({content: '必须输入不小于0的整数！', duration: 1}).then();
                            }
                        }} ref={node => {
                            this.maxNum = node
                        }}/>
                    </div>
                    <div>
                        <Button size='small' icon={<RedoOutlined/>} title='重置筛选' style={{float: 'left'}}
                                onClick={() => {
                                    clearFilters();
                                    this.minNum.setState({value: ''});
                                    this.maxNum.setState({value: ''});
                                    this.setState({memberKeys: []});
                                }}/>
                        <Button size='small' type='primary' style={{float: 'right'}} icon={<CheckOutlined/>}
                                title='执行筛选' onClick={() => {
                            const min = this.minNum.state.value;
                            console.log('最小值：', min);
                            const max = this.maxNum.state.value;
                            console.log('最大值：', max);
                            if (min && max && max >= min) {
                                const keys = [];
                                this.state.dataSource.forEach(item => {
                                    console.log(item.members);
                                    if (item.members >= min && item.members <= max) {
                                        keys.push(item.key);
                                    }
                                });
                                if (keys.length === 0) {
                                    keys.push(-1);
                                }
                                setSelectedKeys(keys);
                                confirm();
                                // console.log('成员数量筛选：', selectedKeys);
                                this.setState({memberKeys: keys});
                            } else {
                                message.warn('成员数量筛选最大值不得小于最小值！').then();
                            }
                        }}/>
                    </div>
                </Space>
            </div>
        ),
        filterIcon: filtered => <TeamOutlined style={{color: filtered ? '#1890ff' : 'darkgray'}}/>,
        onFilter: this.filterRules
    })

    searchBySource = () => ({
        filterDropdown: ({setSelectedKeys, _, confirm, clearFilters}) => {
            return (<div style={{padding: 8, width: '200px', overflow: 'auto'}}>
                <Slider range defaultValue={[0, 100]}
                        marks={{0: 0, 100: {style: {color: 'red'}, label: <span>100</span>}}} ref={(node) => {
                    this.sourceRange = node
                }}/>
                <Button size='small' icon={<RedoOutlined/>} title='重置筛选' style={{float: 'left'}} onClick={() => {
                    this.sourceRange.setState({bounds: [0, 100]}, () => {
                        clearFilters();
                        this.setState({sourceKeys: []});
                    });
                }}/>
                <Button size='small' type='primary' style={{float: 'right'}} icon={<CheckOutlined/>} title='执行筛选'
                        onClick={() => {
                            const {bounds} = this.sourceRange.state;
                            // console.log(bounds);
                            if (bounds[0] === 0 && bounds[1] === 100) {
                                return;
                            }
                            const keys = [];
                            this.state.dataSource.forEach(item => {
                                const percent = Math.floor(item.source * 100);
                                console.log(percent);
                                if (percent >= bounds[0] && percent <= bounds[1]) {
                                    keys.push(item.key);
                                }
                            });
                            if (keys.length === 0) {
                                keys.push(-1);
                            }
                            setSelectedKeys(keys);
                            // console.log('资源筛选：', selectedKeys);
                            confirm();
                            this.setState({sourceKeys: keys});
                        }}/>
            </div>)
        },
        filterIcon: filtered => <PercentageOutlined style={{color: filtered ? '#1890ff' : 'darkgray'}}/>,
        onFilter: this.filterRules
    })

    exportList=(data)=>{
        return ()=>{
            axios(
                {
                    url:'http://192.168.101.4:3000/api/exportList',
                    method:'post',
                    data:{keys:data},
                    headers:{authorization: store.getState().token}
                }
            ).then(response=>{
                const list=response.data.result;
                // console.log(list);
                const workbook = new ExcelJS.Workbook();
                workbook.creator = '飞云互联';
                workbook.lastModifiedBy = '飞云互联';
                workbook.created = new Date();
                workbook.modified = new Date();
                workbook.lastPrinted = new Date();
                const sheet = workbook.addWorksheet('企业数据');
                sheet.columns=[
                    {header:'企业代码',key:'code'},
                    {header:'企业名称',key:'name'},
                    {header:'管理邮箱',key:'email'},
                    {header:'企业站点',key:'site'},
                    {header:'联系地址',key:'address'},
                    {header:'联系电话',key:'mobile'},
                    {header:'固定电话',key:'telephone'},
                    {header:'企业传真',key:'fax'},
                    {header:'注册时间',key:'register_time'},
                    {header:'资源使用',key:'source'},
                    {header:'企业状态',key:'state'},
                    {header:'成员数量',key:'members'},
                    {header:'企业识别码',key:'identity'}
                ];
                list.forEach(item=>{
                    item.register_time=moment(item.register_time).format('YYYY-MM-DD');
                    // noinspection JSIncompatibleTypesComparison
                    item.state=item.state===1?'有效':item.state===-1?'冻结':'黑名单';
                    item.source=Math.floor(item.source*100)+'%';
                });
                sheet.addRows(list);
                workbook.xlsx.writeBuffer().then(data=>{
                    const blob=new Blob([data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
                    FileSaver.saveAs(blob,'企业数据.xlsx');
                    message.success('企业数据导出成功！').then();
                });
            }).catch();
        }
    }

    render() {
        return (
            <>
                <Guidepost guides={['系统管理', '企业管理', '基础信息']}/>
                {
                    this.state.spin ? <Spin tip='正在获取企业信息......' style={{width: '100%'}}/> :
                        <>
                            <div style={{height: '40px', width: '100%', lineHeight: '40px'}}>
                                <div style={{height: '40px', float: 'left', lineHeight: '40px'}}>
                                    <span>{this.state.selectedRowKeys.length === 0 ? '' : `共选中${this.state.selectedRowKeys.length}条数据`}</span>
                                </div>
                                <div style={{height: '40px', float: 'right', lineHeight: '40px', paddingRight: '10px'}}>
                                    <Space size={15}>
                                        <Button size='small' type='link' disabled={!this.state.dataSource.length}
                                                icon={<DeliveredProcedureOutlined style={{fontSize: '16px'}}
                                                                                  title='导出全部企业信息'/>} onClick={this.exportList([])}/>
                                        <Button size='small' type='link' disabled={!this.state.selectedRowKeys.length}
                                                icon={<DownloadOutlined style={{fontSize: '16px'}} title='导出选中企业信息' onClick={this.exportList(this.state.selectedRowKeys)}/>}/>
                                    </Space>
                                </div>
                            </div>
                            <Table dataSource={this.state.dataSource} locale={{emptyText: '暂无企业数据'}}
                                   pagination={{hideOnSinglePage: true}}
                                   rowSelection={{fixed: true, onChange: this.rowOnChange}}>
                                <Column title='企业名称' dataIndex='name' key='name' align='center' width='10%'
                                        ellipsis {...this.searchByName()}/>
                                <Column title='注册时间' dataIndex='register_time' key='register_time' align='center'
                                        width='10%' ellipsis render={time => moment(time).format('YYYY-MM-DD')}
                                        sorter={(a, b) => (new Date(a.register_time).getTime() - new Date(b.register_time).getTime())}
                                        showSorterTooltip={{title: '按时间排序'}} {...this.searchByTime()}/>
                                <Column title='企业站点' dataIndex='site' key='site' align='center' width='10%' ellipsis
                                        render={site => (
                                            <a href={site} target='_blank' rel='noreferrer'>{site}</a>)}/>
                                <Column title='联系地址' dataIndex='address' key='address' align='center' width='10%'
                                        ellipsis/>
                                <Column title='联系电话' dataIndex='mobile' key='mobile' align='center' width='10%'
                                        ellipsis/>
                                <Column title='注册邮箱' dataIndex='email' key='email' align='center' width='10%'
                                        ellipsis/>
                                <Column title='当前状态' dataIndex='state' key='state' align='center' width='10%'
                                        ellipsis {...this.searchByState()}
                                        render={state => (state === 1 ? '有效' : state === -1 ? '冻结' : '黑名单')}/>
                                <Column title='成员数量' dataIndex='members' key='members' align='center' width='10%'
                                        ellipsis sorter={(a, b) => (a.members - b.members)} {...this.searchByMembers()}
                                        showSorterTooltip={{title: '按成员数量排序'}}/>
                                <Column title='套餐使用' dataIndex='source' key='source' align='center' width='10%'
                                        ellipsis {...this.searchBySource()}
                                        render={source => {
                                            let strokeColor = {
                                                0: '#108ee9',
                                                100: '#87d068'
                                            };
                                            if (source * 100 > 80) {
                                                strokeColor = {
                                                    0: '#FFB6C1',
                                                    100: '#CD2626'
                                                };
                                            }
                                            return (
                                                <Progress width={30} type='circle' showInfo={true}
                                                          strokeColor={strokeColor}
                                                          percent={Math.floor(source * 100)} strokeWidth={10}
                                                          title={`资源使用率：${Math.floor(source * 100)}%`}/>);
                                        }}/>
                                <Column title='快捷操作' dataIndex='option' key='option' align='center' width='10%'
                                        ellipsis render={(_, record) => (
                                    <Space size={10}>
                                        <Button type='link'
                                                icon={<MailOutlined style={{fontSize: '16px'}}/>}
                                                title='发送消息'/>
                                        {
                                            record.state === 1 ?
                                                <Button type='link' icon={<UnlockOutlined/>}
                                                        style={{fontSize: '16px'}} title='冻结组织'/> :
                                                <Button type='link' icon={<LockOutlined/>}
                                                        style={{fontSize: '16px'}} title='启用组织'/>
                                        }
                                    </Space>
                                )
                                }/>
                            </Table>
                        </>

                }
            </>
        );
    }
}

const Manage = () => (
    <ConfigProvider locale={zhCN}>
        <Index/>
    </ConfigProvider>
);

export default Manage;