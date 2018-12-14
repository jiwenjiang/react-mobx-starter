/**
 * Created by j_bleach on 2018/10/11 0011.
 */
/*eslint-disable*/
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import Hammer from "hammerjs";
import nav from "services/navSDK";
import "./index.less";
import {toJS} from "mobx";
import {floorStore} from "../../../mobx/stores/floorStore";
import {handleTime, handleDistance} from "services/utils/tool";


@inject("mapStore", "navStore", "floorStore", "commonStore")
@observer
class beginNav extends Component {

    componentDidMount() {
        // swipe dom
        const squareUp = document.getElementById("begin-nav");
        const squareDown = document.querySelector(".nav-route-detail-head");
        const managerUp = new Hammer.Manager(squareUp);
        const managerDown = new Hammer.Manager(squareDown);
        const SwipeUp = new Hammer.Swipe();
        const SwipeDown = new Hammer.Swipe();
        managerUp.add(SwipeUp);
        managerDown.add(SwipeDown);
        managerUp.on("swipeup", () => {
            if (this.props.navStore.navRoutes) {
                document.getElementsByClassName("nav-route-detail")[0].classList.add("dom-transformY-100vh");
            }
        });
        managerDown.on("swipedown", () => {
            document.getElementsByClassName("nav-route-detail")[0].classList.remove("dom-transformY-100vh");
        });
        if (this.props.mapStore.confirmEndMarker) {
            document.getElementById("begin-nav").classList.add("dom-transformY-30");
        }
    }

    componentWillUnmount() {
        clearInterval(this.navTimer);
    }

    showDetail() {
        if (this.props.navStore.navRoutes) {
            document.getElementsByClassName("nav-route-detail")[0].classList.add("dom-transformY-100vh");
        }
    }

    showMap() {
        document.getElementsByClassName("nav-route-detail")[0].classList.remove("dom-transformY-100vh");
    }

    renderList(v, i) {
        if (v.crossType === 19) {
            return {
                0: <li className="nav-route-detail-list canBeScroll" key={i}>
                    <i className="iconfont icon-qidian2" style={{color: "#00B4FF"}}></i>&emsp;
                    <span className="nav-route-text canBeScroll">
                        <span className="nav-route-firstText nav-route-thinText">从我的位置</span>
                        <span className="nav-route-secondText nav-route-boldText">{this.props.mapStore.startMarkerPoint
                        && this.props.mapStore.startMarkerPoint.name} 出发</span>
                    </span>
                </li>,
                1: <li className="nav-route-detail-list canBeScroll" key={i}>
                    <i className="iconfont icon-zhihang" style={{color: "#9B9B9B"}}></i>&emsp;
                    <span className="nav-route-text canBeScroll">
                    <span className="nav-route-firstText nav-route-boldText">直行</span>
                    <span className="nav-route-secondText nav-route-thinText">{Math.round(v.distance)}米</span>
                    </span>
                </li>,
                2: <li className="nav-route-detail-list canBeScroll" key={i}>
                    <i className="iconfont icon-zuozhuan" style={{color: "#9B9B9B"}}></i>&emsp;
                    <span className="nav-route-text canBeScroll">
                    <span className="nav-route-firstText nav-route-thinText">{Math.round(v.distance)}米后</span>
                    <span className="nav-route-secondText nav-route-boldText">左转</span>
                    </span>
                </li>,
                3: <li className="nav-route-detail-list canBeScroll" key={i}>
                    <i className="iconfont icon-youzhuan" style={{color: "#9B9B9B"}}></i>&emsp;
                    <span className="nav-route-text canBeScroll">
                    <span className="nav-route-firstText nav-route-thinText">{Math.round(v.distance)}米后</span>
                    <span className="nav-route-secondText nav-route-boldText">右转</span>
                    </span>
                </li>,
                5: <li className="nav-route-detail-list canBeScroll" key={i}>
                    <i className="iconfont icon-zhongdian2" style={{color: "#FF343E"}}></i>&emsp;
                    <span className="nav-route-text canBeScroll">
                        <span className="nav-route-firstText nav-route-thinText">到达</span>
                        <span className="nav-route-secondText nav-route-boldText">{this.props.mapStore.endMarkerPoint
                        && this.props.mapStore.endMarkerPoint.name}</span>
                    </span>
                </li>,
            }[v.turnType];
        } else {
            return {
                10: <li className="nav-route-detail-list" key={i}>
                    <i className="iconfont icon-youzhuan" style={{color: "#9B9B9B"}}></i>&emsp;
                    <span className="nav-route-text">
                    <span className="nav-route-firstText nav-route-thinText">{Math.round(v.distance)}米后</span>
                    <span className="nav-route-secondText nav-route-boldText">进入楼梯</span>
                    </span>
                </li>,
                12: <li className="nav-route-detail-list" key={i}>
                    <i className="iconfont icon-youzhuan" style={{color: "#9B9B9B"}}></i>&emsp;
                    <span className="nav-route-text">
                    <span className="nav-route-firstText nav-route-thinText">{Math.round(v.distance)}米后</span>
                    <span className="nav-route-secondText nav-route-boldText">乘坐电梯</span>
                    </span>
                </li>,
            }[v.crossType];
        }
    }

