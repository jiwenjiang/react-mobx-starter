/**
 * Created by j_bleach on 2019/5/9 0009.
 */
/*eslint-disable*/
import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import AsyncComponent from "../asyncRoute";

const TextMarker = AsyncComponent(() => import("../../containers/mapMarker/textMarker/index.js"));
const ImgMarker = AsyncComponent(() => import("../../containers/mapMarker/imgMarker/index.js"));
const ImgAndTextMarker = AsyncComponent(() => import("../../containers/mapMarker/imgAndTextMarker/index.js"));
const LocMarker = AsyncComponent(() => import("../../containers/mapMarker/locMarker/index.js"));
const GifMarker = AsyncComponent(() => import("../../containers/mapMarker/gifMarker/index.js"));
const BatClearMarker = AsyncComponent(() => import("../../containers/mapMarker/batClearMarker/index.js"));
const ClearOneMarker = AsyncComponent(() => import("../../containers/mapMarker/clearOneMarker/index.js"));

const ShowMap = AsyncComponent(() => import("../../containers/baseMap/showMap/index.js"));
const ChangeFloor = AsyncComponent(() => import("../../containers/baseMap/changeFloor/index.js"));
const ControlMap = AsyncComponent(() => import("../../containers/baseMap/controlMap/index.js"));
const Rotate = AsyncComponent(() => import("../../containers/baseMap/rotate/index.js"));
const Transform2d = AsyncComponent(() => import("../../containers/baseMap/2dTransform/index.js"));
const PolygonClick = AsyncComponent(() => import("../../containers/baseMap/polygonClick/index.js"));

const mapMarkerRoute = () => <Switch>
    <Route path="/mapMarker/textMarker" component={TextMarker}/>
    <Route path="/mapMarker/imgMarker" component={ImgMarker}/>
    <Route path="/mapMarker/imgAndTextMarker" component={ImgAndTextMarker}/>
    <Route path="/mapMarker/locMarker" component={LocMarker}/>
    <Route path="/mapMarker/gifMarker" component={GifMarker}/>
    <Route path="/mapMarker/batClearMarker" component={BatClearMarker}/>
    <Route path="/mapMarker/clearOneMarker" component={ClearOneMarker}/>

    <Route path="/baseMap/showMap" component={ShowMap}/>
    <Route path="/baseMap/changeFloor" component={ChangeFloor}/>
    <Route path="/baseMap/controlMap" component={ControlMap}/>
    <Route path="/baseMap/rotate" component={Rotate}/>
    <Route path="/baseMap/2dTransform" component={Transform2d}/>
    <Route path="/baseMap/polygonClick" component={PolygonClick}/>

    <Redirect path="/" to={{pathname: "/mapMarker/textMarker"}}></Redirect>
</Switch>;

export default mapMarkerRoute;
