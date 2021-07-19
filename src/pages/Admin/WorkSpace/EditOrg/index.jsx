import React, {Component} from 'react';
import {Button, Space, Spin, Table, Tree, Input, Modal, Form, TreeSelect, message, AutoComplete} from "antd";
import axios from "axios";
import {
    ApartmentOutlined,
    DeleteOutlined,
    EditOutlined, MinusOutlined,
    PlusOutlined,
    PullRequestOutlined,
    VerticalAlignTopOutlined
} from "@ant-design/icons";
import Store from "../../../../redux/store";
import addGroupStyle from './index.module.css';
import {serverIP} from "../../../../resource/constant";

const {store} = Store;
const {Column} = Table;
const {Search} = Input;

class EditOrg extends Component {

    /**
     * 构造器，创建时向服务器请求组织信息
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            orgsInfo: [],
            treeData: [],
            dataLoading: true,
            selectedNode: '',
            selectedKeys: [],
            enableOrgs: [],
            option: '',
            confirmLoading: false,
            children: [],
            searchList: []
        };
        this.updateOrgInfo();
    }

    /**
     * 更新组织信息
     */
    updateOrgInfo = () => {
        axios({
            url: `${serverIP}/api/orgsInfo`,
            method: 'post',
            headers: {authorization: store.getState().token}
        }).then(response => {
            const {orgsInfo} = response.data;
            this.setState({
                orgsInfo: orgsInfo,
                option: '',
                treeData: this.transDataToTree(orgsInfo),
                dataLoading: false,
                confirmLoading: false,
                selectedNode: '',
                selectedKeys: [],
                searchList: []
            });
        }).catch(e => {
            this.setState({
                dataLoading: false,
                option: '',
                confirmLoading: false,
                searchList: [],
                selectedKeys: [],
                selectedNode: ''
            });
            message.error(e.message).then();
        });
    }

    /**
     * 将请求获取的组织信息转换为树数据
     * @param orgsInfo 组织信息，array
     */
    transDataToTree = (orgsInfo) => {
        const treeData = [];
        const copy = orgsInfo.map(item => {
            const itemCopy = {};
            itemCopy.key = item.code;
            itemCopy.title = item.name;
            itemCopy.members = item.members;
            itemCopy.parentCode = item.parentCode;
            itemCopy.parentName = item.parentName ? item.parentName : '--';
            itemCopy.garden = item.garden ? item.garden : '--';
            itemCopy.building = item.building ? item.building : '--';
            itemCopy.room = item.room ? item.room : '--';
            return itemCopy;
        });
        for (let i = 0; i < copy.length; i++) {
            // noinspection DuplicatedCode
            if (copy[i].parentCode) {
                for (let j = i + 1; j < copy.length; j++) {
                    if (copy[j].key === copy[i].parentCode) {
                        if (!copy[j].children) {
                            copy[j].children = [];
                        }
                        copy[j].children.push(copy[i]);
                        break;
                    }
                }
            }
            if (!copy[i].children) {
                copy[i].isLeaf = true;
            }
            if (i === copy.length - 1) {
                treeData.push(copy[i]);
            }
        }
        return treeData;
    }

    /**
     * 生成树选择输入节点
     * @param orgsInfo 基础组织信息
     * @param code 过滤的组织编码
     * @returns {*[]} 树选择数据
     */
    transDateToTreeSelect = (orgsInfo, code) => {
        const enableOrgs = [];
        const copy = orgsInfo.map(item => {
            const tmp = {};
            tmp.title = item.name;
            tmp.value = item.code;
            tmp.parentCode = item.parentCode;
            return tmp;
        });
        for (let i = 0; i < copy.length; i++) {
            if (copy[i].value === code || copy[i].parentCode === code) {
                continue;
            }
            // noinspection DuplicatedCode
            if (copy[i].parentCode) {
                for (let j = i + 1; j < copy.length; j++) {
                    if (copy[j].value === copy[i].parentCode) {
                        if (!copy[j].children) {
                            copy[j].children = [];
                        }
                        copy[j].children.push(copy[i]);
                        break;
                    }
                }
            }
            if (i === copy.length - 1) {
                enableOrgs.push(copy[i]);
            }
        }
        return enableOrgs;
    }

    /**
     * 隐藏对话框
     */
    hiddenModal = () => {
        this.setState({option: ''});
    }

