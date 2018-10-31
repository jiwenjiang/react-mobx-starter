/**
 * Created by j_bleach on 2018/10/24 0024.
 */
/*eslint-disable*/
import {point, distance, midpoint, lineString, length, along, bearing, destination} from "@turf/turf";

/**
 * @author j_bleach
 * @date 2018-10-24
 * @Description: 计算两点间距离
 * @param from:[]
 * @param to:[]
 * @return result:number
 */
const calcDistanceFn = (from, to) => {
    const start = point(from);
    const end = point(to);
    const result = (distance(start, end) * 1000);
    return result;
};
/**
 * @author j_bleach
 * @date 2018-10-24
 * @Description: 计算中点
 * @param point1:object
 * @param point2:object
 */
const calcMidPoint = (point1, point2) => {
    return midpoint(point(point1), point(point2)).geometry.coordinates;
};
/**
 * @author j_bleach
 * @date 2018-10-25
 * @Description: 预处理模拟导航数据
 * @param route:[{}]
 * @param speed:number
 */
const preHandleSimData = (route, speed = 1) => {
    let pointCollects = []; // 点集合
    let handleRoute = []; // 处理后路径
    let routeLength = 0; // 总距离
    let animateArray = []; // 细化点集合
    let parseTurnType = (turnType) => {
        let turnText = {
            0: "起点",
            1: "直行",
            2: "左转",
            3: "右转",
            4: "",
            5: "终点"
        }[turnType];
        return turnText;
    };
    for (let i = 1; i < route.length - 1; i++) {
        // totalDistance += route[i].distance;
        let item = route[i];
        item.LineCoordinates = [];
        item.turnTypeText = parseTurnType(route[i].turnType);
        if (route[i]["geometry"]["type"] === "LineString") {
            for (let k = 0; k < route[i]["geometry"]["coordinates"].length; k++) {
                item.LineCoordinates.push(route[i]["geometry"]["coordinates"][k]);
                pointCollects.push(route[i]["geometry"]["coordinates"][k]);
            }
        }
        if (route[i]["geometry"]["type"] === "MultiLineString") {
            for (let m = 0; m < route[i]["geometry"]["coordinates"].length; m++) {
                for (let n = 0; n < route[i]["geometry"]["coordinates"][m].length; n++) {
                    item.LineCoordinates.push(route[i]["geometry"]["coordinates"][m][n]);
                    pointCollects.push(route[i]["geometry"]["coordinates"][m][n]);
                }
            }
        }
        handleRoute.push(item);
    }
    let routeLine = lineString(pointCollects);
    routeLength = length(routeLine) * 1000;
    for (let i = 0, j = 0; i < routeLength * (50 / speed); i += 1) {
        j += 1 / (50 / speed) / 1000;
        let segment = along(routeLine, j);
        animateArray.push(segment.geometry.coordinates);
    }
    return {
        handleRoute,
        routeLength,
        animateArray
    };
};
/**
 * @author j_bleach
 * @date 2018-10-29
 * @Description: 预处理真实导航数据
 * @param route:[{}]
 */
const preHandleRealData = (route, map) => {
    let pointCollects = []; // 点集合
    let routeLength = 0; // 总距离
    let handleRouteFloor = {};
    let handleRouteFloorBeizer = {};
    let parseTurnType = (turnType) => {
        let turnText = {
            0: "起点",
            1: "直行",
            2: "左转",
            3: "右转",
            4: "",
            5: "终点"
        }[turnType];
        return turnText;
    };
    for (let i = 1; i < route.length - 1; i++) {
        // totalDistance += route[i].distance;
        let item = route[i];
        item.LineCoordinates = [];
        item.turnTypeText = parseTurnType(route[i].turnType);
        if (route[i]["geometry"]["type"] === "LineString") {
            for (let k = 0; k < route[i]["geometry"]["coordinates"].length; k++) {
                item.LineCoordinates.push(route[i]["geometry"]["coordinates"][k]);
                pointCollects.push(route[i]["geometry"]["coordinates"][k]);
            }
        }
        if (route[i]["geometry"]["type"] === "MultiLineString") {
            for (let m = 0; m < route[i]["geometry"]["coordinates"].length; m++) {
                for (let n = 0; n < route[i]["geometry"]["coordinates"][m].length; n++) {
                    item.LineCoordinates.push(route[i]["geometry"]["coordinates"][m][n]);
                    pointCollects.push(route[i]["geometry"]["coordinates"][m][n]);
                }
            }
        }
        const currentRoute = handleRouteFloor[item.startFloor];
        if (currentRoute && currentRoute instanceof Array) {
            handleRouteFloor[item.startFloor].push({
                "type": "Feature",
                ...item
            });
        } else {
            handleRouteFloor[item.startFloor] = [];
            handleRouteFloor[item.startFloor].push({
                "type": "Feature",
                ...item
            });
        }
    }
    for (let key in handleRouteFloor) {
        handleRouteFloorBeizer[key] = beizerFn(handleRouteFloor[key], map);
    }
    let routeLine = lineString(pointCollects);
    routeLength = length(routeLine) * 1000;
    return {
        routeLength,
        handleRouteFloor,
        handleRouteFloorBeizer
    };
};

