/**
 * Created by j_bleach on 2018/9/27 0027.
 */
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import config from "config";
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
import {getQueryString} from "services/utils/tool";
import normalUrl from "config/url/normal";
import wx from "weixin-js-sdk";

// import audioTest from "assets/audio/routePlan.mp3";

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

    getSignature() {
        const signBody = `url=${encodeURIComponent(window.location.href.split("#")[0])}&mapId=${this.props.mapStore.mapId}`;
        // 请求签名
        fetch(normalUrl.wxSign, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: signBody
        }).then((response) => response.json()).then((data) => {
            this.configWx(data.data);
        }).catch((err) => {
            console.log(err, "err");
        });
    }

    // 配置微信
    configWx(sign) {
        window.wx = wx;
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: sign.appid, // 必填，公众号的唯一标识
            timestamp: sign.timestamp, // 必填，生成签名的时间戳
            nonceStr: sign.nonceStr, // 必填，生成签名的随机串
            signature: sign.signature,// 必填，签名
            beta: true,   //用于在页面加载之初调用JSAPI
            jsApiList: ["openWXDeviceLib", "closeWXDeviceLib",
                "onWXDeviceBluetoothStateChange", "startSearchBeacons",
                "stopSearchBeacons", "onSearchBeacons", "startRecord", "stopRecord",
                "translateVoice", "onMenuShareAppMessage", "getLocation",
                "openBluetoothAdapter", "onWXDeviceBluetoothStateChange", "getBluetoothAdapterState"] // 必填，需要使用的JS接口列表
        });
        wx.error(err => {
            console.log(err, "err");
        });
        wx.ready(() => {
            window.wx = wx;
        });
    }

    componentDidMount() {

        this.getSignature();
        // 获取url参数
        const projectType = getQueryString("type", window.location.href) || "Addressing";
        // const projectType = "car";
        const mapId = getQueryString("mapId", window.location.href) || this.props.mapStore.mapId;
        let shareMessage = getQueryString("miniMessage", window.location.href);

        this.props.commonStore.changeProjectType(projectType);
        // 更新服务
        this.props.mapStore.updateMapId(mapId);
        this.props.mapStore.getMapServices(mapId);
        if (this.props.commonStore.projectType === "Addressing") {
            this.props.commonStore.changeSearchStatus("end");
        }
        const map = new creeper.VectorMap("wb-map", this.props.mapStore.mapId, config.mapIp + "/");
        const route = new creeper.RouteComponent(map, this.props.mapStore.mapId, config.mapIp + "/");
        // 监听地图加载完成
        map.on("load", () => {
            this.props.mapStore.saveMapObj(map, creeper, route);
            setTimeout(() => {
                map.resetNorth();
                if (map.configComponent && map.configComponent.mapZone) {
                    if (map.configComponent.mapZone && map.configComponent.mapZone.name) {
                        document.title = map.configComponent.mapZone.name;
                    }
                    if (!shareMessage) {
                        map.zoomTo(map.configComponent.mapZone.default_zoom);
                    }
                    this.props.mapStore.updateBBoxPolygon(map.configComponent.mapZone.bbox);
                }
            }, 500);
            map.zoomTo(18);
            this.props.commonStore.getBaiduToken();
            if (shareMessage) {
                this.props.commonStore.changeLocationLoading(true);
                setTimeout(() => {
                    this.props.commonStore.changeLocationLoading(false);
                    this.locationFail = true;
                }, 5000);
                shareMessage = JSON.parse(decodeURI(shareMessage));
                this.props.commonStore.changeSearchStatus(false);
                this.props.mapStore.confirmMarker("end", shareMessage);
            }
        });

        // 监听地图点击
        map.on("click", (e) => {
            if (this.props.navStore.navMode == "free" && !this.props.navStore.navRoutes) {
                this.props.mapStore.handleMarker(e);
            }
        });

        // 监听楼层改变
        map.on("floor.state.change", (event) => {
            this.props.floorStore.changeFloorStatus(event, map);
            setTimeout(() => {
                this.props.floorStore.updateFloor(event.target.floorComponent.nowLevelIndex);
            });
        });

        // 监听地图移动
        map.on("touchmove", () => {
            if (this.props.navStore.initLocation) {
                this.props.navStore.updateInitLocation(false);
            }
        });

        // 禁用滑动
        document.addEventListener("touchmove", (e) => {
            if (!e.target.classList.contains("canBeScroll") && !this.props.commonStore.searchStatus) {
                e.preventDefault();
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
                if (this.props.commonStore.detectLocation && data.locType == "ibeacon"
                    && data.level && data.level != this.props.floorStore.mapFloor) {
                    console.log("entry change level", data.level, this.props.floorStore.mapFloor);
                    this.props.floorStore.listenIbeacon(this.props.mapStore, data.level);
                }
                if (!this.props.navStore.freeMarker && this.props.navStore.firstLocation) {
                    // console.log("entry first locate");
                    if (this.props.mapStore.mapGL) {
                        const locFlag = this.props.navStore.initFreeMarker(this.props.mapStore, data);
                        this.props.navStore.updateInitLocation(true);
                        if (shareMessage) {
                            console.log("分享");
                            if (!this.locationFail) {
                                this.props.mapStore.confirmMarker("start", this.props.navStore.freeMarkerPoint);
                                this.props.commonStore.changeLocationLoading(false);
                            }
                        }
                        if (locFlag) {
                            setTimeout(() => {
                                nav.init(loc);
                                nav.startFree({
                                    complete: (data) => {
                                        // console.log("move", data);
                                        this.props.navStore.moveFreeMarker(this.props.mapStore, data);
                                    }
                                });
                            }, 100);
                        }
                    }
                }

                if (data.locType == "ibeacon") {
                    this.props.navStore.updateCurrentLocation(data);
                } else {
                    if (data.accuracy < 25) {
                        this.props.navStore.updateCurrentLocation(data);
                    }
                }
                // if (this.props.navStore.currentLocation && this.props.navStore.currentLocation.locType != data.locType) {
                //     console.log("trigger", data.locType);
                //     map.flyTo({
                //         zoom: data.locType == "gps" ? 18 : 20,
                //         speed: 1,
                //         curve: 1.4,
                //         easing(t) {
                //             return t;
                //         }
                //     });
                // }

                // console.log(`${data.locType == "ibeacon" ? "蓝牙点" : "gps"}`, data);
            }
        });

        nav.compass({
            complete: (alpha) => {
                this.props.navStore.orientateMarker(alpha, map);
            }
        });

    }

    componentWillUnmount() {
        // this.props.mapStore.saveMapObj(null, null, null);
        // window.location.reload();
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
                if (data.accuracy < 500) {
                    // console.log("gps精度", data.accuracy);
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
    }


    render() {
        const {
            searchStatus, confirmModalStatus,
            warningModalStatus, projectType, noticeProps,
        } = this.props.commonStore;
        const {startMarker, endMarker, endMarkerPoint, startMarkerPoint} = this.props.mapStore;
        const {freeMarker, navMode, evaluateStatus} = this.props.navStore;
        const confirmModalProps = {
            text: ` 要将此处设为${freeMarker ? "终" : "起"}点吗？`,
            address: freeMarker
                ? endMarkerPoint && `${endMarkerPoint.name}`
                : startMarkerPoint && `${startMarkerPoint.name}`,
            addressStyle: {},
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
                {navMode === "free" && <Operators></Operators>}
                {!searchStatus && <GotoShare></GotoShare>}
                {(startMarker || endMarker) && !searchStatus && <BeginNav></BeginNav>}
                <RoutePanel></RoutePanel>
                {startMarker && !searchStatus && <NavBottom></NavBottom>}
                {navMode !== "free" && <NavPanel></NavPanel>}
                <audio id="wb-audio" autoPlay preload="true"></audio>
            </div>
        );
    }
}

export default mapPage;