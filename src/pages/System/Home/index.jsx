import React, {Component} from 'react';
import {Route, Switch} from "react-router";

import Header from "./Header";
import Nav from "./Nav";
import Approve from "./Approve";
import AddUser from "./AddUser";
import Auth from "./Auth";

class Home extends Component {

    state = {height: '1000px', width: '1650px'};

    componentDidMount() {
        this.setState({height: `${window.innerHeight - 74}px`, width: `${window.innerWidth - 230}px`});
        window.addEventListener('resize', () => {
            this.setState({height: `${window.innerHeight - 74}px`, width: `${window.innerWidth - 230}px`});
        });
    }

    render() {
        return (
            <div>
                <Header/>
                <Nav/>
                <div style={{
                    minWidth: '1650px',
                    minHeight: '1000px',
                    height: this.state.height,
                    width: this.state.width,
                    borderLeft: 'solid 1px #C2C2C2',
                    float: 'left',
                    marginLeft: '10px',
                    marginTop: '10px',
                    padding:'0 20px'
                }}>
                    <Switch>
                        <Route path='/system/home/approve' component={Approve}/>
                        <Route path='/system/home/addUser' component={AddUser}/>
                        <Route path='/system/home/auth' component={Auth}/>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default Home;
