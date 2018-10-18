/**
 * Created by j_bleach on 2018/9/20 0020.
 */
import {observable, action} from "mobx";

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
    @observable locateCoordinate; // 定位坐标
    @observable totalDistance; // 导航总距离
    @observable navTime; // 导航总距离
    @observable navRoutes; // 导航路径
    @observable navRoadType; // 导航方式 foot/car
    @observable navPriorityType; // 跨楼层方式 elevator/stairs
    @observable freeMarker; // 自由模式marker
    @observable freeMarkerPoint; // 自由模式marker 坐标点

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
        this.freeMarkerPoint = null;
    }

    @action updateLocateCoordinate = (value) => {
        this.locateCoordinate = value;
    };

    // 更新导航参数
    @action updateParams(v) {
        this.mapNavParams = {...this.mapNavParams, ...v};
    }

    @action recordDistance(v) {
        this.totalDistance = ~~v;
        this.navTime = ~~(this.totalDistance / this.speed);
    }

    @action getNavRoutes(v) {
        this.navRoutes = v;
    }

    @action changeRoadType(v) {
        this.navRoadType = v;
    }

    @action changePriorityType(v) {
        this.navPriorityType = v;
    }
}


const navStore = new NavStore();

export {navStore};