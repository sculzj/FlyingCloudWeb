import React, {Component} from 'react';
import keyStyle from './index.module.css';

class KeyData extends Component {
    render() {
        return (
            <div className={keyStyle.dataBox}>
                <div>
                    <div className={keyStyle.item} title='企业成员数量'>20,500</div>
                    <div className={keyStyle.item} title='企业组织机构'>103</div>
                    <div className={keyStyle.item} title='7天企业搜索指数，来自于百度及谷歌'>52,341</div>
                    <div className={keyStyle.item} title='7天舆情指数，来自成员评价'>86</div>
                </div>
                <div className={keyStyle.title}>XX关键指数</div>
            </div>
        );
    }
}

export default KeyData;
