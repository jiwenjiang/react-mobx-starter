/**
 * Created by j_bleach on 2018/9/27 0027.
 */
/*eslint-disable*/
import React, {Component} from "react";
import {List} from "antd-mobile";
import {observer, inject} from "mobx-react";
import config from "config";
import * as creeper from "services/mapSDK/mapbox-gl";
import "./index.less";


@inject("mapStore")
@observer
class listPage extends Component {

    componentDidMount() {
        new creeper.VectorMap("map", 2, config.mapIp + "/");
        console.log(creeper);
    }

    render() {
        return (
            <div id="map" className="wb-map"></div>
        );
    }
}

export default listPage;