// 贝塞尔处理
const beizerFn = (arr, map) => {

    let lines = arr;

    function getStartEndArr() {
        let startEndArr = new Array();
        for (let i = 0; i < lines.length; i++) {
            const pointObj = lines[i].geometry;
            //获取导航线起点
            // if (pointObj.type == "Point") {
            //     startEndArr.push({"x": pointObj.coordinates[0], "y": pointObj.coordinates[1]});
            //     startEndArr.push({"x": pointObj.coordinates[0], "y": pointObj.coordinates[1]});
            // }
            if (pointObj.type == "LineString") {
                startEndArr.push({"x": pointObj.coordinates[0][0], "y": pointObj.coordinates[0][1]});
                startEndArr.push({
                    "x": pointObj.coordinates[pointObj.coordinates.length - 1][0],
                    "y": pointObj.coordinates[pointObj.coordinates.length - 1][1]
                });
            } else if (pointObj.type == "MultiLineString") {
                startEndArr.push({"x": pointObj.coordinates[0][0][0], "y": pointObj.coordinates[0][0][1]});
                startEndArr.push({
                    "x": pointObj.coordinates[pointObj.coordinates.length - 1][pointObj.coordinates[pointObj.coordinates.length - 1].length - 1][0],
                    "y": pointObj.coordinates[pointObj.coordinates.length - 1][pointObj.coordinates[pointObj.coordinates.length - 1].length - 1][1]
                });
            }
        }
        return startEndArr;
    }

    function bezierLine(startPoint, endPoint, controlPoint, map) {
        let mControlPoints = new Array();
        mControlPoints[0] = map.project([startPoint.x, startPoint.y]);
        mControlPoints[1] = map.project([controlPoint.x, controlPoint.y]);
        mControlPoints[2] = map.project([endPoint.x, endPoint.y]);
        let points = new Array();
        let order = 2;
        let delta = 0.07;
        for (let t = 0; t < 1; t += delta) {
            let x = deCasteljauX(order, 0, t);
            let y = deCasteljauY(order, 0, t);
            let lngLat = map.unproject({"x": x, "y": y});
            points.push([lngLat.lng, lngLat.lat]);
        }

        function deCasteljauX(i, j, t) {
            if (i == 1) {
                return (1 - t) * mControlPoints[j].x + t * mControlPoints[j + 1].x;
            }
            return (1 - t) * deCasteljauX(i - 1, j, t) + t * deCasteljauX(i - 1, j + 1, t);
        }

        function deCasteljauY(i, j, t) {
            if (i == 1) {
                return (1 - t) * mControlPoints[j].y + t * mControlPoints[j + 1].y;
            }
            return (1 - t) * deCasteljauY(i - 1, j, t) + t * deCasteljauY(i - 1, j + 1, t);
        }

        return points;
    }

    function beizer(map) {
        let startEndArr = getStartEndArr();
        let c = new Array();
        for (let i = 0; i < startEndArr.length - 3; i += 2) {
            let startPoint = startEndArr[i];
            let endPoint = new Object();
            if (startEndArr.length < i + 5) {
                endPoint = startEndArr[i + 1];
            } else {
                endPoint = startEndArr[i + 2];
            }
            let nextendPoint = startEndArr[i + 3];
            let p0bearing = bearing([endPoint.x, endPoint.y], [startPoint.x, startPoint.y]);
            let p2bearing = bearing([endPoint.x, endPoint.y], [nextendPoint.x, nextendPoint.y]);
            let options = {units: "kilometers"};
            let p0distance = distance([startPoint.x, startPoint.y], [endPoint.x, endPoint.y], options);
            let p2distance = distance([nextendPoint.x, nextendPoint.y], [endPoint.x, endPoint.y], options);
            let pace;
            if (p0distance <= p2distance){
                if (p0distance<0.0015){
                    pace = p0distance/2.2;
                }else {
                    pace = 0.0015;
                }
            }else {
                if (p2distance<0.0015){
                    pace = p2distance/2.2;
                }else {
                    pace = 0.0015;
                }
            }
            let p0 = destination([endPoint.x, endPoint.y], pace, p0bearing, options);
            let p2 = destination([endPoint.x, endPoint.y], pace, p2bearing, options);
            let p1 = endPoint;

            let beziPoint = bezierLine({
                "x": p0.geometry.coordinates[0],
                "y": p0.geometry.coordinates[1]
            }, {"x": p2.geometry.coordinates[0], "y": p2.geometry.coordinates[1]}, p1, map);
            if (i == 0) {
                c.push([startPoint.x, startPoint.y]);
            }
            c.push(...beziPoint);
            if (startEndArr.length < i + 5) {
                c.push([nextendPoint.x, nextendPoint.y]);
            }
        }
        // console.log(c.join(" "));
        c = lineString(c);
        return c;
    }

    return beizer(map);
};
export {calcDistanceFn, calcMidPoint, preHandleSimData, preHandleRealData, beizerFn};