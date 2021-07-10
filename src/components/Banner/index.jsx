import React, {Component} from 'react';
import {Carousel} from "antd";
import bannerStyle from './index.module.css';

class Banner extends Component {
    render() {
        const imgs=this.props.imgs;
        return (
            <Carousel autoplay className={bannerStyle.content}>
                {
                    imgs.map((value,index)=>{
                        return <img src={value} alt='' key={index}/>
                    })
                }
            </Carousel>
        );
    }
}

export default Banner;