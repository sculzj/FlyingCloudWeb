import React, {Component} from 'react';
import Nav from "../Nav";
import Header from "../Header";
import {Redirect, Route, Switch} from "react-router";
import AddMembers from "./AddMembers";
import adminStyle from './index.module.css';
import AddGroups from "./AddGroups";
import OrgInfo from "./OrgInfo";

class WorkSpace extends Component {

    state={width:'1700px',height:'1000px'};

    componentDidMount() {
        this.setState({width:`${window.innerWidth-230}px`,height:`${window.innerHeight-74}px`});
        window.addEventListener('resize',()=>{
            this.setState({width:`${window.innerWidth-230}px`,height:`${window.innerHeight-74}px`});
        });
    }

    render() {
        return (
            <>
                <Header/>
                <Nav/>
                <div className={adminStyle.content} style={{width:this.state.width,height:this.state.height}}>
                    <Switch>
                        <Route path='/admin/workspace/addmembers' component={AddMembers}/>
                        <Route path='/admin/workspace/addgroups' component={AddGroups}/>
                        <Route path='/admin/workspace/basicinfo' component={OrgInfo}/>
                        <Redirect to='/admin/workspace/addmembers'/>
                    </Switch>
                </div>
            </>
        );
    }
}

export default WorkSpace;
