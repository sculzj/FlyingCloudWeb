import React, {PureComponent} from 'react';
import frameStyle from './index.module.css';
import Logo from "../../components/Logo";
import Banner from "../../components/Banner";
import Login from "../../components/Login";
import Tipper from "../../components/Tipper";
import terminal from '../../images/terminal.png';
import cost from '../../images/cost.png';
import online from '../../images/online.png';
import flow from '../../images/flow.png';
import safe from '../../images/safe.png';
import banner1 from '../../images/banner1.jpg';
import banner2 from '../../images/banner2.jpg';
import banner3 from '../../images/banner3.jpg';
import Course from "../../components/Course";
import {
    COLORS,
    TITLE_ONE,
    TITLE_TWO,
    TITLE_THREE,
    TITLE_FIVE,
    TITLE_FOUR,
    DESCRIBE_FIVE,
    DESCRIBE_FOUR,
    DESCRIBE_ONE,
    DESCRIBE_THREE,
    DESCRIBE_TWO
} from "../../resource/constant";
import NavCommon from "../../components/NavCommon";
import Footer from "../../components/Footer";

class Index extends PureComponent {

    render() {
        return (
            <>
                <NavCommon/>
                <div className={frameStyle.frame}>
                    <Logo/>
                    <div className={frameStyle.panel}>
                        <Banner imgs={[banner1, banner2, banner3]}/>
                        <Login/>
                    </div>
                    <div className={frameStyle.lightSopt}>
                        <h3>选择飞云的五大理由</h3>
                        <Tipper background={COLORS.secunda_color} content={DESCRIBE_ONE} title={TITLE_ONE} icon={flow}/>
                        <Tipper background={COLORS.theme_color} content={DESCRIBE_TWO} title={TITLE_TWO}
                                icon={terminal}/>
                        <Tipper background={COLORS.secunda_color} content={DESCRIBE_THREE} title={TITLE_THREE}
                                icon={online}/>
                        <Tipper background={COLORS.theme_color} content={DESCRIBE_FOUR} title={TITLE_FOUR} icon={cost}/>
                        <Tipper background={COLORS.secunda_color} content={DESCRIBE_FIVE} title={TITLE_FIVE}
                                icon={safe}/>
                    </div>
                    <Course/>
                </div>
                <Footer/>
            </>

        );
    }
}

export default Index;
