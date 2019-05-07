/**
 * Created by j_bleach on 2018/9/17 0017.
 */
/*eslint-disable*/
import React, {Component} from "react";
import {Provider} from "mobx-react";
import {HashRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import AsyncComponent from "./asyncRoute";
import * as stores from "../mobx/stores";
import {Layout} from "antd";
import Sider from "component/common/sider";

const {Header} = Layout;


// const TextMarker = AsyncComponent(() => import("../containers/mapMarker/textMarker/index.js"));
const TextMarker = AsyncComponent(() => import("../containers/mapMarker/textMarker/index.js"));

const reactConfig = (
    <Provider {...stores}>
        <Router>
            <Switch>
                <Route>
                    <Layout>
                        <Header className="header">
                            <div style={{color: "wheat", fontSize: "20px"}}>JS代码示例</div>
                        </Header>
                        <Layout>
                            <Sider></Sider>
                            <Layout>
                                <div style={{background: "white", height: "100%", width: "100%"}}>
                                    <Route path="/home" component={TextMarker}/>
                                </div>
                            </Layout>
                        </Layout>
                    </Layout>
                </Route>
            </Switch>
        </Router>
    </Provider>
);

export default reactConfig;
