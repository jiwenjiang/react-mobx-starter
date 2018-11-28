/**
 * Created by j_bleach on 2018/9/17 0017.
 */
import React from 'react';
import {Provider} from 'mobx-react';
import {HashRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import AsyncComponent from './asyncRoute';
import * as stores from '../mobx/stores';

// const List = AsyncComponent(() => import("../containers/list"));
const Search = AsyncComponent(() => import("../containers/search"));
const Car = AsyncComponent(() => import("../containers/car"));
const Config = AsyncComponent(() => import("../containers/config"));
const Map = AsyncComponent(() => import("../containers/map"));


const reactConfig = (
    <Provider {...stores}>
        <Router>
            <Switch>
                {/*<Route path='/list' component={List}/>*/}
                <Route path='/config' component={Config}/>
                <Route path='/search' component={Search}/>
                <Route path='/car' component={Car}/>
                <Route path='/map' component={Map}/>
                <Redirect path="/" to={{pathname: '/map'}}/>
            </Switch>
        </Router>
    </Provider>
);

export default reactConfig;
