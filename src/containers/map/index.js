/**
 * Created by j_bleach on 2018/9/27 0027.
 */
/*eslint-disable*/
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import config from "config";
import Search from "containers/search";
import * as creeper from "services/mapSDK/mapbox-gl";
import Operators from "component/map/operators";
import "./index.less";


@inject("mapStore", "commonStore")
@observer
class mapPage extends Component {

    componentDidMount() {
        const map = new creeper.VectorMap("wb-map", this.props.mapStore.mapId, config.mapIp + "/");
        this.props.mapStore.saveMapObj(map);
    }


    render() {
        const {searchStatus} = this.props.commonStore;
        return (
            <div>
                <div id="wb-map" className="wb-map-box" width="100vw" height="100vh"
                     style={{width: "100vw", height: "100vh"}}></div>
                {searchStatus && <Search></Search>}
                <Operators></Operators>
            </div>

        );
    }
}

export default mapPage;