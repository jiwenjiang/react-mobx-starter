/**
 * Created by j_bleach on 2018/10/27 0027.
 */
import {bearing, destination, lineString} from "@turf/turf";


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

export {bezierV2};
