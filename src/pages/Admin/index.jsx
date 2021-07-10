import React, {Component} from 'react';
import {Redirect, Route, Switch} from "react-router";
import View from "./View";
import WorkSpace from "./WorkSpace";

class Admin extends Component {
    render() {
        return (
            <>
                <Switch>
                    <Route path='/admin/view' component={View}/>
                    <Route path='/admin/workspace' component={WorkSpace}/>
                    <Redirect to='/admin/view'/>
                </Switch>
            </>
        );
    }
}

export default Admin;
