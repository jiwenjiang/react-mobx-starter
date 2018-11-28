/**
 * Created by j_bleach on 2018/9/30 0030.
 */
/*eslint-disable*/
import {observable, action, autorun, configure, toJS} from "mobx";
import {bezierV2} from "services/utils/bezier";
// import http from "services/http";
// import normalUrl from "config/url/normal";
// import {commonStore} from "../commonStore";

configure({
    enforceActions: "observed"
});

class FloorStore {
    @observable mapFloor; // 当前地图楼层
    @observable floorStatus; // 是否显示楼层（是否为室内）
    @observable floorData; // 楼层数据
    @observable routeIndoor; // 室内路径
    @observable routeIndoorBezier; // 室内路径

    constructor() {
        this.mapFloor = 0;
        this.floorStatus = false;
        this.floorData = [];
        /**
         * @author j_bleach
         * @date 2018-10-10
         * @Description: 室内导航路径
         * @demo:
         * let routeIndoor = {
             [floor]:{
                 "type": "FeatureCollection",
                 "features": []
             }
         };
         */
        this.routeIndoor = {};
        this.routeIndoorBezier = {};
    }

    // 更新当前楼层
    @action
    updateFloor(floor) {
        this.mapFloor = floor && Number(floor);
    }

    // 更改楼层显示状态
    @action
    changeFloorStatus(event) {
        this.floorStatus = event.newState === 1 ? true : false;
    }

    checkMarkerAndRoute(map, floor) {
        // marker 跨楼层判断
        const endMarkerPoint = map.endMarkerPoint;
        const startMarkerPoint = map.startMarkerPoint;
        const endMarker = map.endMarker;
        const startMarker = map.startMarker;
        if (endMarkerPoint) {
            if (endMarkerPoint.floor == floor) {
                endMarker.setLngLat(endMarkerPoint.point);
            } else {
                endMarker.setLngLat([0, 0]);
            }
        }
        if (startMarkerPoint) {
            if (startMarkerPoint.floor == floor) {
                startMarker.setLngLat(startMarkerPoint.point);
            } else {
                startMarker.setLngLat([0, 0]);
            }
        }
        // 路径规划 跨楼层判断

        if (map.mapObj.getLayer("building-layer")) {
            const routeIndoor = floorStore.routeIndoor[floor]
                && floorStore.routeIndoor[floor].features
                && floorStore.routeIndoor[floor].features.filter(v => v.geometry.type !== "Point");
            const geoData = routeIndoor && routeIndoor.length > 0
                ? bezierV2(toJS(routeIndoor), map.mapObj)
                : {
                    type: "FeatureCollection",
                    features: []
                };
            map.mapObj.getSource("building-route").setData(geoData);
        }
    }

    @action
    updateRouteIndoor(v) {
        this.routeIndoor = v;
    }

    /**
     * @author j_bleach
     * @date 2018-10-18
     * @Description: 根据蓝牙点切换楼层
     * @param map:地图对象
     * @param floor:楼层
     */
    @action
    listenIbeacon(map, floor) {
        // const floorNum = floor >= 0 ? Number(floor) + 1 : floor;
        this.updateFloor(floor);
        map.mapObj.setLevel(floor);
        this.checkMarkerAndRoute(map, floor);
    }
}


const floorStore = new FloorStore();
autorun(() => {

});


export {floorStore};
