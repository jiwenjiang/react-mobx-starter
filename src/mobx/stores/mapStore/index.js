/**
 * Created by j_bleach on 2018/9/20 0020.
 */
/*eslint-disable*/
import {action, autorun, computed, configure, observable, runInAction} from "mobx";
import {polygon, centerOfMass} from "@turf/turf";
import http from "services/http";
import normalUrl from "config/url/normal";
import {commonStore} from "../commonStore";
import {floorStore} from "../floorStore";
// import {start} from "component/map/marker";
import {toJS} from "mobx";
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
    @observable routeObj; // map 路径规划对象
    @observable startMarker; // 开始marker 对象（mapbox sdk）
    @observable endMarker; // 结束marker 对象（mapbox sdk）
    @observable startMarkerPoint; // 开始marker坐标点
    @observable endMarkerPoint; // 结束marker坐标点
    @observable confirmEndMarker; // 确定终点标记

    constructor() {
        this.mapId = 2;
        this.carouselData = [];
        this.accordionData = [];
        this.mapObj = null;
        this.mapGL = null;
        this.routeObj = null;
        this.startMarker = null;
        this.endMarker = null;
        this.startMarkerPoint = null;
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
    saveMapObj(map, mapGL, route) {
        this.mapObj = map;
        this.mapGL = mapGL;
        this.routeObj = route;
        this.listenRoutePlan();
    }

    listenRoutePlan() {
        this.routeObj.ri = {
            routeSuccess: () => {
                runInAction(() => {
                    commonStore.loadingStatus = false;
                });
                console.info("路径规划成功");
                this.routeObj.clearLocation();
            },
            routeError: () => {
                console.error("路径规划失败");
                this.routeObj.clearLocation();
            },
            setPathListView: (paths) => {
                this.routeHandle(paths);
                const floorNum = this.startMarkerPoint.floor;
                floorStore.updateFloor(floorNum);
                const floor = floorNum - 1;
                this.mapObj.setLevel(floor);
                if (this.mapObj.getSource("building-route")) {
                    this.mapObj.removeSource("building-route");
                }
                if (this.mapObj.getLayer("building-layer")) {
                    this.mapObj.removeLayer("building-layer");
                }
                console.log("test", toJS(floorStore.routeIndoor[floor]));
                this.mapObj.addSource("building-route", {
                    type: "geojson",
                    data: toJS(floorStore.routeIndoor[floor])
                });

                this.mapObj.addLayer({
                    type: "line",
                    source: "building-route",
                    id: "building-layer",
                    layout: {
                        "line-join": "round", //连接时显示的线
                        "line-cap": "round" //导航线尾部
                    },
                    paint: {
                        "line-pattern": "location3",
                        "line-width": {
                            base: 10,
                            stops: [
                                [18, 6],
                                [22, 16]
                            ]
                        }
                    }
                });
            },
        };
    }

    /**
     * @author j_bleach
     * @date 2018-10-10
     * @Description: 路径处理函数
     * @param paths:array 路径数组
     */
    routeHandle(paths) {
        paths.forEach(v => {
            const currentRoute = floorStore.routeIndoor[v.endFloor];
            if (currentRoute && currentRoute.features && currentRoute.features instanceof Array) {
                floorStore.routeIndoor[v.endFloor].features.push({
                    "type": "Feature",
                    "geometry": v.geometry
                });
            } else {
                floorStore.routeIndoor[v.endFloor] = {
                    "type": "FeatureCollection",
                    "features": []
                };
                floorStore.routeIndoor[v.endFloor].features.push({
                    "type": "Feature",
                    "geometry": v.geometry
                });
            }
        });
    }

    // 地图点击处理
    @action
    handleMarker(e) {
        let feature = this.mapObj.queryRenderedFeatures(e.point);
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
                        console.log("end marker 存在");
                        this.endMarker.setLngLat(this.endMarkerPoint.point);
                    } else {
                        console.log("first end marker");
                        let el = document.createElement("div");
                        let img = document.createElement("img");
                        img.src = endImg;
                        img.style.width = "7.3vw";
                        el.appendChild(img);
                        this.endMarker = new this.mapGL.Marker(el).setLngLat(this.endMarkerPoint.point).addTo(this.mapObj);
                    }
                } else {
                    this.startMarkerPoint = {
                        point: point.geometry.coordinates,
                        floor: Number(point.floor) + 1,
                        name: feature[0]["properties"]["name"]
                    }; // marker 终点坐标
                    if (this.startMarker) {
                        console.log("start marker 存在");
                        this.startMarker.setLngLat(this.startMarkerPoint.point);
                    } else {
                        console.log("first start marker");
                        let el = document.createElement("div");
                        let img = document.createElement("img");
                        img.src = startImg;
                        img.style.width = "7.3vw";
                        el.appendChild(img);
                        this.startMarker = new this.mapGL.Marker(el).setLngLat(this.startMarkerPoint.point).addTo(this.mapObj);
                        this.confirmStartMarkerFn();
                    }
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
                document.getElementsByClassName(v)[0].classList.add("dom-transformY");
            }
            document.getElementsByClassName("map-goToShare")[0].classList.add("dom-transformY-30");
        }
    }

    @action
    confirmEndMarkerFn(v) {
        this.confirmEndMarker = v;
    }

    @action
    confirmStartMarkerFn() {
        commonStore.confirmModalStatus = true;
    }

    @action
    planRoute() {
        commonStore.loadingStatus = true;
        const [startLng, startLat] = toJS(this.startMarkerPoint).point;
        const [endLng, endLat] = toJS(this.endMarkerPoint).point;
        this.routeObj.setLocation({
            type: "Point",
            coordinates: [startLat, startLng, -1]
        }, "起点", this.startMarkerPoint.floor - 1);
        this.routeObj.setLocation({
            type: "Point",
            coordinates: [endLat, endLng, -1]
        }, "终点", this.endMarkerPoint.floor - 1);
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