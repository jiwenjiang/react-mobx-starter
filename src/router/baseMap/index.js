/**
 * Created by j_bleach on 2019/5/10 0010.
 */
/*eslint-disable*/
import React from "react";
import {Route, Redirect, Switch} from "react-router-dom";
import AsyncComponent from "../asyncRoute";


const ShowMap = AsyncComponent(() => import("../../containers/baseMap/showMap/index.js"));
const ChangeFloor = AsyncComponent(() => import("../../containers/baseMap/changeFloor/index.js"));
const ControlMap = AsyncComponent(() => import("../../containers/baseMap/controlMap/index.js"));
const Rotate = AsyncComponent(() => import("../../containers/baseMap/rotate/index.js"));
const Transform2d = AsyncComponent(() => import("../../containers/baseMap/2dTransform/index.js"));
const PolygonClick = AsyncComponent(() => import("../../containers/baseMap/polygonClick/index.js"));

const mapMarkerRoute = () => <Route>
    <Route path="/baseMap/showMap" component={ShowMap}/>
    <Route path="/baseMap/changeFloor" component={ChangeFloor}/>
    <Route path="/baseMap/controlMap" component={ControlMap}/>
    <Route path="/baseMap/rotate" component={Rotate}/>
    <Route path="/baseMap/2dTransform" component={Transform2d}/>
    <Route path="/baseMap/polygonClick" component={PolygonClick}/>
</Route>;

export default mapMarkerRoute;
