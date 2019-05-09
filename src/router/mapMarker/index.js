/**
 * Created by j_bleach on 2019/5/9 0009.
 */
import React from "react";
import {Route, Redirect, Switch} from "react-router-dom";
import AsyncComponent from "../asyncRoute";


const TextMarker = AsyncComponent(() => import("../../containers/mapMarker/textMarker/index.js"));
const ImgMarker = AsyncComponent(() => import("../../containers/mapMarker/imgMarker/index.js"));
const ImgAndTextMarker = AsyncComponent(() => import("../../containers/mapMarker/imgAndTextMarker/index.js"));
const LocMarker = AsyncComponent(() => import("../../containers/mapMarker/locMarker/index.js"));
const GifMarker = AsyncComponent(() => import("../../containers/mapMarker/gifMarker/index.js"));
const BatClearMarker = AsyncComponent(() => import("../../containers/mapMarker/batClearMarker/index.js"));
const ClearOneMarker = AsyncComponent(() => import("../../containers/mapMarker/clearOneMarker/index.js"));

const mapMarkerRoute = () => <Switch>
    <Route path="/mapMarker/textMarker" component={TextMarker}/>
    <Route path="/mapMarker/imgMarker" component={ImgMarker}/>
    <Route path="/mapMarker/imgAndTextMarker" component={ImgAndTextMarker}/>
    <Route path="/mapMarker/locMarker" component={LocMarker}/>
    <Route path="/mapMarker/gifMarker" component={GifMarker}/>
    <Route path="/mapMarker/batClearMarker" component={BatClearMarker}/>
    <Route path="/mapMarker/clearOneMarker" component={ClearOneMarker}/>
    <Redirect path="/" to={{pathname: "/mapMarker/textMarker"}}></Redirect>
</Switch>;

export default mapMarkerRoute;
