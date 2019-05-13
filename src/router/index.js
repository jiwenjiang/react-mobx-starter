/**
 * Created by j_bleach on 2018/9/17 0017.
 */
/*eslint-disable*/
import React from "react";
import {Provider} from "mobx-react";
import {HashRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import * as stores from "../mobx/stores";
import {Layout} from "antd";
import Sider from "component/common/sider";
import MapSdk from "component/common/map";
import MapMarkerRoute from "./mapMarker";
import BaseMapRoute from "./baseMap";

const {Header} = Layout;

const reactConfig = (
    <Provider {...stores}>
        <Router>
            <Switch>
                <Route>
                    <Layout>
                        <Header className="header">
                            <div style={{
                                color: "rgb(67, 150, 255)",
                                fontSize: "16px",
                                fontFamily: "cursive",
                                fontWeight: 700
                            }}>JS代码示例
                            </div>
                        </Header>
                        <Layout>
                            <Sider></Sider>
                            <Layout>
                                <div style={{background: "white", height: "100%", width: "100%", position: "relative"}}>
                                    <MapMarkerRoute></MapMarkerRoute>
                                    {/*<BaseMapRoute></BaseMapRoute>*/}
                                    <MapSdk></MapSdk>
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
