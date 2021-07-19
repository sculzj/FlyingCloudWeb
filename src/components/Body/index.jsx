import React, {Component} from 'react';
import {Redirect, Route, Switch} from "react-router";
import Index from "../../pages/Index";
import ProductionCenter from "../../pages/ProductCenter";
import Community from "../../pages/Community";
import Wiki from "../../pages/Wiki";
import Register from "../../pages/Register";
import Admin from '../../pages/Admin';
import System from "../../pages/System";
import Home from "../../pages/Home";

class Body extends Component {

    render() {
        return (
            <Switch>
                <Route path='/index' component={Index}/>
                <Route path='/product' component={ProductionCenter}/>
                <Route path='/community' component={Community}/>
                <Route path='/join' component={Index}/>
                <Route path='/wiki' component={Wiki}/>
                <Route path='/register' component={Register}/>
                <Route path='/admin' component={Admin}/>
                <Route path='/system' component={System}/>
                <Route path='/home' component={Home}/>
                <Redirect to='/index'/>
            </Switch>
        );
    }
}

export default Body;
