import React, {Component} from 'react';
import {Drawer, List} from "antd";
import rankStyle from "./index.module.css";
import {ArrowDownOutlined, ArrowUpOutlined, FireFilled, MinusOutlined} from "@ant-design/icons";

class Rank extends Component {

    toggleRank = () => {
        this.props.toggleRank();
    }

    render() {
        return (
            <Drawer bodyStyle={{
                paddingTop: '40px',
                overflow: 'hidden',
                background: 'rgba(255,77,79,0.1)',
                fontSize: "16px"
            }} visible={this.props.visible} width={530} closable getContainer={false}
                    className={rankStyle.box} onClose={this.toggleRank}>
                <List className={rankStyle.list}
                      header={<div style={{fontSize: "16px", textAlign: "center", fontWeight: "700"}}>话题TOP10</div>}
                      bordered
                      dataSource={this.props.rank}
                      renderItem={item => (
                          <List.Item>
                              <a href='http://www.baidu.com'>
                                  <span className={rankStyle.rank}><FireFilled/> {item.discuss}</span>
                                  <span className={rankStyle.title}>{item.title}</span>
                              </a>
                              <span>
                               {
                                   item.change > 0 ? <ArrowUpOutlined style={{color: '#FF4D4F'}}/> : item.change === 0 ?
                                       <MinusOutlined style={{color: 'gray'}}/> :
                                       <ArrowDownOutlined style={{color: 'green'}}/>
                               } {Math.abs(item.change)}
                              </span>
                          </List.Item>
                      )}
                />
            </Drawer>
        );
    }
}

export default Rank;