    /**
     * 展示被选中的组织信息
     * @param selectedKeys
     * @param event
     */
    showOrgInfo = (selectedKeys, event) => {
        const {node} = event;
        if (node.children) {
            delete node.children;
        }
        this.setState({selectedNode: node, selectedKeys: selectedKeys,searchList:[]});
        // console.log(node);
    }

    /**
     * 展示编辑组织的对话框
     */
    showEditOrg = () => {
        const {selectedNode, orgsInfo} = this.state;
        // console.log(selectedNode);
        if (orgsInfo.length === 1) {
            this.setState({option: 'edit', enableOrgs: []});
            return;
        }
        this.setState({option: 'edit', enableOrgs: this.transDateToTreeSelect(orgsInfo, selectedNode.key)});
    }

    /**
     * 提交编辑后的组织信息
     */
    confirmEditGroup = () => {
        const {selectedNode, orgsInfo} = this.state;
        const value = this.editForm.getFieldsValue(true);
        if (value.name === selectedNode.title && value.parentCode === selectedNode.parentCode && value.garden === selectedNode.garden &&
            value.building === selectedNode.building && value.room === selectedNode.room) {
            this.setState({option: ''});
            return;
        }

        if (!value.name || !value.garden || !value.building || !value.room) {
            message.error('组织信息缺失，请补充填写！').then();
            return;
        }

        this.setState({confirmLoading: true});
        //在本地完成需要更新的数据梳理后提交到服务器
        const data = [];
        if (value.parentCode === selectedNode.parentCode || selectedNode.key === '001') {//仅更新名称的情况下
            data.push({
                code: selectedNode.key,
                name: value.name,
                garden: value.garden,
                building: value.building,
                room: value.room
            });
        } else {//更新组织关系的情况下
            //定位当前编辑节点，其父节点，要移动到的目标节点
            const editNode = orgsInfo.find(item => item.code === selectedNode.key);
            const targetNode = orgsInfo.find(item => item.code === value.parentCode);

            //向上追溯，扣除父节点及其祖宗节点的成员数量
            this.deductMembersToParent(orgsInfo, editNode, editNode.members, data);

            //修改兄弟及其子节点编码
            const brotherNodes = orgsInfo.filter(item => item.parentCode === editNode.parentCode && item.code !== editNode.code);
            brotherNodes.forEach(item => {
                let index = Number.parseInt(item.code.substring(item.code.length - 3), 10);
                if (index > Number.parseInt(editNode.code.substring(editNode.code.length - 3), 10)) {
                    index -= 1;
                    if (index < 10) {
                        item.newCode = `${item.parentCode}00${index}`;
                    } else if (index < 100) {
                        item.newCode = `${item.parentCode}0${index}`;
                    } else {
                        item.newCode = `${item.parentCode}0${index}`;
                    }
                    item.tier = item.newCode.length / 3;
                    item.sequence -= 1;
                    data.push(item);
                    const children = orgsInfo.filter(element => element.parentCode === item.code);
                    if (children.length > 0) {
                        this.roundUpdateHeirNode(orgsInfo, children, item, data);
                    }
                }
            });
            //修改A节点编码
            const index = orgsInfo.filter(item => item.parentCode === targetNode.code).length + 1;
            if (index < 10) {
                editNode.newCode = `${targetNode.newCode ? targetNode.newCode : targetNode.code}00${index}`;
            } else if (index < 100) {
                editNode.newCode = `${targetNode.newCode ? targetNode.newCode : targetNode.code}0${index}`;
            } else {
                editNode.newCode = `${targetNode.newCode ? targetNode.newCode : targetNode.code}${index}`;
            }
            data.push({
                name: value.name,
                code: editNode.code,
                newCode: editNode.newCode,
                members: editNode.members,
                parentName: targetNode.name,
                parentCode: targetNode.newCode ? targetNode.newCode : targetNode.code,
                tier: editNode.newCode.length / 3,
                sequence: index,
                garden: value.garden,
                building: value.building,
                room: value.room
            });

            //遍历修改子节点编码
            const children = orgsInfo.filter(item => item.parentCode === editNode.code);
            if (children.length > 0) {
                this.roundUpdateHeirNode(orgsInfo, children, editNode, data)
            }
        }
        axios({
            url: `${serverIP}/api/updateOrgsInfo`,
            method: 'post',
            data: {data: data.reverse()},
            headers: {authorization: store.getState().token}
        }).then(() => {
            message.success('组织信息更新成功，正在从服务器获取最新组织信息，请稍候...').then();
            this.updateOrgInfo();
        }).catch((err) => {
            console.log('错误信息：', err);
            message.error('组织信息更新失败！').then();
            this.updateOrgInfo();
        });
    }

