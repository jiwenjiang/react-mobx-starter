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
import {navStore} from "../navStore";
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
        // document.getElementById("begin-nav").classList.add("dom-transformY-30");
    }

    // 路径规划完毕之后处理函数
    listenRoutePlan() {
        this.routeObj.ri = {
            routeSuccess: () => {
                runInAction(() => {
                    commonStore.loadingStatus = false;
                });
                commonStore.baiduVoiceUrl("重新规划路径");
                this.routeObj.clearLocation();
                document.getElementById("map-goToShare").classList.remove("dom-transformY-30");
                document.getElementById("begin-nav").classList.add("dom-transformY-30");
            },
            routeError: () => {
                console.error("路径规划失败");
                runInAction(() => {
                    commonStore.loadingStatus = false;
                });
                this.routeObj.clearLocation();
            },
            setPathListView: (paths) => {
                // 处理路径数据
                this.routeHandle(paths);
                const floor = this.startMarkerPoint.floor;
                // 楼层切换
                this.changeFloor(floor);
                if (this.mapObj.getLayer("building-layer")) {
                    this.mapObj.removeLayer("building-layer");
                }
                if (this.mapObj.getSource("building-route")) {
                    this.mapObj.removeSource("building-route");
                }
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
        navStore.changeOriginPaths(paths);
        floorStore.routeIndoor = {};
        let totalDistance = 0;
        paths.forEach(v => {
            totalDistance += v.distance;
            const currentRoute = floorStore.routeIndoor[v.startFloor];
            if (currentRoute && currentRoute.features && currentRoute.features instanceof Array) {
                floorStore.routeIndoor[v.startFloor].features.push({
                    "type": "Feature",
                    "geometry": v.geometry
                });
            } else {
                floorStore.routeIndoor[v.startFloor] = {
                    "type": "FeatureCollection",
                    "features": []
                };
                floorStore.routeIndoor[v.startFloor].features.push({
                    "type": "Feature",
                    "geometry": v.geometry
                });
            }
        });
        navStore.recordDistance(totalDistance);
        navStore.getNavRoutes(paths);
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
                const markerData = {
                    point: point.geometry.coordinates,
                    floor: Number(point.floor),
                    name: feature[0]["properties"]["name"]
                };
                if (!this.confirmEndMarker) {
                    this.confirmMarker("end", markerData);
                } else {
                    this.confirmMarker("start", markerData, true);
                    this.confirmStartMarkerFn();
                }

            }
        }
    }

    @action
    confirmMarker(type, data, notPlan) {
        // if (data.floor || data.floor == 0) {
        const startMarkerHandle = () => {
            if (this.endMarkerPoint && this.endMarkerPoint.point.toString() == data.point.toString()) {
                commonStore.changeWarningModal("起点、终点不可相同");
                return false;
            }
            this.startMarkerPoint = data;
            if (this.startMarker) {
                this.startMarker.setLngLat(this.startMarkerPoint.point);
            } else {
                const el = this.generateDom(startImg);
                this.startMarker = new this.mapGL.Marker(el).setLngLat(this.startMarkerPoint.point).addTo(this.mapObj);
            }
        };
        const endMarkerHandle = () => {
            if (this.startMarkerPoint && this.startMarkerPoint.point.toString() == data.point.toString()) {
                commonStore.changeWarningModal("起点、终点不可相同");
                return false;
            }
            this.endMarkerPoint = data;
            if (this.endMarker) {
                this.endMarker.setLngLat(this.endMarkerPoint.point);
            } else {
                console.log(toJS(this.endMarkerPoint.point));
                const el = this.generateDom(endImg);
                this.endMarker = new this.mapGL.Marker(el).setLngLat(this.endMarkerPoint.point).addTo(this.mapObj);
            }
        };
        type === "start"
            ? startMarkerHandle()
            : endMarkerHandle();
        // 切换楼层
        data.floor && this.changeFloor(data.floor);
        this.mapObj.flyTo({
            center: data.point,
            zoom: 19,
            speed: 1,
            curve: 1,
            easing(t) {
                return t;
            }
        });
        this.checkNodePosition();
        // 如果存在起点，终点，则规划路径
        if (this.startMarkerPoint && this.endMarkerPoint && !notPlan) {
            this.planRoute();
        }
        // }
    }

    /**
     * @author j_bleach
     * @date 2018-10-11
     * @Description: 生成marker
     * @param src:String marker路径
     * @param className:String 样式名
     * @return HTMLElement
     */
    generateDom(src, classString) {
        let el = document.createElement("div");
        let img = document.createElement("img");
        img.src = src;
        img.style.width = "7.3vw";
        if (classString) {
            img.className = classString;
        }
        el.appendChild(img);
        return el;
    }

    changeFloor(floor) {
        // const floorNum = floor >= 0 ? floor + 1 : floor;
        floorStore.updateFloor(floor);
        this.mapObj.setLevel(floor);
        floorStore.checkMarkerAndRoute(this, floor);
    }

    checkNodePosition() {
        if (!this.confirmEndMarker) {
            const type = this.endMarker ? "add" : "remove";
            const classList = ["map-operators-location-box", "map-logo",
                "map-operators-scale", "map-operators-zoom-box", "map-operators-floor"];
            for (let v of classList) {
                document.getElementsByClassName(v) && document.getElementsByClassName(v)[0]
                && document.getElementsByClassName(v)[0].classList[type]("dom-transformY");
            }
            document.getElementById("map-goToShare").classList[type]("dom-transformY-30");
        }
    }

    @action
    removeMarker(type) {
        const endMarkerPoint = () => {
            this.endMarkerPoint = null;
            this.endMarker.remove();
            this.endMarker = null;
            this.confirmEndMarkerFn(false);
            this.checkNodePosition();
        };
        const startMarkerPoint = () => {
            this.startMarkerPoint = null;
            this.startMarker.remove();
            this.startMarker = null;
        };
        const markerFn = {
            "start": startMarkerPoint,
            "end": endMarkerPoint,
        }[type];
        markerFn();
    }

    @action
    confirmEndMarkerFn(v) {
        this.confirmEndMarker = v;
    }

    @action
    confirmStartMarkerFn() {
        if (!commonStore.warningModalStatus) {
            commonStore.confirmModalStatus = true;
        }
    }

    @action
    planRoute() {
        commonStore.loadingStatus = true;
        const [startLng, startLat] = toJS(this.startMarkerPoint).point;
        const [endLng, endLat] = toJS(this.endMarkerPoint).point;
        this.routeObj.roadType = navStore.navRoadType;
        this.routeObj.priorityType = navStore.navPriorityType;
        this.routeObj.setLocation({
            type: "Point",
            coordinates: [endLat, endLng, -1]
        }, "终点", this.endMarkerPoint.floor);
        this.routeObj.setLocation({
            type: "Point",
            coordinates: [startLat, startLng, -1]
        }, "起点", this.startMarkerPoint.floor);
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