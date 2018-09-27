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
    @observable carouselData;
    @observable accordionData;

    constructor() {
        this.mapId = 1;
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
        this.carouselData = [];
        this.accordionData = [];
    }

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

    @action updateParams(v) {
        this.mapNavParams = {...this.mapNavParams, ...v};
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