    /**
     * 遍历更新编辑节点的子孙节点信息
     * @param sourceArr 基础节点信息
     * @param arr 需要更新的节点信息
     * @param parentNode 本次操作基于的父节点
     * @param data 接收更新数据
     */
    roundUpdateHeirNode = (sourceArr, arr, parentNode, data) => {
        for (let i = 0; i < arr.length; i++) {
            arr[i].newCode = `${parentNode.newCode}${arr[i].code.substring(arr[i].code.length - 3)}`;
            data.push({
                name: arr[i].name,
                code: arr[i].code,
                newCode: arr[i].newCode,
                members: arr[i].members,
                parentCode: parentNode.newCode,
                parentName: parentNode.name,
                tier: arr[i].newCode.length / 3,
                sequence: arr[i].sequence,
                garden: arr[i].garden,
                building: arr[i].building,
                room: arr[i].room
            });
            const children = sourceArr.filter(item => item.parentCode === arr[i].code);
            if (children.length > 0) {
                this.roundUpdateHeirNode(sourceArr, children, arr[i], data);
            }
        }
    }

    /**
     * 遍历父节点及其祖宗节点，扣除成员数量
     * @param sourceArr 源数据
     * @param node 触发扣除的节点
     * @param num 要扣除的数量
     * @param data 接收要更新的数据
     */
    deductMembersToParent = (sourceArr, node, num, data) => {
        if (!node.parentCode) {
            return;
        }
        const parent = sourceArr.find(item => item.code === node.parentCode);
        if (parent) {
            parent.members -= node.members;
            parent.newCode = parent.code;
            data.push(parent);
            this.deductMembersToParent(sourceArr, parent, num, data);
        }
    }

    showAddModal = () => {
        const {selectedNode} = this.state;
        if (selectedNode.key.length >= 30) {
            message.warn('组织层级不能超过10！').then();
            return;
        }
        this.setState({option: 'add'});
    }

    confirmAddGroup = () => {
        const value = this.addForm.getFieldsValue(true);
        if (!value.name && !value.garden && !value.building && !value.room) {
            this.hiddenModal();
            return;
        }

        if (!value.name || !value.garden || !value.building || !value.room) {
            message.error('组织信息缺失，请补充填写！').then();
            return;
        }

        const {selectedNode, orgsInfo} = this.state;
        const data = {name: value.name, garden: value.garden, building: value.building, room: value.room};
        data.parentCode = selectedNode.key;
        data.parentName = selectedNode.title;
        data.members = 0;
        if (selectedNode.isLeaf) {
            data.code = `${selectedNode.key}001`;
            data.sequence = 1;
        } else {
            const childrens = orgsInfo.filter(item => item.parentCode === selectedNode.key);
            const index = childrens.length + 1;
            data.sequence = index;
            if (index < 10) {
                data.code = `${selectedNode.key}00${index}`;
            } else if (index < 100) {
                data.code = `${selectedNode.key}0${index}`;
            } else {
                data.code = `${selectedNode.key}${index}`;
            }
        }
        data.tier = data.code.length / 3;
        axios({
            method: 'put',
            url: `${serverIP}/api/addOrg`,
            headers: {authorization: store.getState().token},
            data: data
        }).then(response => {
                message.success(`${response.data.msg}正在从服务器更新组织信息，请稍候！`).then();
                this.updateOrgInfo();
            }
        ).catch(e => {
            this.setState({dataLoading: false, option: '', confirmLoading: false});
            message.error(e.message).then();
        });
    }

    deletOrg = () => {
        const {selectedNode, orgsInfo} = this.state;
        if (selectedNode.key === '001') {
            message.error('不允许删除根节点！').then();
            return;
        }
        const children = orgsInfo.filter(item => item.parentCode === selectedNode.key);
        if (children.length > 0 || selectedNode.members > 0) {
            message.error('该组织有子节点或成员，请先删除子节点及成员！').then();
        } else {
            axios({
                method: 'delete',
                url: `${serverIP}/api/deleteOrg`,
                data: {code: selectedNode.key},
                headers: {authorization: store.getState().token}
            }).then(() => {
                message.success(`组织删除成功！正在从服务器更新组织信息，请稍候...`).then();
                this.updateOrgInfo();
            }).catch(err => {
                message.error(err.message).then();
            });
        }
    }