    simNav() {
        if (!this.props.navStore.navRoutes) {
            return false;
        }
        if (document.getElementsByClassName("nav-route-detail")[0].classList.contains("dom-transformY-100vh")) {
            document.getElementsByClassName("nav-route-detail")[0].classList.remove("dom-transformY-100vh");
        }

        this.props.navStore.changeNavMode("sim");
        this.props.navStore.freeMarker && this.props.navStore.removeFreeMarker();
        this.props.commonStore.baiduVoiceUrl("开始导航");

        // 操作dom
        document.getElementsByClassName("map-routePanel")[0].classList.remove("dom-transformY-35");
        document.getElementById("begin-nav").classList.remove("dom-transformY-30");
        document.getElementById("nav-bottom").classList.add("dom-transformY-30");
        let changeFlag = true;
        this.navTimer = setInterval(() => {
            changeFlag = true;
        }, 3000);
        let bearing = null;
        this.props.navStore.updateNavData({});
        nav.startSim({
            routeData: toJS(this.props.navStore.navRoutes),
            map: this.props.mapStore.mapObj,
            speed: 5,
            onSimNav: (data) => {
                this.props.navStore.moveNavMarker(this.props.mapStore, [data.currentLon, data.currentLat], "simMarker");
                let navDatas = data.text ? data : {
                    ...data,
                    text: this.props.navStore.navRealData && this.props.navStore.navRealData.text
                };
                this.props.navStore.updateNavData(navDatas); // 更新导航数据
                if (bearing && bearing != data.bearing) {
                    changeFlag = false;
                    this.props.mapStore.mapObj.flyTo({
                        center: [data.currentLon, data.currentLat],
                        zoom: 20,
                        speed: 0.1,
                        curve: 1.6,
                        bearing: data.bearing,
                        easing(t) {
                            return t;
                        }
                    });
                }
                if (changeFlag) {
                    changeFlag = false;
                    this.props.mapStore.mapObj.flyTo({
                        center: [data.currentLon, data.currentLat],
                        zoom: 20,
                        speed: 0.5,
                        curve: 1,
                        bearing: data.bearing,
                        easing(t) {
                            return t;
                        }
                    });
                }
                if (data.level != this.props.floorStore.mapFloor) {
                    // const floor = data.level >= 0 ? data.level - 1 : data.level;
                    this.props.floorStore.updateFloor(data.level);
                    this.props.mapStore.mapObj.setLevel(data.level); //  更新楼层
                    this.props.floorStore.checkMarkerAndRoute(this.props.mapStore, data.level, data.floorIndex); // 终点，起点，路径检测
                }
                if (data.voice) {
                    this.props.commonStore.baiduVoiceUrl(data.voice);
                }
                bearing = data.bearing;
            },
            complete: () => {
                this.props.navStore.changeNavMode("free");
                this.props.commonStore.baiduVoiceUrl("到达目的地，感谢使用本次导航");
                document.getElementById("nav-bottom").classList.remove("dom-transformY-30");
                this.props.navStore.upDateNavCompleteRoute({
                    start: this.props.mapStore.startMarkerPoint,
                    end: this.props.mapStore.endMarkerPoint,
                });
                if (this.props.navStore.freeMarkerPoint) {
                    const freePoint = {
                        longitude: this.props.navStore.freeMarkerPoint.point[0],
                        latitude: this.props.navStore.freeMarkerPoint.point[1],
                        level: this.props.navStore.freeMarkerPoint.floor,
                    };
                    this.props.navStore.moveFreeMarker(this.props.mapStore, freePoint);
                }
                this.props.navStore.completeNav(this.props.mapStore);
                clearInterval(this.navTimer);
                // this.props.navStore.changeEvaluateStatus(true);
            }
        });
    }

