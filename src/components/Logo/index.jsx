import React, {PureComponent} from 'react';
import logo from '../../images/logoV.png';
import logoStyle from './index.module.css';

class Logo extends PureComponent {
    render() {
        return (
            <div className={logoStyle.logo}>
                <div className={logoStyle.left}>
                    <h1>飞云办公</h1>
                    <img src={logo} alt=''/>
                </div>
                <div className={logoStyle.right}>
                    <h2>员工办公更轻松，企业运行更高效！</h2>
                </div>
            </div>
        );
    }
}

export default Logo;