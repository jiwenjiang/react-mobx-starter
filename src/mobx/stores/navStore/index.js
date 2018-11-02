/**
 * Created by j_bleach on 2018/9/20 0020.
 */
import {observable, action} from "mobx";
import locateHalfImg from "assets/img/locate-half.png";
import locateImg from "assets/img/locate.png";
import navImg from "assets/img/nav.png";
import {floorStore} from "../floorStore";
import {toJS} from "mobx";

class NavStore {
    /**
     * @author j_bleach
     * @date 2018-09-27
     * @Description: mapNavParams 接口
     * @param name:timeThrottle 节流时间
     * @param name:ibeaconLoc 蓝牙点导航线与导航线距离
     * @param name:fiducialLoc 置信点与蓝牙点距离小于3
     * @param name:inertiaIbeacon 当前点与蓝牙点距离大于2
     * @param name:inertiaFiducial 当前点与置信点距离10
     * @param name:inertiaIbea 当前点与蓝牙点距离大于5
     * @param name:centroidNav 质心点与导航线距离
     * @param name:inertiaFidu 当前点与质心点距离大于5
     * @param name:inertiaFidumin 当前点与质心点距离小于10
     * @param name:inertiaFidumax 当前点与质心点距离大于10
     */
    @observable mapNavParams; // 地图导航参数
    @observable locateCoordinate; // 定位坐标(搜索用)
    @observable totalDistance; // 导航总距离
    @observable navTime; // 导航总距离
    @observable navRoutes; // 原始导航路径
    @observable navRoadType; // 导航方式 foot/car
    @observable navPriorityType; // 跨楼层方式 elevator/stairs
    @observable freeMarker; // 自由模式marker
    @observable navMarker; // 导航模式marker
    @observable freeMarkerPoint; // 自由模式marker 坐标点
    @observable navMarkerPoint; // 导航模式marker 坐标点
    @observable firstLocation; // 首次定位
    @observable navMode; // 导航模式 free 自由 、sim 模拟 、real 实时
    @observable navRealData; // 导航实时数据
    @observable initLocation; // 初始化定位
    @observable evaluateStatus; // 评价模型显示
    @observable navCompleteRoute; // 结束导航数据
    @observable currentLocation; // 当前定位

    constructor() {
        this.mapNavParams = {
            timeThrottle: 5000,
            ibeaconLoc: 10,
            fiducialLoc: 3,
            inertiaIbeacon: 2,
            inertiaFiducial: 10,
            inertiaIbea: 5,
            centroidNav: 10,
            inertiaFidu: 5,
            inertiaFidumin: 10,
            inertiaFidumax: 10
        };
        this.locateCoordinate = "104.060763,30.597849";
        this.totalDistance = null;
        this.speed = 1.5; // 每秒1.5米
        this.navTime = 0; // 导航时间
        this.navRoutes = null;
        this.navRoadType = "foot";
        this.navPriorityType = "elevator";
        this.freeMarker = null;
        this.navMarker = null;
        this.navMarkerPoint = null;
        this.firstLocation = true;
        this.navMode = "free";
        this.navRealData = null;
        this.initLocation = false;
        this.evaluateStatus = false;
        this.navCompleteRoute = {};
        this.currentLocation = null;
    }

    // 更新当前定位点
    @action updateLocateCoordinate = (value) => {
        this.locateCoordinate = value;
    };

    // 更新导航模式
    @action changeNavMode = (mode) => {
        this.navMode = mode;
    };

    @action updateInitLocation(v) {
        this.initLocation = v;
    }

    // 更新导航参数
    @action updateParams(v) {
        this.mapNavParams = {...this.mapNavParams, ...v};
    }

    @action recordDistance(v) {
        this.totalDistance = ~~v;
        this.navTime = ~~(this.totalDistance / this.speed);
    }

    // 更新原始路径
    @action getNavRoutes(v) {
        this.navRoutes = v;
    }

    @action changeRoadType(v) {
        this.navRoadType = v;
    }

    @action changePriorityType(v) {
        this.navPriorityType = v;
    }

