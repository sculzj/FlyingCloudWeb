import React, {Component} from 'react';
import {Modal, Spin, Table} from "antd";
import axios from "axios";
import {serverIP} from "../../../../resource/constant";
import Store from "../../../../redux/store";

const {Column} = Table;
const {store} = Store;

class OrgsList extends Component {

    constructor(props) {
        super(props);
        this.state = {dataSource: [], dataLoading: true}
        this.getOrgsList();
    }

    getOrgsList = () => {
        axios(
            {
                url: `${serverIP}/api/orgsInfo`,
                method: 'post',
                headers: {authorization: store.getState().token}
            }
        ).then(response => {
            const {orgsInfo} = response.data;
            const root = orgsInfo.find(item => !item.parentCode);
            root.key = root.code;
            const dataSource = [];
            dataSource.push(root);
            this.sortOrgsByGroup(orgsInfo, root, dataSource);
            this.setState({dataSource: dataSource, dataLoading: false});
        }).catch(err => {
            Modal.error({
                title: '请求失败',
                content: '获取组织信息失败，请重新尝试或联系系统管理员！',
                afterClose: () => {
                    this.setState({dataLoading: false});
                }
            });
            console.log('错误信息：', err);
        });
    }

    /**
     * 将组织按照部门顺序排序
     * @param arr 组织基础数据
     * @param node 参照节点
     * @param data 接收排序结果的数组
     */
    sortOrgsByGroup = (arr, node, data) => {
        const children = arr.filter(item => item.parentCode === node.code);
        if (children.length === 0)
            return;
        children.sort((a, b) => a.sequence - b.sequence);
        children.forEach(item => {
            item.key = item.code;
            data.push(item);
            this.sortOrgsByGroup(arr, item, data);
        });
    }

    render() {
        return (
            <>
                {
                    this.state.dataLoading ? <Spin style={{width: '100%'}} tip='正在请求数据，请稍候......'/> :
                        <Table dataSource={this.state.dataSource} locale={{emptyText: '暂无组织，请先创建组织！'}}
                               pagination={{hideOnSinglePage: true}}>
                            <Column title='组织名称' dataIndex='name' align='center' width='20%'/>
                            <Column title='上级组织' dataIndex='parentName' align='center' width='20%'
                                    render={(text) => (text ? text : '--')}/>
                            <Column title='成员数量' dataIndex='members' align='center' width='15%'/>
                            <Column title='所在园区' dataIndex='garden' align='center' width='15%'
                                    render={(text) => (text ? text : '--')}/>
                            <Column title='所在楼栋' dataIndex='building' align='center' width='15%'
                                    render={(text) => (text ? text : '--')}/>
                            <Column title='办公楼层' dataIndex='room' align='center' width='15%'
                                    render={(text) => (text ? text : '--')}/>
                        </Table>
                }
            </>
        );
    }
}

export default OrgsList;