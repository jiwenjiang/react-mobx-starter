/**
 * Created by j_bleach on 2018/10/29 0029.
 */
/*eslint-disable*/
import {
    pointToLineDistance,
    point,
    lineString,
    distance,
    bearingToAzimuth,
    bearing,
    nearestPointOnLine
} from "@turf/turf";

const realNavigationFn = (target) => {
    return class realNavigation extends target {
        constructor() {
            super();
        }

        onRealNavStep(currentPoint) {
            // console.log("实时导航", point);
            const {handleRouteFloor, handleRouteFloorBeizer, routeLength} = this.handleData;

            const routeFloor = handleRouteFloor[currentPoint.level];
            const routeFloorBeizer = handleRouteFloorBeizer[currentPoint.level];
            let currentLineIndex = 0;
            let geoPoint = point([currentPoint.longitude, currentPoint.latitude]);
            const distanceArr = [];
            for (let v of routeFloor) {
                let line = lineString(v.LineCoordinates);
                distanceArr.push(pointToLineDistance(geoPoint, line));
            }
            currentLineIndex = distanceArr.findIndex(v => v == Math.min(...distanceArr));
            this.currentRealNavLine = lineString(routeFloor[currentLineIndex].LineCoordinates);
            const shadowPoint = nearestPointOnLine(this.currentRealNavLine, geoPoint);
            const navResult = this.realNavLogic(shadowPoint, currentLineIndex, routeFloor, handleRouteFloor);
            const currentPt = [this.currentPoint.longitude, this.currentPoint.latitude];
            const beizerShadowPoint = nearestPointOnLine(routeFloorBeizer, point(currentPt));
            const output = {
                leftDistance: navResult.leftDistance,
                bearing: navResult.currentBearing,
                currentLon: beizerShadowPoint.geometry.coordinates[0],
                currentLat: beizerShadowPoint.geometry.coordinates[1],
                level: navResult.currentFloor,
                totalDistance: routeLength,
                turn: navResult.turnType,
                text: navResult.text,
                voice: navResult.voice,
                isOutdoor: this.currentPoint.isOutdoor,
                info: "SUCCESS"
            };
            this.onNavStep(output);
        }

        // 模拟导航逻辑
        realNavLogic(shadowPoint, currentLineIndex, routeFloor, handleRouteFloor) {
            let voiceRecorder = this.voiceRecorder;
            const currentFloor = routeFloor[currentLineIndex].startFloor; // 当前楼层
            const currentLine = routeFloor[currentLineIndex].LineCoordinates; // 当前路径
            const startPoint = point(currentLine[0]); // 当前路径终点
            const endPoint = point(currentLine[currentLine.length - 1]); // 当前路径终点
            const lineDistance = routeFloor[currentLineIndex].distance;
            const turnTypeText = routeFloor[currentLineIndex].turnTypeText;
            const turnType = routeFloor[currentLineIndex].turnType;
            const nextCrossType = currentLineIndex < routeFloor.length - 1
                ? routeFloor[currentLineIndex + 1].crossType
                : null; // 跨楼层类型
            const currentStartDistance = distance(shadowPoint, startPoint) * 1000; // 当前起点距离
            const currentEndDistance = ~~(distance(shadowPoint, endPoint) * 1000); // 当前终点距离
            const currentBearing = bearingToAzimuth(bearing(startPoint, endPoint)); // 当前方向
            // 当前点替换
            if (currentStartDistance > 5 && currentEndDistance > 5) {
                this.currentPoint = {
                    ...this.currentPoint,
                    longitude: shadowPoint.geometry.coordinates[0],
                    latitude: shadowPoint.geometry.coordinates[1]
                };
            }
            let leftDistance = 0;
            if (currentLineIndex == (routeFloor.length - 1)) {
                leftDistance = currentEndDistance;
                if (this.currentPoint.level != this.navEndLevel) {
                    for (let i = 0; i < handleRouteFloor[this.navEndLevel].length; i++) {
                        leftDistance += handleRouteFloor[this.navEndLevel][i];
                    }
                }
            } else {
                for (let i = currentLineIndex + 1; i < routeFloor.length; i++) {
                    leftDistance += routeFloor[i].distance;
                }
                leftDistance = leftDistance + currentEndDistance;
                if (this.currentPoint.level != this.navEndLevel) {
                    for (let i = 0; i < handleRouteFloor[this.navEndLevel].length; i++) {
                        leftDistance += handleRouteFloor[this.navEndLevel][i];
                    }
                }
            }


            let text = ""; // 文字提示
            let voice = ""; // 语音提示
            // 大于起点1米开始提示
            if (currentStartDistance > 1) {
                if (currentLineIndex != (routeFloor.length - 1)) {
                    if (lineDistance < 5) {
                        text = `请按路线行走`;
                    } else {
                        if (currentEndDistance >= 8) {
                            text = `请直行${currentEndDistance}米`;
                            if (!voiceRecorder[`${currentLineIndex}1`]) {
                                voice = "请直行";
                                voiceRecorder[`${currentLineIndex}1`] = true;
                            }
                        }
                        if (currentEndDistance <= 8 && currentEndDistance >= 5) {
                            text = `前方${currentEndDistance}米${turnTypeText}`;
                            if (!voiceRecorder[`${currentLineIndex}2`]) {
                                voice = `前方${turnTypeText}`;
                                voiceRecorder[`${currentLineIndex}2`] = true;
                            }
                        }
                        if (currentEndDistance <= 3) {
                            if (nextCrossType == 19) {
                                text = `${turnTypeText}`;
                            } else if (nextCrossType == 10 || nextCrossType == 12) {
                                const startFloor = Number(routeFloor[currentLineIndex + 1].startFloor);
                                const endFloor = Number(routeFloor[currentLineIndex + 1].endFloor);
                                const type = startFloor > endFloor ? "下至" : "上至";
                                text = `请${type}${endFloor >= 0 ? endFloor + 1 : endFloor}楼`;
                            }
                            if (!voiceRecorder[`${currentLineIndex}3`]) {
                                if (nextCrossType == 19) {
                                    voice = `${turnTypeText}`;
                                } else if (nextCrossType == 10 || nextCrossType == 12) {
                                    const startFloor = Number(routeFloor[currentLineIndex + 1].startFloor);
                                    const endFloor = Number(routeFloor[currentLineIndex + 1].endFloor);
                                    const type = startFloor > endFloor ? "下至" : "上至";
                                    voice = `请${type}${endFloor >= 0 ? endFloor + 1 : endFloor}楼`;
                                }
                                voiceRecorder[`${currentLineIndex}3`] = true;
                            }
                        }
                    }
                } else {
                    if (this.currentPoint.level == this.navEndLevel) {
                        if (currentStartDistance >= 1) {
                            text = `前方${currentEndDistance}米到达终点`;
                            if (!voiceRecorder[`${currentLineIndex}4`] && lineDistance > 5) {
                                voice = `前方${currentEndDistance}米到达终点`;
                                voiceRecorder[`${currentLineIndex}4`] = true;
                            }
                        }
                        if (currentEndDistance < 1) {
                            console.log("完成导航");
                            this.currentMode = "free";
                            this.startCorrectFreeLocate(this.loc);
                            this.navComplete(this.currentPoint);
                        }
                    }
                }
            }
            return {
                text,
                voice,
                currentFloor,
                turnType,
                currentBearing,
                leftDistance
            };
        }
    };
};

export default realNavigationFn;