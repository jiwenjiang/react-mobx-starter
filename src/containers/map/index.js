/**
 * Created by j_bleach on 2018/9/27 0027.
 */
/*eslint-disable*/
import React, {Component} from "react";
import {List} from "antd-mobile";
import {observer, inject} from "mobx-react";
import config from "config";
import Search from "containers/search";
import * as creeper from "services/mapSDK/mapbox-gl";
import "./index.less";


@inject("mapStore", "commonStore")
@observer
class listPage extends Component {

    componentDidMount() {
        const map = new creeper.VectorMap("map", this.props.mapStore.mapId, config.mapIp + "/");

        map.on("drag", () => {
        });

        console.log(444);
    }

    render() {
        const {searchStatus} = this.props.commonStore;
        return (
            <div className="map-container">
                <div id="map" className="wb-map"></div>
                {searchStatus && <Search></Search>}
            </div>
        );
    }
}

export default listPage;