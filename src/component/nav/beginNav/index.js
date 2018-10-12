/**
 * Created by j_bleach on 2018/10/11 0011.
 */

import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import Hammer from "hammerjs";
import "./index.less";


@inject("mapStore", "navStore", "floorStore")
@observer
class beginNav extends Component {

    componentDidMount() {
        document.addEventListener("touchmove", (event) => {
            event.preventDefault();
        }, false);
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
            document.getElementsByClassName("nav-route-detail")[0].classList.add("dom-transformY-100vh");
        });
        managerDown.on("swipedown", () => {
            if (squareDown.scrollTop === 0) {
                document.getElementsByClassName("nav-route-detail")[0].classList.remove("dom-transformY-100vh");
            }
        });
    }

    showDetail() {
        document.getElementsByClassName("nav-route-detail")[0].classList.add("dom-transformY-100vh");
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
        }
    }

    render() {
        const {totalDistance, navTime, navRoutes} = this.props.navStore;
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
                                onClick={() => this.goToHere()}>
                            <i className="iconfont icon-monixianlupipei"></i>
                            <span> 模拟导航</span>
                        </button>
                        <button className={`${navRoutes ? "begin-nav-nav" : "begin-nav-gray-btn"}`}
                                onClick={() => this.goToHere()}>
                            <i className="iconfont icon-daohang1"></i>
                            <span> 开始导航</span>
                        </button>
                    </div>
                </div>
                <div className="nav-route-detail">
                    <div className="nav-route-detail-content">
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
                            <button className="begin-nav-sim" onClick={() => this.goToHere()}>
                                <i className="iconfont icon-monixianlupipei"></i>
                                <span> 模拟导航</span>
                            </button>
                            <button className="begin-nav-nav" onClick={() => this.goToHere()}>
                                <i className="iconfont icon-daohang1"></i>
                                <span> 开始导航</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default beginNav;