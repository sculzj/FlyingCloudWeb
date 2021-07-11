import React, {Component} from 'react';
import {Button, Modal, Progress, Space, Table} from "antd";
import {FileSearchOutlined, SisternodeOutlined} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import {Document,Page,pdfjs} from "react-pdf";

import Store from "../../../../redux/store";
import pdf from './测试PDF.pdf';

const {Column} = Table;
const {store} = Store;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class Approve extends Component {

    state = {dataSource: []}

    componentDidMount() {
        axios(
            {
                method: 'post',
                url: 'http://localhost:3000/api/applyOrgs',
                headers: {authorization: store.getState().token}
            }
        ).then(response => {
            const {result} = response.data;
            const dataSource = [];
            result.forEach((item) => {
                dataSource.push({
                    key: item.identity,
                    name: item.name,
                    time: moment(item.apply_time).format('YYYY-MM-DD HH:mm:ss'),
                    state: '等待审批',
                    consum: Math.floor((new Date().getTime() - new Date(item.apply_time).getTime()) / 1000 / 60 / 60),
                    option: item.identity
                });
            });
            this.setState({dataSource: dataSource});
        }).catch();
    }

    approveOrgInfo = (key) => {
        return () => {
            axios(
                {
                    method: 'post',
                    url: 'http://localhost:3000/api/approveInfo',
                    data: key,
                    headers: {authorization: store.getState().token}
                }
            ).then(()=>{

            }).catch();
        }
    }

    render() {

        return (
            <>
                <Table dataSource={this.state.dataSource} locale={{emptyText: '暂无需要审批的企业'}}
                       pagination={{hideOnSinglePage: true}}>
                    <Column title='企业名称' dataIndex='name' key='name' align='center' width='20%'/>
                    <Column title='申请时间' dataIndex='time' key='time' align='center' width='20%'/>
                    <Column title='当前状态' dataIndex='state' key='state' align='center' width='20%'/>
                    <Column title='任务耗时' dataIndex='consum' key='consum' align='center' width='20%' render={(text) => {
                        let percent = Number.parseFloat(text) / 48;
                        let strokeColor = {
                            from: '#108ee9',
                            to: '#87d068'
                        };
                        if (percent > 1) {
                            percent = 100;
                        } else {
                            percent = Math.floor(percent * 100);
                        }
                        if (percent > 50) {
                            strokeColor = {
                                from: '#FFB6C1',
                                to: '#CD2626'
                            };
                        }
                        // console.log(percent);
                        return (<Progress status='active' showInfo={false} strokeColor={strokeColor} percent={percent}
                                          title={`当前耗时：${text}小时`}/>);
                    }}/>
                    <Column title='操作' dataIndex='option' key='option' align='center' width='20%' render={(text) => (
                        <Space size={20}>
                            <Button icon={<FileSearchOutlined style={{fontSize: '20px'}}/>} type='link' title='查看详情'
                                    onClick={this.approveOrgInfo(text)}/>
                            <Button icon={<SisternodeOutlined style={{fontSize: '20PX'}}/>} type='link' title='任务指派'/>
                        </Space>
                    )}/>
                </Table>
                <div>
                    <Document file={pdf}>
                        <Page pageNumber={1} />
                    </Document>
                </div>
            </>
        );
    }
}

export default Approve;
