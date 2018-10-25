/**
 * Created by j_bleach on 2018/10/24 0024.
 */
/*eslint-disable*/
import {point, distance, midpoint, lineString, length} from "@turf/turf";

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
 * @Description:
 * @param route:[{}]
 * @return name:String
 */
const preHandleData = (route) => {
    let pointCollects = []; // 点集合
    let handleRoute = []; // 处理后路径
    let totalDistance = 0; // 总距离
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
        totalDistance += route[i].distance;
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
    console.log("turf 长度", length(routeLine));
    console.log("点集合", routeLine);
    console.log("距离", totalDistance);
    return {
        pointCollects,
        handleRoute,
        totalDistance
    };
};
export {calcDistanceFn, calcMidPoint, preHandleData};