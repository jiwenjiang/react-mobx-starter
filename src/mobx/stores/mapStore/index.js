/**
 * Created by j_bleach on 2018/9/20 0020.
 */
/*eslint-disable*/
import {action, autorun, computed, configure, observable, runInAction} from "mobx";
import http from "services/http";
import normalUrl from "config/url/normal";
import {commonStore} from "../commonStore";
// import {start} from "component/map/marker";
import start from "assets/img/start.png";
import "./index.less";

configure({
    enforceActions: "observed"
});

class MapStore {
    @observable mapId; // 地图ID
    @observable carouselData; // 跑马灯数据
    @observable accordionData; // 手风琴数据
    @observable mapObj; // map 对象

    constructor() {
        this.mapId = 2;
        this.carouselData = [];
        this.accordionData = [];
        this.mapObj = null;
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

    // marker处理
    handleMarker(mapgl, e, map) {
        // TODO 找中点
        let feature = map.queryRenderedFeatures(e.point);
        console.log(feature);
        if (feature && feature[0] && "layer" in feature[0] && "properties" in feature[0]) {
            if (feature[0]["properties"]["name"]) {
                let polygonGeojson = feature[0].geometry.coordinates;
                let point;
                if (polygonGeojson[0] instanceof Array) {
                    let polygon = turf.polygon(polygonGeojson);
                    point = turf.centerOfMass(polygon);
                } else {
                    point = {
                        geometry: {
                            coordinates: [polygonGeojson[0], polygonGeojson[1]],
                            type: "Point"
                        },
                        floor: feature.properties.level
                    };
                }
                let el = document.createElement("div");
                let img = document.createElement("img");
                img.src = start;
                img.style.width = "7.3vw";
                el.appendChild(img);
                this.startMarker = new mapgl.Marker(el).setLngLat(feature[0].geometry.coordinates).addTo(map);
            }
        }
    }

    @computed get func() {
        return this.mapId * 10;
    }
}


const mapStore = new MapStore();
autorun(() => {
    // console.log(this.mapId);
});


export {mapStore};