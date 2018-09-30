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

    constructor() {
        this.mapFloor = 1;
        this.floorStatus = false;
        this.floorData = [];
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

}


const floorStore = new FloorStore();
autorun(() => {

});


export {floorStore};