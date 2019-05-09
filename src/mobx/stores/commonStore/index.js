/**
 * Created by j_bleach on 2018/9/26 0026.
 */
import {observable, action, configure} from "mobx";


configure({
    enforceActions: "observed"
});

class CommonStore {
    @observable loadingStatus; // loading 状态显示
    @observable routeMsg; // routeMsg
    @observable mapObj; // 地图对象
    @observable mapGl; // 地图sdk

    constructor() {
        this.loadingStatus = false;
        this.routeMsg = {
            iframeUrl: "",
            title: ""
        };
        this.mapObj = {};
        this.mapGl = {};
    }

    // 等待动画
    @action
    changeLoadingStatus(status) {
        this.loadingStatus = status;
    }

    @action
    saveMap(map) {
        this.mapObj = map;
    }

    @action
    savMapGl(gl) {
        this.mapGl = gl;
    }

    @action
    updateRouteMsg(msg) {
        this.routeMsg = msg;
    }
}


const commonStore = new CommonStore();


export {commonStore};