    searchOrg = (value) => {
        const {orgsInfo} = this.state;
        const list = [];
        orgsInfo.forEach(item => {
            if (item.name.includes(value) && value) {
                list.push({value: item.name, code: item.code});
            }
        });
        // console.log(value);
        this.setState({searchList: list});
    }

    searchOrgByValue = (value) => {
        if (!value)
            return;
        const {orgsInfo, searchList} = this.state;
        const option = searchList.find(item => item.value === value);
        const node = orgsInfo.find(item => item.code === option.code);
        node.key = node.code;
        node.title = node.name;
        this.setState({selectedKeys: [node.code], selectedNode: node});
    }

    showSortModal = () => {
        const {selectedNode, orgsInfo} = this.state;
        const children = orgsInfo.filter(item => item.parentCode === selectedNode.key);
        if (children.length > 1) {
            children.forEach(item => {
                item.key = item.code;
                item.title = item.name;
            });
            children.sort((a, b) => a.sequence - b.selectedNode);
            this.setState({option: 'order', children});
            // console.log(children);
        } else {
            message.info('当前组织的下级组织数量未达到排序条件！').then();
        }
    }

    changeIndex = (index) => {
        const {children} = this.state;
        const thePoint = this;
        return function () {
            const tmp = {...children[index]};
            children[index] = {...children[index - 1]};
            children[index].oldSequence = children[index].sequence;
            children[index].sequence += 1;
            children[index - 1] = {...tmp};
            children[index - 1].oldSequence = children[index - 1].sequence;
            children[index - 1].sequence -= 1;
            const newChildren = children.map(item => ({...item}));
            thePoint.setState({children: newChildren});
        }
    }

    confirmChangeIndex = () => {
        const {children} = this.state;
        const data = [];
        children.forEach(item => {
            if (item.oldSequence && item.oldSequence !== item.sequence) {
                item.newCode = item.code;
                data.push(item);
            }
        });
        if (data.length === 0) {
            this.hiddenModal();
            return;
        }
        this.setState({confirmLoading: true});
        axios({
            url: `${serverIP}/api/updateOrgsInfo`,
            method: 'post',
            data: {data},
            headers: {authorization: store.getState().token}
        }).then(response => {
            message.success(`${response.data.msg}正在从服务器更新组织，请稍候！`).then();
            this.updateOrgInfo();
        }).catch(e => {
            message.error(e.message).then();
            this.updateOrgInfo();
        });
    }

