import React, {Component} from 'react';
import {Button, Space, Spin, Table, Tree, Input, Modal, Form, TreeSelect, message} from "antd";
import axios from "axios";
import {
    ApartmentOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    PullRequestOutlined,
    VerticalAlignTopOutlined
} from "@ant-design/icons";
import Store from "../../../../redux/store";
import addGroupStyle from './index.module.css';

const {store} = Store;
const {Column} = Table;
const {Search} = Input;

class AddGroups extends Component {

    /**
     * 构造器，创建时向服务器请求组织信息
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {loading: true, enableGroup: [], confirmLoading: false};
        this.updateGroupInfo();
    }

    updateGroupInfo = () => {
        axios({
            url: 'http://localhost:3000/api/orgGroup',
            method: 'post',
            headers: {authorization: store.getState().token}
        }).then(response => {
            const {groups} = response.data;
            //双循环求和，计算各组织节点下属的总成员数量
            for (let i = 0; i < groups.length; i++) {
                if (!groups[i].totalMembers)
                    groups[i].totalMembers = Number.parseInt(groups[i].groupMembers);
                if (groups[i].parent) {
                    for (let j = i + 1; j < groups.length; j++) {
                        if (groups[j].groupCode === groups[i].parent) {
                            if (!groups[j].totalMembers)
                                groups[j].totalMembers = Number.parseInt(groups[j].groupMembers);
                            groups[j].totalMembers = groups[j].totalMembers + groups[i].totalMembers;
                            break;
                        }
                    }
                }
            }
            //对象的复制是针对引用地址的复制，需要遍历属性进行深度复制！
            const newGroup = groups.map(item => {
                const tmp = {};
                const props = Object.getOwnPropertyNames(item);
                props.forEach((prop) => {
                    tmp[prop] = item[prop];
                });
                return tmp;
            });


            let treeData = '';

            //加工组织数据
            for (let i = 0; i < newGroup.length; i++) {
                if (newGroup[i].parent) {
                    for (let j = i + 1; j < newGroup.length; j++) {
                        if (newGroup[j].groupCode === newGroup[i].parent) {
                            if (!newGroup[j].children) {
                                newGroup[j].children = [];
                            }
                            const tmp = {
                                title: newGroup[i].groupName,
                                key: newGroup[i].groupCode,
                                rankIndex: newGroup[i].rankIndex
                            };
                            if (newGroup[i].children) {
                                tmp.children = newGroup[i].children
                            }
                            newGroup[j].children.push(tmp);
                        }
                    }
                } else {
                    treeData = [{
                        title: newGroup[i].groupName,
                        key: newGroup[i].groupCode,
                        children: newGroup[i].children ? newGroup[i].children : []
                    }];
                }
            }
            this.setState({loading: false, groups: groups, treeData, selected: '', option: '', confirmLoading: false});
        }).catch(e => {
            this.setState({loading: false, option: '', confirmLoading: false});
            message.error(e.message).then();
        });
    }

    /**
     * 隐藏对话框
     */
    hiddenModal = () => {
        if (this.state.option === 'order') {
            const {originalChildren} = this.state;
            this.setState({option: '', children: originalChildren});
        } else {
            this.setState({option: ''});
        }
    }

    /**
     * 展示被选中的组织信息
     * @param selectedKeys 被选中的key数组
     * @param e 事件合成对象
     */
    showGroupInfo = (selectedKeys, e) => {
        if (selectedKeys.length === 0)
            return;
        const {groups} = this.state;
        let selected = {};
        const children = [];
        for (let i = 0; i < groups.length; i++) {
            if (groups[i].groupCode === selectedKeys[0]) {
                selected.groupName = groups[i].groupName;
                selected.members = groups[i].groupMembers;
                selected.totalMembers = groups[i].totalMembers;
                selected.key = groups[i].groupCode;
                selected.parentName = '--';
                selected.parentKey = groups[i].parent;
                for (let j = 0; j < groups.length; j++) {
                    if (groups[j].groupCode === selected.parentKey) {
                        selected.parentName = groups[j].groupName;
                        break;
                    }
                }
                if (e.node.children && e.node.children.length > 0) {
                    e.node.children.forEach(item => {
                        children.push({
                            title: item.title,
                            key: item.key,
                            rankIndex: item.rankIndex
                        });
                    });
                }
                break;
            }
        }
        this.setState({selected, originalChildren: children, children});
    }

