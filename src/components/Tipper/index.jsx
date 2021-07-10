/**
 * 可翻转的卡片
 */
import React, {Component} from 'react';
import tipperStyle from './index.module.css'

class Tipper extends Component {

    render() {
        return (
            <div className={tipperStyle.box}>
                <div className={tipperStyle.content}>
                    <p>{this.props.content}</p>
                </div>
                <div className={tipperStyle.keyInfo} style={{background: this.props.background}}>
                    <span>{this.props.title}</span><br/><img src={this.props.icon} alt=''/>
                </div>
            </div>
        );
    }
}

export default Tipper;