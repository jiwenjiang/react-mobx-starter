/**
 * Created by j_bleach on 2018/9/20 0020.
 */
import {observable, action, autorun, computed, configure, runInAction} from "mobx";
import http from "services/http";
import normalUrl from "config/url/normal";

configure({
    enforceActions: "observed"
});

class MapStore {
    @observable mapId; // 地图ID
    @observable mapNavParams; // 地图导航参数

    constructor() {
        this.mapId = 3;
        this.mapNavParams = {};
    }

    @action
    async updateMapId(mapId) {
        this.mapId = mapId;
        try {
            const dynamicParams = await http.post(normalUrl.dynamicParams, {mapId});
            runInAction(() => {
                this.mapNavParams = dynamicParams;
            });
        } catch (e) {
            throw e;
        }
    }

    @action updateParams(v) {
        this.mapNavParams = v;
    }

    @computed get func() {
        return this.mapId * 10;
    }
}


const mapStore = new MapStore();
autorun(() => {
    // console.log("test:", mapStore.mapId);
    // console.log("test2:", mapStore.mapNavParams);
});


export {mapStore};