    /**
     * 展示编辑组织的对话框
     */
    showEditGroup = () => {
        const {selected, groups} = this.state;
        if (groups.length === 1) {
            const group = {title: groups[0].groupName, value: groups[0].groupCode};
            this.setState({option: 'edit', enableGroup: [group]}, () => {
                this.editForm.setFieldsValue({groupName: group.title, parent: group.value});
            });
            return;
        }

        //执行深度复制
        const newGroup = groups.map(item => {
            const tmp = {};
            const props = Object.getOwnPropertyNames(item);
            props.forEach((prop) => {
                tmp[prop] = item[prop];
            });
            return tmp;
        });

        //过滤返回新数组
        const tmp = newGroup.filter(item => {
            if (!item.parent)
                return true;
            return !item.groupCode.includes(selected.key);
        });
        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].parent) {
                for (let j = i + 1; j < tmp.length; j++) {
                    if (tmp[j].groupCode === tmp[i].parent) {
                        if (!tmp[j].children) {
                            tmp[j].children = [];
                        }
                        if (tmp[i].children) {
                            tmp[j].children.push({
                                title: tmp[i].groupName,
                                value: tmp[i].groupCode,
                                children: tmp[i].children
                            });
                        } else {
                            tmp[j].children.push({
                                title: tmp[i].groupName,
                                value: tmp[i].groupCode
                            });
                        }
                    }
                }
            } else {
                const tmpGroup = {};
                tmpGroup.title = tmp[i].groupName;
                tmpGroup.value = tmp[i].groupCode
                if (tmp[i].children) {
                    tmpGroup.children = tmp[i].children;
                }
                this.setState({
                    option: 'edit',
                    enableGroup: [tmpGroup]
                }, () => {
                    this.editForm.setFieldsValue({
                        groupName: this.state.selected.groupName,
                        parent: this.state.selected.parentKey ? this.state.selected.parentKey : this.state.selected.key
                    });
                });
            }
        }
    }

    /**
     * 提交编辑后的组织信息
     */
    confirmEditGroup = () => {
        const {selected, groups} = this.state;
        const value = this.editForm.getFieldsValue(true);
        if (value.groupName === selected.groupName && value.parent === selected.parentKey) {
            this.setState({option: ''});
            return;
        }
        const group = {
            groupCode: '',
            groupName: value.groupName,
            groupMembers: selected.members,
            groupLevel: 1,
            parent: value.parent,
            rankIndex: 1,
            originalCode: selected.key
        };
        if (selected.key === '001') {
            group.groupCode = selected.key;
            group.parent = '';
        } else {
            if (value.parent === selected.parentKey) {
                group.groupCode = selected.key;
            } else {
                let index = 1;
                groups.forEach(item => {
                    if (item.groupCode.startsWith(value.parent) && (item.groupCode.length === value.parent.length + 3)) {
                        index += 1;
                    }
                });
                let str = index.toString();
                switch (str.length) {
                    case 1:
                        str = '00' + str;
                        break;
                    case 2:
                        str = '0' + str;
                        break;
                    default:
                        break;
                }
                group.groupCode = `${value.parent}${str}`;
            }
            group.groupLevel = group.groupCode.length / 3;
            group.rankIndex = Number.parseInt(group.groupCode.slice(-3));
        }
        this.setState({confirmLoading: true});
        // console.log(group);
        axios({
            url: 'http://localhost:3000/api/orgGroup',
            method: 'put',
            headers: {authorization: store.getState().token},
            data: group
        }).then(() => {
                this.updateGroupInfo();
                message.success('组织信息修改成功！').then();
            }
        ).catch();
    }

    showAddModal = () => {
        const {selected} = this.state;
        const group = {title: selected.groupName, value: selected.key};
        this.setState({option: 'add', enableGroup: [group]}, () => {
            this.addForm.setFieldsValue({groupName: '', parent: group.value});
        });
    }

    confirmAddGroup = () => {
        const {groups, selected} = this.state;
        const group = this.addForm.getFieldsValue(true);
        const codes = [];
        groups.forEach(item => {
            if (item.parent === selected.key) {
                codes.push(item.groupCode);
            }
        })
        let code = (codes.length + 1).toString();
        switch (code.length) {
            case 1:
                code = '00' + code;
                break;
            case 2:
                code = '0' + code;
                break;
            default:
                break;
        }
        group.groupCode = selected.key.concat(code);
        group.groupLevel = group.groupCode.length / 3;
        group.groupMembers = 0;
        group.rankIndex = Number.parseInt(group.groupCode.slice(-3));
        this.setState({confirmLoading: true});
        axios({
            method: 'put',
            url: 'http://localhost:3000/api/addGroup',
            data: group,
            headers: {authorization: store.getState().token}
        }).then(response => {
                message.success(`${response.data.msg}正在从服务器更新组织信息，请稍候！`).then();
                this.updateGroupInfo();
            }
        ).catch(e => {
            this.setState({loading: false, option: '', confirmLoading: false});
            message.error(e.message).then();
        });
    }

    deletGroup = () => {
        const {selected, groups} = this.state;
        if (selected.key === '001') {
            message.error('不允许删除根节点！').then();
            return
        }
        const child = [];
        groups.forEach(item => {
            if (item.groupCode.startsWith(selected.key) && item.groupCode.length > selected.key.length) {
                child.push([1]);
            }
        });
        if (child.length > 0 || Number.parseInt(selected.members) > 0) {
            message.error('该组织有子节点或成员，需先删除子节点或成员！').then();
        } else {
            axios({
                method: 'delete',
                url: 'http://localhost:3000/api/deleteGroup',
                data: {groupCode: selected.key},
                headers: {authorization: store.getState().token}
            }).then((response) => {
                message.success(`${response.data.msg}正在从服务器更新组织信息，请稍候！`).then();
                this.updateGroupInfo();
            }).catch(err => {
                message.error(err.message).then();
            });
        }
    }

    searchGroup = (value) => {
        const {groups} = this.state;
        for (let i = 0; i < groups.length; i++) {
            if (groups[i].groupName.includes(value)) {
                const selected = {
                    groupName: groups[i].groupName,
                    members: groups[i].groupMembers,
                    key: groups[i].groupCode,
                    parentName: '--',
                    parentKey: groups[i].parent,
                };
                for (let j = 0; j < groups.length; j++) {
                    if (groups[j].groupCode === selected.parentKey) {
                        selected.parentName = groups[j].groupName;
                        break;
                    }
                }
                this.setState({selected});
                break;
            }
        }

    }

    orderNode = () => {
        if (this.state.children.length > 1) {
            this.setState({option: 'order'})
        } else {
            message.info('当前组织的下级组织数量未达到排序条件！').then();
        }
    }

    changeIndex = (_, record, index) => {
        const thePiont = this;
        return function () {
            const {children} = thePiont.state;
            if (index >= 1) {
                //创建一个新的数组，不修改原有数组
                const newChildren = children.map(item => {
                    const tmp = {};
                    const props = Object.getOwnPropertyNames(item);
                    props.forEach((prop) => {
                        tmp[prop] = item[prop];
                    });
                    return tmp;
                });
                const tmp = newChildren[index - 1];
                newChildren[index - 1] = newChildren[index];
                newChildren[index - 1].rankIndex -= 1;
                newChildren[index] = tmp;
                newChildren[index].rankIndex += 1;
                thePiont.setState({children: newChildren});
            }
        }
    }

    confirmChangeIndex = () => {
        const {children, originalChildren} = this.state;
        let hasChange = false;
        const needChange = [];
        for (let i = 0; i < children.length; i++) {
            if (children[i].key !== originalChildren[i].key) {
                hasChange = true;
                needChange.push({groupCode: children[i].key, rankIndex: children[i].rankIndex});
            }
        }
        if (hasChange) {
            //如果最终顺序发生改变，提交请求到服务器，更新组织节点顺序
            this.setState({confirmLoading: true});
            axios({
                url: 'http://localhost:3000/api/orderOrgGroup',
                method: 'put',
                data: needChange,
                headers: {authorization: store.getState().token}
            }).then(response => {
                message.success(`${response.data.msg}正在从服务器更新组织，请稍候！`).then();
                this.updateGroupInfo();
            }).catch(e => {
                message.error(e.message).then();
            });
        } else {
            //如果最终顺序没有改变,则还原子节点
            this.setState({option: '', children: originalChildren})
        }

    }

    render() {
        return (
            <div className={addGroupStyle.container}>
                <div className={addGroupStyle.left}>
                    <Search placeholder='搜索组织' onSearch={this.searchGroup}/>
                    <div style={{marginTop: '10px'}}>
                        {
                            this.state.loading ?
                                <Spin tip='正在获取组织信息，请稍候......'/> :
                                <Tree treeData={this.state.treeData} icon={<ApartmentOutlined/>} showIcon={true}
                                      showLine={{showLeafIcon: false}} onSelect={this.showGroupInfo}
                                      selectedKeys={this.state.selected ? [this.state.selected.key] : []}
                                      expandedKeys={this.state.selected ? [this.state.selected.key] : []}
                                      autoExpandParent={true}/>
                        }
                    </div>
                </div>
                <div className={addGroupStyle.info}>
                    <Table locale={{emptyText: '请选中具体组织后进行操作！'}} pagination={{hideOnSinglePage: true}}
                           dataSource={this.state.selected ? [this.state.selected] : []}>
                        <Column title='组织名称' dataIndex='groupName' key='groupName' align='center' width='20%'/>
                        <Column title='上级组织' dataIndex='parentName' key='parentName' align='center' width='20%'/>
                        <Column title='当前组织成员' dataIndex='members' key='members' align='center' width='20%'/>
                        <Column title='关联组织成员' dataIndex='totalMembers' key='totalMembers' align='center' width='20%'/>
                        <Column title='操作' dataIndex='option' align='center' width='20%'
                                render={() => (
                                    <Space size={12}>
                                        <Button type='link' icon={<EditOutlined/>} title='编辑组织'
                                                onClick={this.showEditGroup}/>
                                        <Button type='link' icon={<PlusOutlined/>} title='增加下级组织'
                                                onClick={this.showAddModal}/>
                                        <Button type='link' icon={<PullRequestOutlined/>} title='子节点排序'
                                                onClick={this.orderNode}/>
                                        <Button type='link' icon={<DeleteOutlined/>} title='删除组织'
                                                onClick={this.deletGroup}/>
                                    </Space>
                                )}/>
                    </Table>
                </div>
                {/*Modal初始状态为不可见，未渲染，状态可见后才执行渲染，创建Form*/}
                <Modal title='编辑组织' maskClosable={false} visible={this.state.option === 'edit'} okText='确认'
                       cancelText='取消' onCancel={this.hiddenModal} onOk={this.confirmEditGroup}
                       confirmLoading={this.state.confirmLoading}>
                    <Form labelCol={{span: 4}} wrapperCol={{span: 19}} ref={element => {
                        this.editForm = element;
                    }}>
                        <Form.Item label='组织名称' name='groupName' required>
                            <Input/>
                        </Form.Item>
                        <Form.Item label='上级组织' name='parent'>
                            <TreeSelect treeData={this.state.enableGroup} virtual={false}/>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal title='增加下级部门' maskClosable={false} visible={this.state.option === 'add'} okText='确认'
                       cancelText='取消' onCancel={this.hiddenModal} onOk={this.confirmAddGroup}
                       confirmLoading={this.state.confirmLoading}>
                    <Form labelCol={{span: 4}} wrapperCol={{span: 19}} ref={element => {
                        this.addForm = element;
                    }}>
                        <Form.Item label='组织名称' name='groupName' required>
                            <Input/>
                        </Form.Item>
                        <Form.Item label='上级组织' name='parent'>
                            <TreeSelect treeData={this.state.enableGroup} virtual={false} disabled={true}/>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal title='下级部门排序' maskClosable={false} visible={this.state.option === 'order'} okText='确认'
                       cancelText='取消' onCancel={this.hiddenModal} onOk={this.confirmChangeIndex}
                       confirmLoading={this.state.confirmLoading}>
                    <Table pagination={{hideOnSinglePage: true}}
                           dataSource={this.state.children && this.state.children.length > 0 ? this.state.children : []}>
                        <Column title='组织名称' dataIndex='title' key='title' align='center' width='30%'/>
                        <Column title='组织排序' dataIndex='rankIndex' key='rankIndex' align='center' width='30%'/>
                        <Column title='调整顺序' dataIndex='option' align='center' width='40%'
                                render={(_, record, index) => (
                                    <Button type='link' icon={<VerticalAlignTopOutlined/>} title='上移1位'
                                            onClick={this.changeIndex(_, record, index)}/>
                                )}
                        />
                    </Table>
                </Modal>
            </div>
        );
    }
}

export default AddGroups;
