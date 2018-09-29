/**
 * Created by j_bleach on 2018/9/20 0020.
 */
import {observable, action, autorun, computed, configure, runInAction} from "mobx";
import http from "services/http";
import normalUrl from "config/url/normal";
import {commonStore} from "../commonStore";


configure({
    enforceActions: "observed"
});

class MapStore {
    @observable mapId; // 地图ID
    @observable carouselData; // 跑马灯数据
    @observable accordionData; // 手风琴数据
    @observable mapObj; // map 对象
    @observable mapFloor; // 当前地图楼层

    constructor() {
        this.mapId = 2;
        this.carouselData = [];
        this.accordionData = [];
        this.mapObj = null;
        this.mapFloor = 1;
    }

    // 更新mapId
    @action
    async updateMapId(mapId) {
        this.mapId = mapId;
        try {
            const dynamicParams = await http.post(normalUrl.dynamicParams, {mapId});
            runInAction(() => {
                this.mapNavParams = {...this.mapNavParams, ...dynamicParams};
            });
        } catch (e) {
            throw e;
        }
    }

    // 获取服务搜索数据
    @action
    async getMapServices(mapId) {
        try {
            commonStore.loadingStatus = true;
            const mapServices = await http.post(normalUrl.mapService, {mapId});
            runInAction(() => {
                const carouselData = []; // 走马灯数据
                const accordionData = []; // 手风琴数据
                mapServices && mapServices.forEach(v => {
                    if (v.serviceType === 1) {
                        carouselData.push(v);
                    }
                    if (v.serviceType === 2) {
                        accordionData.push(v);
                    }
                });
                commonStore.loadingStatus = false;
                this.carouselData = carouselData;
                this.accordionData = accordionData;
            });
        } catch (e) {
            throw e;
        }
    }

    // 获取地图对象
    @action
    saveMapObj(obj) {
        this.mapObj = obj;
    }

    // 更新当前楼层
    @action
    updateFloor(floor) {
        this.mapFloor = floor;
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