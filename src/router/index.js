/**
 * Created by j_bleach on 2018/9/17 0017.
 */
import React from 'react';
import {Provider} from 'mobx-react';
import {HashRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import AsyncComponent from './asyncRoute';
import * as stores from '../mobx/stores';


const Map = AsyncComponent(() => import("../containers/home"));


const reactConfig = (
    <Provider {...stores}>
        <Router>
            <Switch>

                <Redirect path="/" to={{pathname: '/map'}}/>
            </Switch>
        </Router>
    </Provider>
);

export default reactConfig;
