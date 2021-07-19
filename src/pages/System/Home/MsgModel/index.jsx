import React, {Component} from 'react';
import {Editor} from '@tinymce/tinymce-react';
import {Button, Empty, Form, Input, Menu, message, Modal, Rate, Select, Space, Spin, Tree} from "antd";
import {
    BarChartOutlined,
    BranchesOutlined,
    DeleteOutlined,
    DiffOutlined,
    EditOutlined, ShareAltOutlined, SisternodeOutlined, StarOutlined, TagsOutlined, TeamOutlined, UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import {nanoid} from "nanoid";

import Guidepost from "../Guidepost";
import mainStyle from './index.module.css';
import {serverIP} from '../../../../resource/constant';
import Store from "../../../../redux/store";
import {reNameNode, seacrhLeaf, searchTreeNode} from '../../../../ToolsFactory';
import DataView from "./DataView";

const {DirectoryTree} = Tree;
const {Option} = Select;
const {store} = Store;
const {SubMenu} = Menu;

class MsgModle extends Component {

    /**
     * 初始化state
     * @type {{leafs: number, dataLoading: boolean, editAbled: boolean, editorLoading: boolean, menu: boolean, point: {x: number, y: number}, selected: {}, treeData: *[], option: {visible: boolean, type: string}}}
     */
    state = {
        dataLoading: true,//源数据加载状态
        treeData: [],//树的数据源
        leafs: 0,//子节点（模板）数量
        menu: false,//弹出菜单可见状态
        point: {x: 0, y: 0},//弹出菜单的坐标位置
        editorLoading: true,//富文本编辑器加载状态
        editAbled: true,//富文本编辑器可编辑状态
        selected: {},//选中的树节点对象
        selectedKeys: [],//默认选中的树节点key
        option: {type: '', visible: false}//弹出操作框对应的菜单项及可见状态
    }

    componentDidMount() {
        /**
         * 加载完成后从服务器拉取消息模板的目录
         */
        this.downLoadDirList();
    }

    /**
     * 从服务器拉取消息模板目录
     */
    downLoadDirList = () => {
        axios(
            {
                url: `${serverIP}/api/sysMsgTemplate`,
                method: 'post',
                data: {uid: store.getState().userinfo.uid},
                headers: {authorization: store.getState().token}
            }
        ).then(response => {
                const data = JSON.parse(response.data.result.templates);
                // console.log(data);
                const leafs=seacrhLeaf(data);
                // console.log('子节点数量：',leafs);
                this.setState({dataLoading: false, treeData: data, leafs: leafs});
            }
        ).catch(err => {
                console.log(err);
                Modal.error({
                    title: '错误',
                    content: '数据获取失败！'
                });
            }
        );
    }

    /**
     * 更新服务器消息模板目录
     */
    updateDirList = (newState) => {
        this.setState({menu: false, dataLoading: true});
        axios(
            {
                url: `${serverIP}/api/updateSysMsgTemplateDir`,
                method: 'post',
                data: {uid: store.getState().userinfo.uid, templates: JSON.stringify(this.state.treeData)},
                headers: {authorization: store.getState().token}
            }
        ).then(() => {
            this.setState(newState);
        }).catch();
    }

    searchTemplate=(value)=>{
        const node=searchTreeNode(this.state.treeData,value);
        // console.log('搜索结果：',node);
        this.setState({selected:node,selectedKeys:[node.key]});
    }

    /**
     * 鼠标右键弹出菜单
     * @param event 右键点击事件
     * @param node 触发事件的树节点
     */
    showMenuItem = ({event, node}) => {
        event.stopPropagation();
        const x = event.clientX;
        const y = event.clientY;
        if (node.selected)
            this.setState({menu: true, point: {x: x, y: y}});
    }

    /**
     * 树节点选择事件
     * @param selectedKeys 已选中节点的keys集合
     * @param e 选择事件
     */
    selectNode = (selectedKeys, e) => {
        this.setState({selected: e.node,selectedKeys:[e.node.key]}, () => {
            console.log('选中的树节点：', this.state.selected);
        });
    }

    /**
     * tinymce自定义上传图片函数
     * @param blobInfo 文件信息
     * @param success 上传成功回调函数
     * @param failure 上传失败回调函数
     */
    uploadImg = (blobInfo, success, failure) => {
        // console.log('开始上传图片');
        const id = nanoid(8);
        const img = new FormData();
        const file = blobInfo.blob();
        const type = file.name.slice(file.name.lastIndexOf('.'));
        img.append('img', file, `${id}${type}`);
        axios(
            {
                url: `${serverIP}/api/upFile`,
                method: 'post',
                data: img
            }
        ).then(response => {
            if (response.data.url) {
                success(response.data.url);
            }
            this.setState({editAbled: false});
        }).catch(err => {
            failure('图片上传失败：' + err.message);
        });
    }

    /**
     * 弹出菜单项点击事件
     * @param menu 触发点击事件的菜单
     */
    clickMenuItem = (menu) => {
        const {key} = menu;
        // console.log('点击菜单：', key);
        if (key === 'deleteDir' && this.state.selected.children.length > 0) {
            Modal.error({title: '错误', content: '请先删除或转移该分组下的模板后再执行删除操作！'});
            this.setState({menu: false, option: {type: '', visible: false}});
            return;
        }
        if (key.includes('move_')) {
            const target = key.slice(key.indexOf('_') + 1);
            // console.log(target);
            let node = {};
            this.state.treeData[0].children.forEach(item1 => {
                    item1.children = item1.children.filter(item2 => {
                        if (item2.key === this.state.selected.key) {
                            node = item2;
                        }
                        return !item2.key === this.state.selected.key;
                    });
                }
            );
            this.state.treeData[0].children.forEach(item3 => {
                if (item3.key === target) {
                    item3.children.push(node);
                }
            });
            const newData = this.state.treeData.map(item4 => item4);
            this.updateDirList({dataLoading: false, treeData: newData, selected: node,selectedKeys:[node.key]});
            // this.setState({menu: false, treeData: newData, selected: node});
            return;
        }
        this.setState({menu: false, option: {type: key, visible: true}});
    }

    /**
     * 隐藏弹出菜单
     */
    hideMenu = () => {
        this.setState({menu: false});
    }

    /**
     * 隐藏操作对话框视图
     */
    hideOption = () => {
        this.setState({option: {type: '', visible: false}});
    }

    /**
     * 点击操作对话框确定按钮提交操作请求
     */
    submitOption = () => {
        const {type} = this.state.option;
        const {treeData, selected} = this.state;
        let newTreeData = [];
        let newSelected = {};
        if (type === 'reName') {
            const {option} = this.form.getFieldsValue();
            reNameNode(treeData, selected.key, option);
            newTreeData = treeData.map(item => {
                if (item.key === selected.key) {
                    newSelected = item;
                }
                return item;
            });
        } else if (type === 'newDir') {
            const {option} = this.form.getFieldsValue();
            let key = '';
            switch (selected.children.length.toString().length) {
                case 1:
                    key = `${selected.key}00${selected.children.length + 1}`;
                    break;
                case 2:
                    key = `${selected.key}0${selected.children.length + 1}`;
                    break;
                case 3:
                    key = `${selected.key}${selected.children.length + 1}`;
                    break;
                default:
                    break;
            }
            const node = {
                title: option,
                key: key,
                isLeaf: false,
                children: []
            };
            newTreeData = treeData.map(item => {
                item.children.push(node);
                return item;
            });
            newSelected = node;
        } else if (type === 'newTemplate') {
            const {option} = this.form.getFieldsValue();
            const node = {
                title: option,
                key: nanoid(8),
                isLeaf: true
            };
            treeData[0].children.forEach(item => {
                if (item.key === selected.key) {
                    item.children.push(node);
                }
            });
            newTreeData = treeData.map(item => item);
            newSelected = node;
        } else if (type === 'deleteDir') {
            treeData[0].children = treeData[0].children.filter(item => {
                if (item.key !== selected.key) {
                    if (item.key.slice(-3) > selected.key.slice(-3)) {
                        const index = (item.key.slice(-3) - 1).toString();
                        item.key = index.length === 3 ? index : index.length === 2 ? `0${index}` : `00${index}`;
                    }
                }
                return item.key !== selected.key;
            });
            newTreeData = treeData.map(item => item);
            newSelected = newTreeData[0];
        } else if (type === 'deleteTemplate') {
            treeData[0].children.forEach(item => {
                item.children.forEach(node => {
                    if (node.key === selected.key) {
                        item.children = item.children.filter(element => element.key !== node.key);
                        newSelected = item;
                    }
                });
            })
            newTreeData = treeData.map(item => item);
        }
        this.updateDirList({
            dataLoading: false,
            treeData: newTreeData,
            leafs:seacrhLeaf(newTreeData),
            selected: newSelected,
            selectedKeys: [newSelected.key],
            option: {type: '', visible: false}
        });
    }

    render() {
        return (
            <div className={mainStyle.frame}>
                <Guidepost guides={['系统管理', '消息推送', '消息模板']}/>
                <div className={mainStyle.nav}>
                    <Input.Search placeholder='按模板名称搜索' onSearch={this.searchTemplate}/>
                    <div className={mainStyle.tree}>
                        {
                            this.state.dataLoading ? <Spin tip='正在获取数据，请稍候......' style={{width: '100%'}}/> :
                                <DirectoryTree treeData={this.state.treeData} onSelect={this.selectNode}
                                               onRightClick={this.showMenuItem} autoExpandParent
                                               selectedKeys={this.state.selectedKeys}
                                               expandedKeys={this.state.selectedKeys}
                                />
                        }
                    </div>
                    <Button type='link' className={mainStyle.link}>从应用市场获取更多模板>></Button>
                </div>
                <div className={mainStyle.right}>
                    {
                        this.state.leafs === 0 ? <Empty description='暂无模板，您可以自定义创建模板。'/> :
                            !this.state.selected.key||!this.state.selected.isLeaf? <DataView/>:
                            <>
                                <div className={mainStyle.content}>
                                    <Form wrapperCol={{span: 24}}>
                                        <Form.Item className={mainStyle.formItem1}>
                                            <label
                                                className={mainStyle.label}><b><TagsOutlined/>&nbsp;&nbsp;模板标题</b></label>
                                            <Form.Item name='title' noStyle>
                                                <Input className={mainStyle.field}/>
                                            </Form.Item>
                                        </Form.Item>
                                        <Form.Item style={{marginBottom: '0'}}>
                                            <Form.Item className={mainStyle.formItem}>
                                                <label
                                                    className={mainStyle.label}><b><UserOutlined/>&nbsp;&nbsp;模板作者</b></label>
                                                <Form.Item name='auth' noStyle>
                                                    <Input className={mainStyle.field}/>
                                                </Form.Item>
                                            </Form.Item>
                                            <Form.Item className={mainStyle.formItem}>
                                                <label
                                                    className={mainStyle.label}><b><BranchesOutlined/>&nbsp;&nbsp;模板类型</b></label>
                                                <Form.Item name='type' noStyle>
                                                    <Select className={mainStyle.field}><Option
                                                        value='msg'>门户公告</Option></Select>
                                                </Form.Item>
                                            </Form.Item>
                                            <Form.Item className={mainStyle.formItem}>
                                                <label
                                                    className={mainStyle.label}><b><TeamOutlined/>&nbsp;&nbsp;模板权限</b></label>
                                                <Form.Item name='scope' noStyle>
                                                    <Select defaultValue='all' className={mainStyle.field}><Option
                                                        value='all'>普通共享</Option></Select>
                                                </Form.Item>
                                            </Form.Item>
                                            <Form.Item className={mainStyle.formItem}>
                                                <label
                                                    className={mainStyle.label}><b><BarChartOutlined/>&nbsp;&nbsp;模板引用</b></label>
                                                <Form.Item name='quote' noStyle>
                                                    <Input className={mainStyle.field}/>
                                                </Form.Item>
                                            </Form.Item>
                                            <Form.Item className={mainStyle.formItem}>
                                                <label
                                                    className={mainStyle.label}><b><StarOutlined/>&nbsp;&nbsp;模板评价</b></label>
                                                <Form.Item name='evaluation' noStyle>
                                                    <div className={mainStyle.field} style={{
                                                        display: 'inline-block',
                                                        border: 'solid 1px #CCCCCC',
                                                        height: '32px',
                                                        overflow: 'hidden',
                                                        position: 'relative'
                                                    }}>
                                                        <Rate className={mainStyle.rate} allowHalf/>
                                                    </div>
                                                </Form.Item>
                                            </Form.Item>
                                        </Form.Item>
                                    </Form>
                                    <div className={mainStyle.editor}>
                                        <Spin tip='正在加载文本编辑工具，请稍候......' style={{width: '100%'}}
                                              spinning={this.state.editorLoading}/>
                                        <Editor outputFormat='html' disabled={!this.state.editAbled}
                                                apiKey='5kkfslhraltzfgu1asfddhwurh93a1i3mj6egrdgfhm40uwv'
                                                init={{
                                                    selector: '#editor',
                                                    height: '100%',
                                                    language: 'zh_CN',
                                                    statusbar: false,
                                                    menubar: false,
                                                    plugins: 'quickbars link table image imageTools lists wordcount preview autosave',
                                                    toolbar: 'redo undo fontselect fontsizeselect forecolor backcolor blockquote formatselect bold italic underline ' +
                                                        ' alignleft aligncenter alignright alignjustify lineheight indent outdent image link table numlist bullist wordcount preview restoredraft',
                                                    contextmenu: "copy paste cut selectAll",
                                                    automatic_uploads: false,
                                                    images_upload_url: '',
                                                    file_picker_types: 'file image media',
                                                    images_upload_handler: this.uploadImg,
                                                    file_picker_callback: this.uploadFile,
                                                    convert_urls: false
                                                }}

                                                ref={(node) => {
                                                    this.contentEditor = node
                                                }}

                                                onCopy={() => {
                                                    message.success({content: '内容已复制到剪贴板！', duration: 1}).then();
                                                }}
                                                onInit={() => {
                                                    this.setState({editorLoading: false})
                                                }}
                                        />
                                    </div>
                                </div>
                                <div className={mainStyle.toolBar}>
                                    <Space size={30}>
                                        <Button>取消</Button>
                                        <Button type='primary' onClick={() => {
                                            this.contentEditor.editor.uploadImages().then();
                                        }}>{this.state.editAbled ? '保  存' : '编  辑'}</Button>
                                    </Space>
                                </div>
                            </>
                    }
                </div>
                {/*弹出菜单*/}
                <Modal visible={this.state.menu} footer={null} width={120} bodyStyle={{padding: '0'}} closable={false}
                       destroyOnClose
                       maskClosable keyboard onCancel={this.hideMenu} style={{
                    position: 'absolute',
                    top: `${this.state.point.y}px`,
                    left: `${this.state.point.x}px`
                }}>
                    <Menu mode='vertical' onSelect={this.clickMenuItem}>
                        <Menu.Item key='reName' icon={<EditOutlined/>}
                                   className={mainStyle.item}>重命名</Menu.Item>
                        {
                            this.state.selected.key === 'dir001' ?
                                <Menu.Item key='newDir' icon={<DiffOutlined/>}
                                           className={mainStyle.item}>新建分组</Menu.Item> :
                                !this.state.selected.isLeaf ?
                                    <Menu.Item key='newTemplate' icon={<DiffOutlined/>}
                                               className={mainStyle.item}>新建模板</Menu.Item> :
                                    <>
                                        <SubMenu title='移动至' icon={<SisternodeOutlined/>}
                                                 className={mainStyle.item}>
                                            {
                                                this.state.treeData[0].children.map(item => {
                                                    let isParent = false;
                                                    item.children.forEach(node => {
                                                        if (node.key === this.state.selected.key) {
                                                            isParent = true;
                                                        }
                                                    });
                                                    return !isParent ? <Menu.Item
                                                        key={`move_${item.key}`}>{item.title}</Menu.Item> : '';
                                                })
                                            }
                                        </SubMenu>
                                        <Menu.Item key='share' icon={<ShareAltOutlined/>}
                                                   className={mainStyle.item}>分享</Menu.Item>
                                    </>

                        }
                        {
                            this.state.selected.key === 'dir001' ? '' :
                                !this.state.selected.isLeaf ? <Menu.Item key='deleteDir' icon={<DeleteOutlined/>}
                                                                         className={mainStyle.item}>删除组</Menu.Item> :
                                    <Menu.Item key='deleteTemplate' icon={<DeleteOutlined/>}
                                               className={mainStyle.item}>删除模板</Menu.Item>
                        }
                    </Menu>
                </Modal>
                {/*点击弹出菜单后的操作框*/}
                <Modal visible={this.state.option.visible} okText='确定' cancelText='取消' onCancel={this.hideOption}
                       maskClosable={false} width={400} onOk={this.submitOption} destroyOnClose
                       title={this.state.option.type === 'reName' ? '重命名' : this.state.option.type === 'newDir' ? '新建分组' : this.state.option.type === 'newTemplate' ? '新建模板' :
                           this.state.option.type === 'deleteDir' ? '删除分组' : '删除模板'}>
                    {
                        this.state.option.type === 'deleteDir' ? '确定要删除该分组吗？' :
                            this.state.option.type === 'deleteTemplate' ? '确定要删除该模板吗？' :
                                <Form labelCol={{span: 5}} wrapperCol={{span: 18}} ref={(node) => {
                                    this.form = node
                                }}>
                                    <Form.Item name='option'
                                               label={this.state.option.type === 'reName' ? '新的名称' : this.state.option.type === 'newDir' ? '分组名称' : '模板名称'}>
                                        <Input/>
                                    </Form.Item>
                                </Form>
                    }
                </Modal>
            </div>
        );
    }
}

export default MsgModle;