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
import floor from "component/map/operators/floor";
import {floorStore} from "../../../mobx/stores/floorStore";


@inject("mapStore", "navStore", "floorStore", "commonStore")
@observer
class beginNav extends Component {

    componentDidMount() {
        // swipe dom
        const squareUp = document.querySelector(".begin-nav .map-goToShare-head");
        const squareDown = document.querySelector(".nav-route-detail-content");
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
            if (squareDown.scrollTop === 0) {
                document.getElementsByClassName("nav-route-detail")[0].classList.remove("dom-transformY-100vh");
            }
        });
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
                0: <li className="nav-route-detail-list" key={i}>
                    <i className="iconfont icon-qidian2" style={{color: "#00B4FF"}}></i>&emsp;
                    <span className="nav-route-text">
                        <span className="nav-route-firstText nav-route-thinText">从我的位置</span>
                        <span className="nav-route-secondText nav-route-boldText">{this.props.mapStore.startMarkerPoint
                        && this.props.mapStore.startMarkerPoint.name} 出发</span>
                    </span>
                </li>,
                1: <li className="nav-route-detail-list" key={i}>
                    <i className="iconfont icon-zhihang" style={{color: "#9B9B9B"}}></i>&emsp;
                    <span className="nav-route-text">
                    <span className="nav-route-firstText nav-route-boldText">直行</span>
                    <span className="nav-route-secondText nav-route-thinText">{Math.round(v.distance)}米</span>
                    </span>
                </li>,
                2: <li className="nav-route-detail-list" key={i}>
                    <i className="iconfont icon-zuozhuan" style={{color: "#9B9B9B"}}></i>&emsp;
                    <span className="nav-route-text">
                    <span className="nav-route-firstText nav-route-thinText">{Math.round(v.distance)}米后</span>
                    <span className="nav-route-secondText nav-route-boldText">左转</span>
                    </span>
                </li>,
                3: <li className="nav-route-detail-list" key={i}>
                    <i className="iconfont icon-youzhuan" style={{color: "#9B9B9B"}}></i>&emsp;
                    <span className="nav-route-text">
                    <span className="nav-route-firstText nav-route-thinText">{Math.round(v.distance)}米后</span>
                    <span className="nav-route-secondText nav-route-boldText">右转</span>
                    </span>
                </li>,
                5: <li className="nav-route-detail-list" key={i}>
                    <i className="iconfont icon-zhongdian2" style={{color: "#FF343E"}}></i>&emsp;
                    <span className="nav-route-text">
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
        this.props.navStore.changeNavMode("sim");
        this.props.navStore.freeMarker && this.props.navStore.removeFreeMarker();

        // 操作dom
        document.getElementsByClassName("map-routePanel")[0].classList.remove("dom-transformY-35");
        document.getElementById("begin-nav").classList.remove("dom-transformY-30");
        document.getElementById("nav-bottom").classList.add("dom-transformY-30");
        let changeFlag = true;
        const navTimer = setInterval(() => {
            changeFlag = true;
        }, 3000);
        let bearing = null;
        nav.startSim({
            routeData: toJS(this.props.navStore.navRoutes),
            speed: 5,
            onSimNav: (data) => {
                this.props.navStore.moveNavMarker(this.props.mapStore, [data.currentLon, data.currentLat], "simMarker");
                this.props.navStore.updateNavData(data);
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
                    this.props.floorStore.checkMarkerAndRoute(this.props.mapStore, data.level); // 终点，起点，路径检测
                }
                bearing = data.bearing;
            },
            complete: () => {
                document.getElementById("nav-bottom").classList.remove("dom-transformY-30");
                this.props.navStore.completeNav(this.props.mapStore);
                clearInterval(navTimer);
            }
        });
    }

    realNav() {
        this.props.navStore.changeNavMode("real");
        this.props.navStore.freeMarker && this.props.navStore.removeFreeMarker();
        const startPoint = toJS(this.props.floorStore.routeIndoorBeizer[this.props.floorStore.mapFloor])
            .geometry.coordinates[0];
        // console.log(startPoint);
        // console.log(toJS(this.props.navStore.navRoutes));
        this.props.navStore.moveNavMarker(this.props.mapStore, startPoint, "navMarker");
        // 操作dom
        document.getElementsByClassName("map-routePanel")[0].classList.remove("dom-transformY-35");
        document.getElementById("begin-nav").classList.remove("dom-transformY-30");
        document.getElementById("nav-bottom").classList.add("dom-transformY-30");
        nav.startNav({
            routeData: toJS(this.props.navStore.navRoutes),
            map: this.props.mapStore.mapObj,
            onNav: (data) => {
                // console.log("导航data", data);
                this.props.navStore.moveNavMarker(this.props.mapStore, [data.currentLon, data.currentLat], "navMarker");
                this.props.navStore.updateNavData(data); // 更新导航数据
            },
            complete: (data) => {
                document.getElementById("nav-bottom").classList.remove("dom-transformY-30");
                this.props.navStore.completeNav(this.props.mapStore);
                this.props.navStore.moveFreeMarker(this.props.mapStore, data);
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
        const {searchStatus} = this.props.commonStore;
        return (
            <div className="begin-nav-container">
                <div className="map-goToShare begin-nav" id="begin-nav">
                    <div className="map-goToShare-head">
                        <div className="map-goToShare-head-swipe"></div>
                        <div className="map-goToShare-name">
                            <span className="map-goToShare-name-font nav-font">
                                {navRoutes ? `${totalDistance}米 ${navTime}秒` : "请选择起点"}
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
                        <button className={`${navRoutes ? "begin-nav-nav" : "begin-nav-gray-btn"}`}
                                onClick={() => this.realNav()}>
                            <i className="iconfont icon-daohang1"></i>
                            <span> 开始导航</span>
                        </button>
                    </div>
                </div>
                {
                    !searchStatus && <div className="nav-route-detail">
                        <div className="nav-route-detail-content canBeScroll">
                            <div className="nav-route-detail-head">
                                <span>{totalDistance}米 {navTime}秒</span>
                            </div>
                            <ul className="nav-route-detail-body">
                                {navRoutes && navRoutes.map((v, i) => this.renderList(v, i))}
                            </ul>
                            <div className="nav-route-detail-foot begin-nav">
                                <button className="begin-nav-detail" onClick={() => this.showMap()}>
                                    <i className="iconfont icon-fanhui"></i>
                                    <span> 查看地图</span>
                                </button>
                                <button className="begin-nav-sim" onClick={() => this.simNav()}>
                                    <i className="iconfont icon-monixianlupipei"></i>
                                    <span> 模拟导航</span>
                                </button>
                                <button className="begin-nav-nav" onClick={() => this.realNav()}>
                                    <i className="iconfont icon-daohang1"></i>
                                    <span> 开始导航</span>
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default beginNav;