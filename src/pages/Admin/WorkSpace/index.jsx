import React, {Component} from 'react';
import Nav from "../Nav";
import Header from "../Header";
import {Redirect, Route, Switch} from "react-router";
import AddMembers from "./AddMembers";
import adminStyle from './index.module.css';
import EditOrg from "./EditOrg";
import OrgsList from "./OrgsList"
import OrgInfo from "./About";
import MyService from "./MyService";
import ServiceMarket from "./ServiceMarket";

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
                        <Route path='/admin/workspace/orgsList' component={OrgsList}/>
                        <Route path='/admin/workspace/editOrg' component={EditOrg}/>
                        <Route path='/admin/workspace/basicinfo' component={OrgInfo}/>
                        <Route path='/admin/workspace/myService' component={MyService}/>
                        <Route path='/admin/workspace/serviceMarket' component={ServiceMarket}/>
                        <Redirect to='/admin/workspace/addmembers'/>
                    </Switch>
                </div>
            </>
        );
    }
}

export default WorkSpace;