    @action initFreeMarker(map, data) {
        this.changeFirstLocation(false);
        if (data.locType === "gps") {
            if (data.accuracy <= 10) {
                this.freeMarkerPoint = {
                    point: [data.longitude, data.latitude],
                    floor: 0,
                    name: "当前位置"
                };
            } else {
                this.changeFirstLocation(true);
                return false;
            }
        }
        if (data.locType === "ibeacon") {
            this.freeMarkerPoint = {
                point: [data.longitude, data.latitude],
                floor: data.level,
                name: "当前位置"
            };
        }
        if (this.freeMarker) {
            this.freeMarker.setLngLat(this.freeMarkerPoint.point);
        } else {
            const imgSrc = data.locType === "gps"
                ? locateImg
                : floorStore.mapFloor == this.freeMarkerPoint.floor
                    ? locateImg : locateHalfImg;
            const el = map.generateDom(imgSrc, "freeMarker");
            this.freeMarker = new map.mapGL.Marker(el).setLngLat(this.freeMarkerPoint.point).addTo(map.mapObj);
        }
    }

    /**
     * @author j_bleach
     * @date 2018-10-25
     * @Description: 跨楼层切换marker样式
     * @param map:mapobj
     */
    @action checkFreeMarker(map) {
        this.freeMarker.remove();
        this.freeMarker = null;
        const imgSrc = floorStore.mapFloor == this.freeMarkerPoint.floor ? locateImg : locateHalfImg;
        const el = map.generateDom(imgSrc, "freeMarker");
        this.freeMarker = new map.mapGL.Marker(el).setLngLat(this.freeMarkerPoint.point).addTo(map.mapObj);
    }

    @action moveFreeMarker(map, data) {
        if (this.navMode === "free") {
            this.freeMarkerPoint = {
                point: [data.longitude, data.latitude],
                floor: data.level,
                name: "当前位置"
            };

            if (this.freeMarker) {
                this.freeMarker.setLngLat(toJS(this.freeMarkerPoint.point));
            } else {
                const imgSrc = data.locType === "gps"
                    ? locateImg
                    : floorStore.mapFloor == this.freeMarkerPoint.floor
                        ? locateImg : locateHalfImg;
                const el = map.generateDom(imgSrc, "freeMarker");
                this.freeMarker = new map.mapGL.Marker(el).setLngLat(this.freeMarkerPoint.point).addTo(map.mapObj);
            }
        }
    }

    @action moveNavMarker(map, data, name) {
        if (this.navMode !== "free") {
            if (this.navMarker) {
                this.navMarker.setLngLat(data);
            } else {
                const el = map.generateDom(navImg, name, "10vw");
                this.navMarker = new map.mapGL.Marker(el).setLngLat(data).addTo(map.mapObj);
            }
        }
    }

    @action changeFirstLocation(status) {
        this.firstLocation = status;
    }

    @action removeFreeMarker() {
        this.freeMarker.remove();
        this.freeMarker = null;
    }

    @action removeNavMarker() {
        this.navMarker.remove();
        this.navMarker = null;
        this.navMarkerPoint = null;
    }

    orientateMarker(angle, map) {
        if (this.freeMarker) {
            let freeMarker = document.getElementsByClassName("freeMarker")[0];
            freeMarker.style.transformOrigin = "50% 50%";
            freeMarker.style.transform = "rotate(" + (angle + map.transform.angle * (180 / Math.PI)) + "deg)";
        }
        if (this.navMarker) {
            let navMarker = document.getElementsByClassName("navMarker")[0];
            if (navMarker) {
                navMarker.style.transformOrigin = "50% 50%";
                navMarker.style.transform = "rotate(" + (angle + map.transform.angle * (180 / Math.PI)) + "deg)";
            }
        }
    }

    @action updateNavData(data) {
        this.navRealData = data;
    }

    // 导航完成(清楚marker,导航线)
    @action completeNav(map) {
        this.changeNavMode("free");
        this.removeNavMarker();
        map.removeMarker("start");
        map.removeMarker("end");
        map.mapObj.resetNorth();
        floorStore.updateRouteIndoor({});
        floorStore.checkMarkerAndRoute(map, 0);
        this.getNavRoutes(null);
    }

    @action upDateNavCompleteRoute(v) {
        this.navCompleteRoute = v;
    }

    @action changeEvaluateStatus(v) {
        this.evaluateStatus = v;
    }

    @action updateCurrentLocation(v) {
        this.currentLocation = v;
    }
}


const navStore = new NavStore();

export {navStore};