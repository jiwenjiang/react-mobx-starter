/**
 * Created by j_bleach on 2018/9/17 0017.
 */
import React from 'react';
import {Provider} from 'mobx-react';
import {HashRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import AsyncComponent from './asyncRoute';
import * as stores from '../mobx/stores';

const List = AsyncComponent(() => import("../containers/list"));


const reactConfig = (
    <Provider {...stores}>
        <Router>
            <Switch>
                <Route path='/list' component={List}/>
                <Redirect path="/" to={{pathname: '/list'}}/>
            </Switch>
        </Router>
    </Provider>
);

export default reactConfig;