    realNav() {
        if (document.getElementsByClassName("nav-route-detail")[0].classList.contains("dom-transformY-100vh")) {
            document.getElementsByClassName("nav-route-detail")[0].classList.remove("dom-transformY-100vh");
        }
        if (this.props.navStore.firstLocation) {
            return false;
        }
        // 当前时间
        let navTime = new Date().getTime();
        this.props.commonStore.changeDetectLocation(true); // 开启定位检测
        //
        this.props.navStore.changeNavMode("real");
        this.props.navStore.freeMarker && this.props.navStore.removeFreeMarker();
        const routeKey = JSON.stringify({level: Number(this.props.floorStore.mapFloor), index: 0});
        const startPoint = toJS(this.props.floorStore.routeIndoorBezier[routeKey])
            .geometry.coordinates[0];
        this.props.navStore.moveNavMarker(this.props.mapStore, startPoint, "navMarker");
        this.props.commonStore.baiduVoiceUrl("开始导航");
        this.props.navStore.updateNavData({});
        // 操作dom
        document.getElementsByClassName("map-routePanel")[0].classList.remove("dom-transformY-35");
        document.getElementById("begin-nav").classList.remove("dom-transformY-30");
        document.getElementById("nav-bottom").classList.add("dom-transformY-30");
        nav.startNav({
            routeData: toJS(this.props.navStore.navRoutes),
            map: this.props.mapStore.mapObj,
            onNav: (data) => {
                if (data.level && data.level != this.props.floorStore.mapFloor) {
                    this.props.floorStore.listenIbeacon(this.props.mapStore, data.level);
                }
                this.props.navStore.moveNavMarker(this.props.mapStore, [data.currentLon, data.currentLat], "navMarker");
                let navDatas = data.text ? data : {
                    ...data,
                    text: this.props.navStore.navRealData && this.props.navStore.navRealData.text
                };
                this.props.navStore.updateNavData(navDatas); // 更新导航数据
                this.props.mapStore.mapObj.flyTo({
                    center: [data.currentLon, data.currentLat],
                    zoom: data.isOutdoor == 0 ? 20 : 18,
                    speed: 1,
                    curve: 1.4,
                    bearing: data.bearing,
                    easing(t) {
                        return t;
                    }
                });
                if (data.voice) {
                    this.props.commonStore.baiduVoiceUrl(data.voice);
                }
            },
            complete: (data) => {
                console.log("完成", data);
                if (!data.isYaw) {
                    navTime = new Date().getTime() - navTime;
                    this.props.navStore.changeNavMode("free");
                    this.props.navStore.upDateNavCompleteRoute({
                        start: this.props.mapStore.startMarkerPoint,
                        end: this.props.mapStore.endMarkerPoint,
                        distance: data.distance,
                        navTime
                    });
                    this.props.commonStore.baiduVoiceUrl("到达目的地，感谢使用本次导航");
                    document.getElementById("nav-bottom")
                    && document.getElementById("nav-bottom").classList.remove("dom-transformY-30");
                    this.props.navStore.completeNav(this.props.mapStore);
                    this.props.navStore.moveFreeMarker(this.props.mapStore, data);
                    this.props.navStore.changeEvaluateStatus(true);
                } else {
                    this.props.navStore.updateRePlanStatus(true);
                    this.props.commonStore.baiduVoiceUrl("重新规划路径");
                    const startPoint = {
                        floor: data.level,
                        point: [data.longitude, data.latitude],
                        name: "当前位置"
                    };
                    setTimeout(() => {
                        this.props.mapStore.confirmMarker("start", startPoint);
                    }, 1500);
                }
            },
        });
    }

