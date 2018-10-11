/**
 * Created by j_bleach on 2018/9/30 0030.
 */
import {observable, action, autorun, configure} from "mobx";
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
    @observable endRouteIndoor; // 室内终点路径

    constructor() {
        this.mapFloor = 1;
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
    }

    // 更新当前楼层
    @action
    updateFloor(floor) {
        this.mapFloor = floor;
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
        console.log("floor", floor);
        if (endMarkerPoint) {
            if (endMarkerPoint.floor === floor) {
                endMarker.setLngLat(endMarkerPoint.point);
            } else {
                endMarker.setLngLat([0, 0]);
            }
        }
        if (startMarkerPoint) {
            if (startMarkerPoint.floor === floor) {
                startMarker.setLngLat(startMarkerPoint.point);
            } else {
                startMarker.setLngLat([0, 0]);
            }
        }
        // 路径规划 跨楼层判断
        if (map.mapObj.getLayer("building-layer")) {
            console.log("indoor", floorStore.routeIndoor);
            const geoData = floorStore.routeIndoor[floor] ? floorStore.routeIndoor[floor] : {
                type: "FeatureCollection",
                features: []
            };
            map.mapObj.getSource("building-route").setData(geoData);
        }
    }
}


const floorStore = new FloorStore();
autorun(() => {

});


export {floorStore};