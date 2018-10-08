/**
 * Created by j_bleach on 2018/9/20 0020.
 */
/*eslint-disable*/
import {action, autorun, computed, configure, observable, runInAction} from "mobx";
import {polygon, centerOfMass} from "@turf/turf";
import http from "services/http";
import normalUrl from "config/url/normal";
import {commonStore} from "../commonStore";
// import {start} from "component/map/marker";
import startImg from "assets/img/start.png";
import endImg from "assets/img/end.png";
import "./index.less";

configure({
    enforceActions: "observed"
});

class MapStore {
    @observable mapId; // 地图ID
    @observable carouselData; // 跑马灯数据
    @observable accordionData; // 手风琴数据
    @observable mapObj; // map 对象
    @observable mapGL; // map sdk
    @observable endMarker; // 结束marker
    @observable endMarkerPoint; // 结束marker坐标点
    @observable confirmEndMarker; // 确定终点标记

    constructor() {
        this.mapId = 2;
        this.carouselData = [];
        this.accordionData = [];
        this.mapObj = null;
        this.mapGL = null;
        this.endMarker = null;
        this.endMarkerPoint = null;
        this.confirmEndMarker = false;
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
    saveMapObj(obj, mapGL) {
        this.mapObj = obj;
        this.mapGL = mapGL;
    }

    // 更新当前楼层
    @action
    updateFloor(floor) {
        this.mapFloor = floor;
    }

    // 地图点击处理
    @action
    handleMarker(e) {
        // if (!this.confirmEndMarker && this.endMarker) {
        //     this.endMarker.remove();
        //     console.log(this.endMarker)
        // }
        let feature = this.mapObj.queryRenderedFeatures(e.point);
        console.log(feature);
        if (feature && feature[0] && "layer" in feature[0] && "properties" in feature[0]) {
            if (feature[0]["properties"]["name"]) {
                let polygonGeojson = feature[0].geometry.coordinates;
                let point;
                if (polygonGeojson[0] instanceof Array) {
                    let polygonPoints = polygon(polygonGeojson);
                    point = centerOfMass(polygonPoints);
                    point.floor = feature[0].properties.level;
                } else {
                    point = {
                        geometry: {
                            coordinates: [polygonGeojson[0], polygonGeojson[1]],
                            type: "Point"
                        },
                        floor: feature[0].properties.level
                    };
                }
                if (!this.confirmEndMarker) {
                    this.endMarkerPoint = {
                        point: point.geometry.coordinates,
                        floor: Number(point.floor) + 1,
                        name: feature[0]["properties"]["name"]
                    }; // marker 终点坐标
                    if (this.endMarker) {
                        console.log("marker 存在");
                        this.endMarker.setLngLat(this.endMarkerPoint.point);
                    } else {
                        console.log("first marker");
                        let el = document.createElement("div");
                        let img = document.createElement("img");
                        img.src = endImg;
                        img.style.width = "7.3vw";
                        el.appendChild(img);
                        this.endMarker = new this.mapGL.Marker(el).setLngLat(this.endMarkerPoint.point).addTo(this.mapObj);
                    }
                } else {
                    this.startMarker = new this.mapGL.Marker(el).setLngLat(this.endMarkerPoint.point).addTo(this.mapObj);
                }
                // this.confirmEndMarker = true;
                this.mapObj.flyTo({
                    center: point.geometry.coordinates,
                    zoom: 19,
                    speed: 1,
                    curve: 1,
                    easing(t) {
                        return t;
                    }
                });
                this.checkNodePosition();
            }
        }
    }

    checkNodePosition() {
        if (!this.confirmEndMarker && this.endMarker) {
            const classList = ["map-operators-location-box", "map-logo",
                "map-operators-scale", "map-operators-zoom-box", "map-operators-floor"];
            for (let v of classList) {
                console.log(document.getElementsByClassName(v)[0]);
                document.getElementsByClassName(v)[0].classList.add("dom-transformY");
            }
            document.getElementsByClassName("map-goToShare")[0].classList.add("dom-transformY-30");
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