import React, {Component} from 'react';
import Store from "../../redux/store";
import {saveCode} from "../../redux/actions/byCode";

const {store}=Store;

class RandomCode extends Component {

    componentDidMount() {
        this.paintCode();
    }

    paintCode=()=>{
        let code=[];
        let codeStr='';
        do {
            const num=Math.round(Math.random()*123)
            if ((num>=48&&num<=57)||(num>=65&&num<=90)||(num>=97&&num<=122)){
                code=[...code,String.fromCharCode(num)]
            }
        }while (code.length<5)
        const draw=this.draw.getContext('2d');
        draw.clearRect(0,0,130,this.props.height);
        draw.beginPath();
        draw.fillStyle='darkgray';
        draw.moveTo(Math.round(Math.random()*20),Math.round(Math.random()*this.props.height));
        draw.lineTo(Math.round(130-Math.random()*20),Math.round(Math.random()*this.props.height));
        draw.stroke();
        draw.closePath();
        draw.fillStyle='rgb(24,144,255)';
        draw.font='bold 18px 微软雅黑'
        for (let i=0;i<4;i++){
            draw.fillText(code[i],10+30*i,25);
            codeStr=codeStr+code[i];
        }
        store.dispatch(saveCode(codeStr));
    }

    render() {
        return (
            <canvas width='130' height={this.props.height} title='更换验证码' style={{background:'#e9e7ef',float:'right',cursor:'pointer'}} ref={elment=>{this.draw=elment}} onClick={this.paintCode}>
                请使用Google或Edge浏览器登录！
            </canvas>
        );
    }
}

export default RandomCode;
