/**
 * Created by j_bleach on 2018/9/27 0027.
 */
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import config from "config";
import Search from "containers/search";
import * as creeper from "services/mapSDK/mapbox-gl";
import Operators from "component/map/operators";
import GotoShare from "component/map/share";
import RoutePanel from "component/map/routePanel";
import ConfirmModal from "component/common/confirmModal";
import startConfirm from "assets/img/startConfirm.png";
import "./index.less";


@inject("mapStore", "commonStore", "floorStore")
@observer
class mapPage extends Component {

    componentDidMount() {
        const map = new creeper.VectorMap("wb-map", this.props.mapStore.mapId, config.mapIp + "/");
        const route = new creeper.RouteComponent(map, this.props.mapStore.mapId, config.mapIp + "/");
        // 监听地图加载完成
        map.on("load", () => {
            this.props.mapStore.saveMapObj(map, creeper, route);
            // console.log("zoom", map.getZoom());
        });

        // 监听地图点击
        map.on("click", (e) => {
            this.props.mapStore.handleMarker(e);
        });

        // 监听楼层改变
        map.on("floor.state.change", (event) => {
            this.props.floorStore.changeFloorStatus(event, map);
        });
    }


    render() {
        const {searchStatus, confirmModalStatus} = this.props.commonStore;
        const confirmModalProps = {
            text: " 要将此处设为起点吗？",
            icon: startConfirm,
            confirm: () => {
                this.props.mapStore.planRoute();
                this.props.commonStore.changeConfirmModal(false);
            },
            cancel: () => {
            }
        };
        return (
            <div>
                <div id="wb-map" className="wb-map-box" width="100vw" height="100vh"
                     style={{width: "100vw", height: "100vh"}}></div>
                {searchStatus && <Search></Search>}
                {confirmModalStatus && <ConfirmModal {...confirmModalProps}></ConfirmModal>}
                <Operators></Operators>
                <GotoShare></GotoShare>
                <RoutePanel></RoutePanel>
            </div>
        );
    }
}

export default mapPage;