    render() {
        return (
            <div className={addGroupStyle.container}>
                <div className={addGroupStyle.left}>
                    <AutoComplete style={{width: '100%'}} options={this.state.searchList} notFoundContent='未找到目标组织'
                                  onSelect={this.searchOrgByValue} onSearch={this.searchOrg}
                                  value={this.state.searchList.length ? this.state.selectedNode.name : ''}
                                  children={<Search placeholder='根据组织名称进行搜索'/>}/>
                    <div className={addGroupStyle.tree}>
                        {
                            this.state.dataLoading ?
                                <Spin style={{width: '100%'}} tip='正在获取组织信息，请稍候......'/> :
                                <Tree treeData={this.state.treeData} icon={<ApartmentOutlined/>} showIcon={true}
                                      showLine={{showLeafIcon: false}} onSelect={this.showOrgInfo}
                                      selectedKeys={this.state.selectedKeys} expandedKeys={this.state.selectedKeys}
                                      autoExpandParent={true}/>
                        }
                    </div>
                </div>
                <div className={addGroupStyle.info}>
                    <Table locale={{emptyText: '请选中具体组织后进行操作！'}} pagination={{hideOnSinglePage: true}}
                           dataSource={this.state.selectedNode ? [this.state.selectedNode] : []}>
                        <Column title='组织名称' dataIndex='title' align='center' width='15%'/>
                        <Column title='上级组织' dataIndex='parentName' align='center' width='15%'/>
                        <Column title='成员数量' dataIndex='members' align='center' width='10%'/>
                        <Column title='办公园区' dataIndex='garden' align='center' width='10%'/>
                        <Column title='办公楼栋' dataIndex='building' align='center' width='10%'/>
                        <Column title='办公楼层' dataIndex='room' align='center' width='10%'/>
                        <Column title='操作' dataIndex='option' align='center' width='10%'
                                render={() => (
                                    <Space size={12}>
                                        <Button type='link' icon={<EditOutlined/>} title='编辑组织'
                                                onClick={this.showEditOrg}/>
                                        <Button type='link' icon={<PlusOutlined/>} title='增加下级组织'
                                                onClick={this.showAddModal}/>
                                        <Button type='link' icon={<PullRequestOutlined/>} title='子节点排序'
                                                onClick={this.showSortModal}/>
                                        <Button type='link' icon={<DeleteOutlined/>} title='删除组织'
                                                onClick={this.deletOrg}/>
                                    </Space>
                                )}/>
                    </Table>
                </div>
                {/*Modal初始状态为不可见，未渲染，状态可见后才执行渲染，创建Form*/}
                <Modal title='编辑组织' maskClosable={false} visible={this.state.option === 'edit'} okText='确认'
                       cancelText='取消' onCancel={this.hiddenModal} onOk={this.confirmEditGroup}
                       confirmLoading={this.state.confirmLoading} destroyOnClose>
                    <Form labelCol={{span: 4}} wrapperCol={{span: 19}} ref={element => {
                        this.editForm = element;
                    }}>
                        <Form.Item label='组织名称' name='name' initialValue={this.state.selectedNode.title} required>
                            <Input/>
                        </Form.Item>
                        <Form.Item label='上级组织' name='parentCode'
                                   initialValue={this.state.selectedNode.parentCode ? this.state.selectedNode.parentName : this.state.selectedNode.title}>
                            <TreeSelect treeData={this.state.enableOrgs} disabled={!this.state.selectedNode.parentCode}
                                        virtual={false}/>
                        </Form.Item>
                        <Form.Item label='办公园区' name='garden' initialValue={this.state.selectedNode.garden} required>
                            <Input/>
                        </Form.Item>
                        <Form.Item label='办公楼栋' name='building' initialValue={this.state.selectedNode.building}
                                   required>
                            <Input/>
                        </Form.Item>
                        <Form.Item label='办公楼层' name='room' initialValue={this.state.selectedNode.room} required>
                            <Input/>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal title='增加组织' maskClosable={false} visible={this.state.option === 'add'} okText='确认'
                       cancelText='取消' onCancel={this.hiddenModal} onOk={this.confirmAddGroup}
                       confirmLoading={this.state.confirmLoading} destroyOnClose>
                    <Form labelCol={{span: 4}} wrapperCol={{span: 19}} ref={element => {
                        this.addForm = element;
                    }}>
                        <Form.Item label='组织名称' name='name' required>
                            <Input/>
                        </Form.Item>
                        <Form.Item label='上级组织' initialValue={this.state.selectedNode.title} name='parent'>
                            <Input disabled/>
                        </Form.Item>
                        <Form.Item label='办公园区' name='garden' required>
                            <Input/>
                        </Form.Item>
                        <Form.Item label='办公楼栋' name='building' required>
                            <Input/>
                        </Form.Item>
                        <Form.Item label='办公楼层' name='room' required>
                            <Input/>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal title='部门排序' maskClosable={false} visible={this.state.option === 'order'} okText='确认'
                       cancelText='取消' onCancel={this.hiddenModal} onOk={this.confirmChangeIndex}
                       confirmLoading={this.state.confirmLoading} bodyStyle={{padding: '0'}} destroyOnClose>
                    <Table pagination={{hideOnSinglePage: true}} dataSource={this.state.children}>
                        <Column title='组织名称' dataIndex='title' align='center' width='50%'/>
                        <Column title='当前顺序' dataIndex='sequence' align='center' width='25%'/>
                        <Column title='调整顺序' dataIndex='option' align='center' width='25%'
                                render={(_, record, index) => (
                                    <Button type='link'
                                            icon={index ? <VerticalAlignTopOutlined/> : <MinusOutlined/>}
                                            title={index ? '上移1位' : ''}
                                            disabled={!index}
                                            onClick={this.changeIndex(index)}/>
                                )}
                        />
                    </Table>
                </Modal>
            </div>
        );
    }
}

export default EditOrg;
