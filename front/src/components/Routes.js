import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Login from '../scenes/Auth/Modal/Form/Login';
import Registration from '../scenes/Auth/Modal/Form/Registration';
import Home from '../scenes/home/Home';
import {connect} from "react-redux";
import HomeAuth from '../scenes/user/HomeAuth';
import Settings from '../scenes/user/profile/settings';
import SelectTarget from "../scenes/user/selectTarget/selectTarget";
import TargetList from '../scenes/user/targetList/TargetList';



function Routes(props) {

    return (
        <Switch>
            <Route exact path="/">
                <Home/>
            </Route>
            <Route exact path="/login">
                <Login/>
            </Route>
            <Route exact path="/registration">
                <Registration/>
            </Route>
            <Route exact path="/user/settings">
                <Settings/>
            </Route>
            <Route exact path="/user">
                <HomeAuth/>
            </Route>
            <Route exact path="/newTarget">
                <SelectTarget />
            </Route>
            <Route path="/target/:id">
                <TargetList />
            </Route>
        </Switch>
    )
}

export default connect()(Routes)
