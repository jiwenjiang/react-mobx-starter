/**
 * Created by j_bleach on 2018/10/24 0024.
 */
import {point, distance, midpoint} from "@turf/turf";

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

export {calcDistanceFn, calcMidPoint};