    exit() {
        this.props.mapStore.removeMarker("end");
        document.getElementById("begin-nav").classList.remove("dom-transformY-30");
        document.getElementsByClassName("map-routePanel")[0].classList.remove("dom-transformY-35");
        if (this.props.mapStore.startMarkerPoint) {
            this.props.mapStore.removeMarker("start");
        }
        if (this.props.navStore.navRoutes) {
            this.props.floorStore.updateRouteIndoor({});
            this.props.floorStore.checkMarkerAndRoute(this.props.mapStore, 0);
            this.props.navStore.getNavRoutes(null);
        }
    }

    render() {
        const {totalDistance, navTime, navRoutes} = this.props.navStore;
        // const {searchStatus} = this.props.commonStore;
        // console.log(searchStatus);
        return (
            <div className="begin-nav-container">
                <div>
                    <div className="map-goToShare begin-nav" id="begin-nav">
                        <div className="map-goToShare-head">
                            <div className="map-goToShare-head-swipe"></div>
                            <div className="map-goToShare-name">
                            <span className="map-goToShare-name-font nav-font">
                                {navRoutes ? `${handleDistance(totalDistance)} ${handleTime(navTime)}` : "请选择起点"}
                                </span>
                            </div>
                            <div className="begin-nav-exit" onClick={() => this.exit()}>
                                <span>退出</span>
                            </div>
                            <hr/>
                        </div>
                        <div className="map-goToShare-share begin-nav-box">
                            <button className={`${navRoutes ? "begin-nav-detail" : "begin-nav-gray-btn"}`}
                                    onClick={() => this.showDetail()}>
                                <i className="iconfont icon-xiangqing"></i>
                                <span> 路线详情</span>
                            </button>
                            <button className={`${navRoutes ? "begin-nav-sim" : "begin-nav-gray-btn"}`}
                                    onClick={() => this.simNav()}>
                                <i className="iconfont icon-monixianlupipei"></i>
                                <span> 模拟导航</span>
                            </button>
                            <button
                                className={`${navRoutes && !this.props.navStore.firstLocation
                                    ? "begin-nav-nav"
                                    : "begin-nav-gray-btn"}`}
                                id="beginNavBtn"
                                onClick={() => this.realNav()}>
                                <i className="iconfont icon-daohang1"></i>
                                <span> 开始导航</span>
                            </button>
                        </div>
                    </div>
                    <div className="nav-route-detail canBeScroll">
                        <div className="nav-route-detail-content canBeScroll">
                            <div className="nav-route-detail-head">
                                <span>{handleDistance(totalDistance)} {handleTime(navTime)}</span>
                            </div>
                            <ul className="canBeScroll">
                                {navRoutes && navRoutes.map((v, i) => this.renderList(v, i))}
                            </ul>
                            <div className="nav-route-detail-foot begin-nav">
                                <button className="begin-nav-detail" onClick={() => this.showMap()}>
                                    <i className="iconfont icon-fanhui"></i>
                                    <span> 查看地图</span>
                                </button>
                                <button className={`${navRoutes ? "begin-nav-sim" : "begin-nav-gray-btn"}`}
                                        onClick={() => this.simNav()}>
                                    <i className="iconfont icon-monixianlupipei"></i>
                                    <span> 模拟导航</span>
                                </button>
                                <button className={`${navRoutes && !this.props.navStore.firstLocation
                                    ? "begin-nav-nav"
                                    : "begin-nav-gray-btn"}`} onClick={() => this.realNav()}>
                                    <i className="iconfont icon-daohang1"></i>
                                    <span> 开始导航</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default beginNav;
