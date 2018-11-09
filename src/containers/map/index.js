/**
 * Created by j_bleach on 2018/9/27 0027.
 */
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import config from "config";
// import {getQueryString} from "services/utils/tool";
import Search from "containers/search";
import Car from "containers/car";
import * as creeper from "services/mapSDK/mapbox-gl";
import Operators from "component/map/operators";
import GotoShare from "component/map/share";
import RoutePanel from "component/map/routePanel";
import NavBottom from "component/nav/nav-bottom";
import NavPanel from "component/nav/navPanel";
import ConfirmModal from "component/common/confirmModal";
import WarningModal from "component/common/warningModal";
import NavEndModal from "component/nav/navComplete";
import NoticeComponent from "component/common/notice";
import BeginNav from "component/nav/beginNav";
import startConfirm from "assets/img/startConfirm.png";
import "./index.less";
import loc from "services/locSdk";
import nav from "services/navSDK";

@inject("mapStore", "commonStore", "floorStore", "navStore")
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
            map.zoomTo(19);
            this.props.commonStore.getBaiduToken();
        });

        // 监听地图点击
        map.on("click", (e) => {
            if (this.props.navStore.navMode == "free") {
                this.props.mapStore.handleMarker(e);
            }
        });

        // 监听楼层改变
        map.on("floor.state.change", (event) => {
            this.props.floorStore.changeFloorStatus(event, map);
            // console.log(event);
        });

        // 监听地图移动
        map.on("touchmove", () => {
            if (this.props.navStore.initLocation) {
                this.props.navStore.updateInitLocation(false);
            }
        });

        // 禁用滑动
        document.addEventListener("touchmove", (e) => {
            if (!e.target.classList.contains("canBeScroll") && !e.target.classList.contains("am-list-content")) {
                // e.preventDefault();
            }
        });
        // 定位sdk
        loc.init({
            timeout: 50000,
            locType: ["gps", "ibeacon"],
            mapId: this.props.mapStore.mapId,
            complete: () => {
                loc.startLocation({
                    complete: (data) => {
                        console.log("map-开启成功", data);
                    },
                    error: (err) => {
                        console.log("map-开启失败", err);
                    }
                });
            },
            error: (err) => {
                console.log("init", err);
            }
        });

        loc.onLocation({
            complete: (data) => {
                this.setMarker(data);
                // console.log("map-on", data);
                if (this.props.commonStore.detectLocation && data.level && data.level != this.props.floorStore.mapFloor) {
                    console.log("entry change level", data.level, this.props.floorStore.mapFloor);
                    this.props.floorStore.listenIbeacon(this.props.mapStore, data.level);
                }
                if (!this.props.navStore.freeMarker && this.props.navStore.firstLocation) {
                    // console.log("entry first locate");
                    if (this.props.mapStore.mapGL) {
                        this.props.navStore.initFreeMarker(this.props.mapStore, data);
                        this.props.navStore.updateInitLocation(true);
                        nav.init(loc);
                        nav.startFree({
                            complete: (data) => {
                                this.props.navStore.moveFreeMarker(this.props.mapStore, data);
                            }
                        });
                    }
                }
                // console.log(`${data.locType == "ibeacon" ? "蓝牙点" : "gps"}`, data);
            }
        });

        nav.compass({
            complete: (alpha) => {
                this.props.navStore.orientateMarker(alpha, map);
            }
        });

    }

    setMarker(data) {
        if (this.props.mapStore.mapObj && this.props.mapStore.mapGL) {
            if (data.locType === "ibeacon") {
                this.props.navStore.updateCurrentLocation(data);
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
                    // el.innerHTML = `${data.accuracy}`;
                    el.style.width = "10px";
                    el.style.height = "10px";
                    this.gpsMarker = new this.props.mapStore.mapGL.Marker(el).setLngLat([data.longitude, data.latitude])
                        .addTo(this.props.mapStore.mapObj);
                }
            }
        }
    }


    render() {
        const {
            searchStatus, confirmModalStatus,
            warningModalStatus, projectType, noticeProps,
        } = this.props.commonStore;
        const {startMarker, endMarker} = this.props.mapStore;
        const {freeMarker, navMode, evaluateStatus} = this.props.navStore;
        const confirmModalProps = {
            text: ` 要将此处设为${freeMarker ? "终" : "起"}点吗？`,
            icon: startConfirm,
            confirm: () => {
                this.props.mapStore.planRoute();
                this.props.commonStore.changeConfirmModal(false);
                if (freeMarker) {
                    document.getElementsByClassName("map-routePanel")[0].classList.add("dom-transformY-35");
                    document.getElementById("map-goToShare").classList.remove("dom-transformY-30");
                    document.getElementById("begin-nav").classList.add("dom-transformY-30");
                    this.props.mapStore.confirmEndMarkerFn(true);
                }
            },
            cancel: () => {
                if (freeMarker) {
                    this.props.mapStore.removeMarker("start");
                    this.props.mapStore.removeMarker("end");
                } else {
                    this.props.mapStore.removeMarker("start");
                }
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
                {evaluateStatus && <NavEndModal {...warningModalProps}></NavEndModal>}
                {noticeProps && NoticeComponent(noticeProps)}
                <Operators></Operators>
                {!searchStatus && <GotoShare></GotoShare>}
                {(startMarker || endMarker) && <BeginNav></BeginNav>}
                <RoutePanel></RoutePanel>
                {startMarker && <NavBottom></NavBottom>}
                {navMode !== "free" && <NavPanel></NavPanel>}
                <audio id="wb-audio" autoPlay preload="true"></audio>
            </div>
        );
    }
}

export default mapPage;
