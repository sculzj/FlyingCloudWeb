//该文件定义了公共方法

/**
 * 搜索树中的叶子节点
 * @param data 树结构数据
 * @return {number} 子节点数量
 */
function seacrhLeaf(data) {
    let init=0;
    for (let i=0;i<data.length;i++){
        if (data[i].isLeaf){
            init+=1;
        }else if (data[i].children){
            init+=seacrhLeaf(data[i].children);
        }
    }
    return init;
}

/**
 * 遍历搜索树节点
 * @param data 源数据
 * @param title 新标题
 * @return  node 符合搜索结果的节点
 */
function searchTreeNode(data, title) {
    let node = '';
    for (let i = 0; i < data.length; i++) {
        console.log('执行搜索');
        if (data[i].title.includes(title)) {
            return data[i];
        } else if (data[i].children) {
            const result = searchTreeNode(data[i].children, title);
            if (result) {
                return result;
            }
        }
    }
    return node;
}

/**
 * 遍历树节点，修改key节点的title
 * @param data 源数据
 * @param key 关键字
 * @param title 要修改的title
 */
function reNameNode(data, key, title) {
    let node = '';
    for (let i = 0; i < data.length; i++) {
        console.log('执行搜索');
        if (data[i].key === key) {
            data[i].title = title;
            return data[i];
        } else if (data[i].children) {
            const result = reNameNode(data[i].children, key, title);
            if (result) {
                return result;
            }
        }
    }
    return node;
}

exports.seacrhLeaf=seacrhLeaf;
exports.searchTreeNode = searchTreeNode;
exports.reNameNode = reNameNode;