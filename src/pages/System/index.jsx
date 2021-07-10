import React, {PureComponent} from 'react';
import {Redirect, Route, Switch} from "react-router";

import Login from "./Login";
import ResetPwd from "./ResetPwd";
import Home from './Home';

class System extends PureComponent {
    render() {
        return (
            <Switch>
                <Route path='/system/login' component={Login}/>
                <Route path='/system/resetPwd' component={ResetPwd}/>
                <Route path='/system/home' component={Home}/>
                <Redirect to='/system/login'/>
            </Switch>
        );
    }
}

export default System;
