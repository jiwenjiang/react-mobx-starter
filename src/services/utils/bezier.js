/**
 * Created by j_bleach on 2018/10/27 0027.
 */
import {bearing, destination, distance, lineString} from "@turf/turf";

const bezierFn = (arr, map) => {

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

    function bezier(map) {
        let startEndArr = getStartEndArr();
        let c = new Array();
        if (startEndArr.length > 2) {
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
                if (p0distance <= p2distance) {
                    if (p0distance < 0.0015) {
                        pace = p0distance / 2.2;
                    } else {
                        pace = 0.0015;
                    }
                } else {
                    if (p2distance < 0.0015) {
                        pace = p2distance / 2.2;
                    } else {
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
        } else {

            for (let i = 0; i < lines.length; i++) {
                const pointObj = lines[i].geometry;
                if (pointObj.type == "LineString") {
                    for (let j = 0; j < pointObj.coordinates.length; j++) {
                        c.push([pointObj.coordinates[j][0], pointObj.coordinates[j][1]]);
                    }
                }
                if (pointObj.type == "MultiLineString") {
                    for (let j = 0; j < pointObj.coordinates.length; j++) {
                        for (let t = 0; t < pointObj.coordinates[j].length; t++) {
                            c.push([pointObj.coordinates[j][t][0], pointObj.coordinates[j][t][1]]);
                        }
                    }
                }
            }
        }


        // console.log(c.join(" "));
        c = lineString(c);
        return c;
    }

    return bezier(map);
};
export {bezierFn};