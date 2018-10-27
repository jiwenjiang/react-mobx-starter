/**
 * Created by j_bleach on 2018/10/27 0027.
 */
import {bearing, destination, distance, lineString} from "@turf/turf";

const beizerFn = (arr) => {

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

    function bezierLine(startPoint, endPoint, controlPoint) {
        let mControlPoints = new Array();
        mControlPoints[0] = startPoint;
        mControlPoints[1] = controlPoint;
        mControlPoints[2] = endPoint;
        let points = new Array();
        let order = 2;
        let delta = 0.01;
        for (let t = 0; t < 1; t += delta) {
            let x = deCasteljauX(order, 0, t);
            let y = deCasteljauY(order, 0, t);
            points.push([x, y]);
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

    function beizer() {
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
            let p0d = 0.0005;
            let p2d = 0.0005;
            if (p0distance < 0.002) {
                p0d = p0distance / 3.0;
            }
            if (p2distance < 0.002) {
                p2d = p2distance / 3.0;
            }
            // if(p0distance<=p2distance){
            //     if(p0distance<0.005){
            //         p0d = p0distance/3.0;
            //     }
            // }else{
            //     if (p2distance<0.005){
            //         p2d = p2distance/3.0;
            //     }
            // }
            // console.log(p0d)
            // console.log(p2d)
            let p0 = destination([endPoint.x, endPoint.y], p0d, p0bearing, options);
            let p2 = destination([endPoint.x, endPoint.y], p2d, p2bearing, options);
            let p1 = endPoint;

            let beziPoint = bezierLine({
                "x": p0.geometry.coordinates[0],
                "y": p0.geometry.coordinates[1]
            }, {"x": p2.geometry.coordinates[0], "y": p2.geometry.coordinates[1]}, p1);
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

    return beizer();
};
export {beizerFn};