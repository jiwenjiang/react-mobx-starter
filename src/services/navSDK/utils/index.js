/**
 * Created by j_bleach on 2018/10/24 0024.
 */
/*eslint-disable*/
import {point, distance, midpoint, lineString, length, along, bearing, destination} from "@turf/turf";
import {floorStore} from "../../../mobx/stores/floorStore";

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
    let handleRouteFloorBezier = {};
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
        const routeIndoor = handleRouteFloor[key]
            && handleRouteFloor[key].filter(v => v.geometry.type !== "Point");
        handleRouteFloorBezier[key] = bezierV2(routeIndoor, map);
    }
    let routeLine = lineString(pointCollects);
    routeLength = length(routeLine) * 1000;
    return {
        routeLength,
        handleRouteFloor,
        handleRouteFloorBezier
    };
};

// 贝塞尔处理
const bezierV2 = (arr, map) => {

    function bezier(map) {

        let line = new Array();
        let isLine = 0;
        if (arr.length > 1) {
            for (let i = 0; i < arr.length; i++) {
                const lineObj = arr[i].geometry;
                if (lineObj.type != "Point") {

                    for (let j = 0; j < lineObj.coordinates.length; j++) {
                        if (j < lineObj.coordinates.length - 1) {
                            if (isLine === 0) {
                                isLine = 1;
                                if (lineObj.type == "LineString") {
                                    line.push(...[[lineObj.coordinates[j][0], lineObj.coordinates[j][1]]]);
                                } else {
                                    line.push(...[lineObj.coordinates[j][0], lineObj.coordinates[j][1]]);
                                }
                                // } else if (lineObj.type == "MultiLineString") {
                                //     // if (i == arr.length - 1) {
                                //     //     line.push(...[lineObj.coordinates[j + 1][0], lineObj.coordinates[j][1]]);
                                //     // } else if (j != lineObj.coordinates.length - 2) {
                                //     //     line.push(...[lineObj.coordinates[j + 1][0], lineObj.coordinates[j + 1][1]]);
                                //     // }
                                // }
                            } else {
                                if (i == arr.length - 1) {
                                    if (lineObj.type == "LineString") {
                                        line.push(...[[lineObj.coordinates[j + 1][0], lineObj.coordinates[j + 1][1]]]);
                                    } else {
                                        line.push(...lineObj.coordinates[j + 1]);
                                    }
                                } else if (j != lineObj.coordinates.length - 2) {
                                    line.push(...[lineObj.coordinates[j + 1][0], lineObj.coordinates[j + 1][1]]);
                                }

                            }
                        }
                    }
                    let beizerPoint = undefined;
                    if (i < arr.length - 1) {
                        beizerPoint = getBeizerPoint(arr, i);
                    }
                    if (beizerPoint != undefined && beizerPoint.endPoint != undefined && beizerPoint.controlPoint != undefined && beizerPoint.startPoint != undefined) {
                        let p0bearing = bearing([beizerPoint.controlPoint.x, beizerPoint.controlPoint.y], [beizerPoint.startPoint.x, beizerPoint.startPoint.y]);
                        let p2bearing = bearing([beizerPoint.controlPoint.x, beizerPoint.controlPoint.y], [beizerPoint.endPoint.x, beizerPoint.endPoint.y]);
                        let options = {units: "kilometers"};
                        let p0 = destination([beizerPoint.controlPoint.x, beizerPoint.controlPoint.y], 0.00075, p0bearing, options);
                        let p2 = destination([beizerPoint.controlPoint.x, beizerPoint.controlPoint.y], 0.00075, p2bearing, options);
                        let p1 = beizerPoint.controlPoint;
                        let beziPoint = bezierLine({
                            "x": p0.geometry.coordinates[0],
                            "y": p0.geometry.coordinates[1]
                        }, {"x": p2.geometry.coordinates[0], "y": p2.geometry.coordinates[1]}, p1, map);
                        line.push(...beziPoint);
                    }

                }
            }
        } else {
            if (arr[0].geometry.type == "LineString") {
                line.push(...arr[0].geometry.coordinates);
            } else {
                for(let i =0;i<arr[0].geometry.coordinates.length;i++){
                    line.push(...arr[0].geometry.coordinates[i]);
                }

            }
        }
        //return line;
        const result = line && line.length > 0 && lineString(line);
        return result;
    }

    function getBeizerPoint(lines, index) {
        let endPoint = undefined;
        let startPoint = undefined;
        let controlPoint = undefined;
        if (lines[index].geometry.type != "Point" && lines[index + 1].geometry.type != "Point")
            if (lines[index].geometry.type == "LineString") {
                startPoint = {
                    "x": lines[index].geometry.coordinates[0][0],
                    "y": lines[index].geometry.coordinates[0][1]
                };
                controlPoint = {
                    "x": lines[index].geometry.coordinates[lines[index].geometry.coordinates.length - 1][0],
                    "y": lines[index].geometry.coordinates[lines[index].geometry.coordinates.length - 1][1]
                };
                if (lines[index + 1].geometry.type == "LineString") {
                    endPoint = {
                        "x": lines[index + 1].geometry.coordinates[1][0],
                        "y": lines[index + 1].geometry.coordinates[1][1]
                    };
                } else if (lines[index + 1].geometry.type == "MultiLineString") {
                    endPoint = {
                        "x": lines[index + 1].geometry.coordinates[0][1][0],
                        "y": lines[index + 1].geometry.coordinates[0][1][1]
                    };
                }
            } else {
                startPoint = {
                    "x": lines[index].geometry.coordinates[lines[index].geometry.coordinates.length - 1][lines[index].geometry.coordinates[lines[index].geometry.coordinates.length - 1].length - 2][0],
                    "y": lines[index].geometry.coordinates[lines[index].geometry.coordinates.length - 1][lines[index].geometry.coordinates[lines[index].geometry.coordinates.length - 1].length - 2][1]
                };
                controlPoint = {
                    "x": lines[index].geometry.coordinates[lines[index].geometry.coordinates.length - 1][lines[index].geometry.coordinates[lines[index].geometry.coordinates.length - 1].length - 1][0],
                    "y": lines[index].geometry.coordinates[lines[index].geometry.coordinates.length - 1][lines[index].geometry.coordinates[lines[index].geometry.coordinates.length - 1].length - 1][1]
                };
                if (lines[index + 1].geometry.type == "LineString") {
                    endPoint = {
                        "x": lines[index + 1].geometry.coordinates[1][0],
                        "y": lines[index + 1].geometry.coordinates[1][1]
                    };
                } else if (lines[index + 1].geometry.type == "MultiLineString") {
                    endPoint = {
                        "x": lines[index + 1].geometry.coordinates[0][1][0],
                        "y": lines[index + 1].geometry.coordinates[0][1][1]
                    };
                }
            }
        return {"endPoint": endPoint, "startPoint": startPoint, "controlPoint": controlPoint};
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

    return bezier(map);
};
export {calcDistanceFn, calcMidPoint, preHandleSimData, preHandleRealData, bezierV2};