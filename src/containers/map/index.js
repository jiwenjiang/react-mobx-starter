/**
 * Created by j_bleach on 2018/9/27 0027.
 */
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import config from "config";
import Search from "containers/search";
import Car from "containers/car";
import * as creeper from "services/mapSDK/mapbox-gl";
import Operators from "component/map/operators";
import GotoShare from "component/map/share";
import RoutePanel from "component/map/routePanel";
import ConfirmModal from "component/common/confirmModal";
import WarningModal from "component/common/warningModal";
import BeginNav from "component/nav/beginNav";
import startConfirm from "assets/img/startConfirm.png";
import "./index.less";
import loc from "services/locSdk";


@inject("mapStore", "commonStore", "floorStore")
@observer
class mapPage extends Component {
    constructor(props) {
        super(props);
        // this.searchRef = React.createRef();
        this.confMarker = null; // black
        this.polyMarker = null; // blue
        this.ibeaconMarker = null; // red
        this.gpsMarker = null; // green
    }

    componentDidMount() {
        if (this.props.commonStore.projectType === "Addressing") {
            this.props.commonStore.changeSearchStatus("end");
        }
        const map = new creeper.VectorMap("wb-map", this.props.mapStore.mapId, config.mapIp + "/");
        const route = new creeper.RouteComponent(map, this.props.mapStore.mapId, config.mapIp + "/");
        // 监听地图加载完成
        map.on("load", () => {
            this.props.mapStore.saveMapObj(map, creeper, route);
            // FIXME 手动触发
            map.zoomIn();
        });

        // 监听地图点击
        map.on("click", (e) => {
            this.props.mapStore.handleMarker(e);
        });

        // 监听楼层改变
        map.on("floor.state.change", (event) => {
            this.props.floorStore.changeFloorStatus(event, map);
        });

        // 禁用滑动
        document.addEventListener("touchmove", (e) => {
            if (!e.target.classList.contains("canBeScroll") && !e.target.classList.contains("am-list-content")) {
                e.preventDefault();
            }
        });

        // 定位sdk
        loc.init({
            timeout: 50000,
            locType: ["gps", "ibeacon"],
            mapId: this.props.mapStore.mapId,
            complete: () => {
                console.log("初始化成功！");
                loc.startLocation({
                    complete: () => {
                    }
                });
            },
            error: (err) => {
                console.log("throw", err);
            }
        });
        loc.onLocation({
            complete: (data) => {
                this.setMarker(data);
                if (data.level && data.level != this.props.floorStore.mapFloor) {
                    this.props.floorStore.listenIbeacon(this.props.mapStore.mapObj, data.level);
                }
                console.log(`${data.locType == "ibeacon" ? "蓝牙点" : "gps"}`, data);
            }
        });
    }

    setMarker(data) {
        if (this.props.mapStore.mapObj && this.props.mapStore.mapGL) {
            if (data.locType === "ibeacon") {
                if (this.confMarker) {
                    this.confMarker.setLngLat([data.fiducialLon, data.fiducialLat]);
                } else {
                    let el = document.createElement("div");
                    el.style.background = "black";
                    el.style.width = "10px";
                    el.style.height = "10px";
                    this.confMarker = new this.props.mapStore.mapGL.Marker(el).setLngLat([data.fiducialLon, data.fiducialLat])
                        .addTo(this.props.mapStore.mapObj);
                }
                if (this.polyMarker) {
                    this.polyMarker.setLngLat([data.polygonLon, data.polygonLat]);
                } else {
                    let el = document.createElement("div");
                    el.style.background = "blue";
                    el.style.width = "10px";
                    el.style.height = "10px";
                    this.polyMarker = new this.props.mapStore.mapGL.Marker(el).setLngLat([data.polygonLon, data.polygonLat])
                        .addTo(this.props.mapStore.mapObj);
                }
                if (this.ibeaconMarker) {
                    this.ibeaconMarker.setLngLat([data.longitude, data.latitude]);
                } else {
                    let el = document.createElement("div");
                    el.style.background = "red";
                    el.style.width = "10px";
                    el.style.height = "10px";
                    this.ibeaconMarker = new this.props.mapStore.mapGL.Marker(el).setLngLat([data.longitude, data.latitude])
                        .addTo(this.props.mapStore.mapObj);
                }
            }
            if (data.locType === "gps") {
                if (this.gpsMarker) {
                    this.gpsMarker.setLngLat([data.longitude, data.latitude]);
                } else {
                    let el = document.createElement("div");
                    el.style.background = "green";
                    el.style.width = "10px";
                    el.style.height = "10px";
                    this.gpsMarker = new this.props.mapStore.mapGL.Marker(el).setLngLat([data.longitude, data.latitude])
                        .addTo(this.props.mapStore.mapObj);
                }
            }
        }
    }


    render() {
        const {searchStatus, confirmModalStatus, warningModalStatus, projectType} = this.props.commonStore;
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
        const warningModalProps = {
            text: warningModalStatus,
            confirm: () => {
                this.props.commonStore.changeWarningModal(false);
            },
        };
        // const operatorsProps = {
        //     searchRef: this.searchRef
        // };
        return (
            <div>
                <div id="wb-map" className="wb-map-box" width="100vw" height="100vh"
                     style={{width: "100vw", height: "100vh"}}></div>
                {projectType == "Addressing" && searchStatus && <Search></Search>}
                {projectType == "Car" && searchStatus && <Car></Car>}
                {confirmModalStatus && <ConfirmModal {...confirmModalProps}></ConfirmModal>}
                {warningModalStatus && <WarningModal {...warningModalProps}></WarningModal>}
                <Operators></Operators>
                <GotoShare></GotoShare>
                <BeginNav></BeginNav>
                <RoutePanel></RoutePanel>
            </div>
        );
    }
}

export default mapPage;