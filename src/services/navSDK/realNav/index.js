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

        onRealNavStep() {
            const {
                handleRouteFloor, handleRouteFloorBezier,
                routeLength, handleRouteFloorBezierAni, crossEndLevel, handleRouteFloorShadow
            } = this.handleData;
            /*线路分段计算*/
            if (this.floorRecorder[this.currentPoint.level] !== undefined) {
                if (this.floorRecorder.lastFloor != this.currentPoint.level) {
                    this.floorRecorder.lastFloor = this.currentPoint.level;
                    this.floorRecorder[this.currentPoint.level] += 1;
                    if (this.floorRecorder[this.currentPoint.level] >= this.handleData.countKey[this.currentPoint.level]) {
                        this.floorRecorder[this.currentPoint.level] = this.handleData.countKey[this.currentPoint.level];
                    }
                }
            } else {
                this.floorRecorder.lastFloor = this.currentPoint.level;
                this.floorRecorder[this.currentPoint.level] = 0;
            }
            /*线路分段计算*/
            const currentFloor = JSON.stringify({
                level: Number(this.currentPoint.level),
                index: this.floorRecorder[this.currentPoint.level]
            });
            const routeFloor = handleRouteFloor[currentFloor];
            const routeFloorBezier = handleRouteFloorBezier[currentFloor];
            const routeFloorBezierAni = handleRouteFloorBezierAni[currentFloor];
            const routeFloorBezierShadow = handleRouteFloorShadow[currentFloor];
            let bezierShadowPoint = null;
            let currentLineIndex = 0;

            let geoPoint = point([this.currentPoint.longitude, this.currentPoint.latitude]);

            let voice = null;
            let turnType = null;

            const distanceArr = [];
            for (let v of routeFloor) {
                let line = lineString(v.LineCoordinates);
                distanceArr.push(pointToLineDistance(geoPoint, line));
            }
            currentLineIndex = distanceArr.findIndex(v => v == Math.min(...distanceArr));
            this.currentRealNavLine = lineString(routeFloor[currentLineIndex].LineCoordinates);

            let shadowPoint = nearestPointOnLine(this.currentRealNavLine, geoPoint);
            /*历史动画*/
            // let shadowPointBezier = nearestPointOnLine(lineString(routeFloorBezierAni), shadowPoint);
            // let shadowLine = routeFloorBezierAni.slice(shadowPointBezier.properties.index);
            // if (this.mapObj.getLayer("building-layer") && shadowLine && shadowLine.length > 2) {
            //     const geoData = lineString(shadowLine);
            //     this.mapObj.getSource("building-route").setData(geoData);
            // }
            /*历史动画*/
            let currentDistance = distance(geoPoint, shadowPoint) * 1000;
            /*偏航*/
            if (this.currentPoint.locType == "gps" && this.currentPoint.accuracy <= 30 && currentDistance > 30) {
                console.log("gps 偏航", currentDistance);
                this.stopNav();
                this.navComplete({...this.currentPoint, isYaw: true});
                return false;
            }
            if (this.currentPoint.locType == "ibeacon" && currentDistance > 15) {
                console.log("ibeacon 偏航", currentDistance);
                this.stopNav();
                this.navComplete({...this.currentPoint, isYaw: true});
                return false;
            }
            /*偏航*/

            let currentPt = [this.currentPoint.longitude, this.currentPoint.latitude];
            /*进入电梯、扶梯判断*/
            // if (this.loc.currentPosition.locType == "ibeacon" && this.loc.currentLocation == "gps") {
            //     if (this.loc.currentPosition.level != crossEndLevel
            //         && (currentLineIndex == routeFloor.length - 1
            //             || currentLineIndex == routeFloor.length - 2)) {
            //         const crossType = routeFloor[currentLineIndex + 1]
            //         && routeFloor[currentLineIndex + 1].crossType == 12 ? "elevator" : "stairs";
            //         this.inElevator = crossType;
            //         turnType = crossType == "elevator" ? 6 : 7;
            //         const coordinates = routeFloorBezier.geometry.coordinates;
            //         shadowPoint = point(coordinates[coordinates.length - 1]);
            //         currentPt = coordinates[coordinates.length - 1];
            //         this.elEndPoint = point(coordinates[coordinates.length - 1]);
            //     }
            // }

            if (this.loc.currentPosition.level != crossEndLevel) {
                const coordinates = routeFloorBezier.geometry.coordinates;
                const endPoint = point(coordinates[coordinates.length - 1]);
                const elDistance = distance(shadowPoint, endPoint) * 1000;
                if (elDistance < 2) {
                    const crossType = routeFloor[currentLineIndex + 1]
                    && routeFloor[currentLineIndex + 1].crossType == 12 ? "elevator" : "stairs";
                    this.inElevator = crossType;
                    voice = this.loc.currentPosition.level < crossEndLevel
                        ? `请上至${crossEndLevel >= 0 ? Number(crossEndLevel) + 1 : crossEndLevel}楼`
                        : `请下至${crossEndLevel >= 0 ? Number(crossEndLevel) + 1 : crossEndLevel}楼`;
                    turnType = crossType == "elevator" ? 6 : 7;
                    const coordinates = routeFloorBezier.geometry.coordinates;
                    shadowPoint = point(coordinates[coordinates.length - 1]);
                    currentPt = coordinates[coordinates.length - 1];
                    this.elEndPoint = point(coordinates[coordinates.length - 1]);
                }
            }
            /*进入电梯、扶梯判断*/

            const navResult = this.realNavLogic(shadowPoint, currentLineIndex, routeFloor, handleRouteFloor, routeFloorBezierShadow);

            if (!this.inElevator && navResult.shadowLinePoint) {
                bezierShadowPoint = nearestPointOnLine(routeFloorBezier, navResult.shadowLinePoint);
            } else {
                bezierShadowPoint = nearestPointOnLine(routeFloorBezier, point(currentPt));
            }
            const output = {
                leftDistance: navResult.leftDistance,
                bearing: navResult.currentBearing,
                currentLon: bezierShadowPoint.geometry.coordinates[0],
                currentLat: bezierShadowPoint.geometry.coordinates[1],
                level: this.currentPoint.level,
                totalDistance: routeLength,
                turn: turnType || navResult.turnType,
                text: voice || navResult.text,
                voice: voice || navResult.voice,
                isOutdoor: this.currentPoint.isOutdoor,
                info: "SUCCESS",
                inElevator: this.inElevator,
            };
            this.onNavStep(output);
        }

        // 导航逻辑
        realNavLogic(shadowPoint, currentLineIndex, routeFloor, handleRouteFloor, routeFloorBezierShadow) {
            let voiceRecorder = this.voiceRecorder;
            const currentFloor = routeFloor[currentLineIndex].startFloor; // 当前楼层
            const currentLine = routeFloor[currentLineIndex].LineCoordinates; // 当前路径
            const startPoint = point(currentLine[0]); // 当前路径终点
            const endPoint = point(currentLine[currentLine.length - 1]); // 当前路径终点
            const lineDistance = routeFloor[currentLineIndex].distance;
            const turnTypeText = routeFloor[currentLineIndex].turnTypeText;
            let turnType = routeFloor[currentLineIndex].turnType;
            const nextCrossType = currentLineIndex < routeFloor.length - 1
                ? routeFloor[currentLineIndex + 1].crossType
                : null; // 跨楼层类型
            const currentStartDistance = distance(shadowPoint, startPoint) * 1000; // 当前起点距离
            const currentEndDistance = ~~(distance(shadowPoint, endPoint) * 1000); // 当前终点距离
            const currentBearing = bearingToAzimuth(bearing(startPoint, endPoint)); // 当前方向

            // 当前点替换
            const replaceLimit = this.loc.currentLocation == "gps" ? 8 : 5;
            if (currentStartDistance > replaceLimit && currentEndDistance > replaceLimit) {
                this.currentPoint = {
                    ...this.currentPoint,
                    longitude: shadowPoint.geometry.coordinates[0],
                    latitude: shadowPoint.geometry.coordinates[1]
                };
            }
            /*重新计算投影点*/
            let currentPt = [this.currentPoint.longitude, this.currentPoint.latitude]; // 当前点
            const currentEndShadow = routeFloorBezierShadow[currentLineIndex];
            const currentStartShadow = currentLineIndex > 0
                ? routeFloorBezierShadow[currentLineIndex - 1]
                : null;
            let shadowLinePoint = null;

            if (nextCrossType) {
                if (currentLineIndex == 0) {
                    if (currentEndDistance < replaceLimit) {
                        shadowLinePoint = nearestPointOnLine(currentEndShadow, point(currentPt));
                    }
                } else {
                    if (currentStartDistance < replaceLimit) {
                        shadowLinePoint = nearestPointOnLine(currentStartShadow, point(currentPt));
                    }
                    if (currentEndDistance < replaceLimit) {
                        shadowLinePoint = nearestPointOnLine(currentEndShadow, point(currentPt));
                    }
                }
            }
            /*重新计算投影点*/


            // 剩余距离计算
            let leftDistance = 0;
            if (currentLineIndex == (routeFloor.length - 1)) {
                leftDistance = currentEndDistance;
                if (this.currentPoint.level != this.navEndLevel && handleRouteFloor[this.navEndLevel]) {
                    for (let i = 0; i < handleRouteFloor[this.navEndLevel].length; i++) {
                        leftDistance += handleRouteFloor[this.navEndLevel][i];
                    }
                }
            } else {
                for (let i = currentLineIndex + 1; i < routeFloor.length; i++) {
                    leftDistance += routeFloor[i].distance;
                }
                leftDistance = leftDistance + currentEndDistance;
                if (this.currentPoint.level != this.navEndLevel && handleRouteFloor[this.navEndLevel]) {
                    for (let i = 0; i < handleRouteFloor[this.navEndLevel].length; i++) {
                        leftDistance += handleRouteFloor[this.navEndLevel][i].distance;
                    }
                }
            }

            // 文案，语音计算
            let text = ""; // 文字提示
            let voice = ""; // 语音提示
            // 大于起点1米开始提示
            if (currentStartDistance > 0.1) {
                if (currentLineIndex != (routeFloor.length - 1)) {
                    if (lineDistance < 5) {
                        text = `请按路线行走`;
                    } else {
                        const upLimit = this.loc.currentLocation == "gps" ? 15 : 8;
                        const downLimit = this.loc.currentLocation == "gps" ? 8 : 5;
                        if (currentEndDistance > upLimit) {
                            text = `请直行${currentEndDistance}米`;
                            turnType = 1;
                            if (!voiceRecorder[`${currentLineIndex}1`]) {
                                voice = "请直行";
                                voiceRecorder[`${currentLineIndex}1`] = true;
                            }
                        }
                        if (currentEndDistance <= upLimit && currentEndDistance >= downLimit) {
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
                                }
                                // else if (nextCrossType == 10 || nextCrossType == 12) {
                                //     const startFloor = Number(routeFloor[currentLineIndex + 1].startFloor);
                                //     const endFloor = Number(routeFloor[currentLineIndex + 1].endFloor);
                                //     const type = startFloor > endFloor ? "下至" : "上至";
                                //     voice = `请${type}${endFloor >= 0 ? endFloor + 1 : endFloor}楼`;
                                // }
                                voiceRecorder[`${currentLineIndex}3`] = true;
                            }
                        }
                    }
                } else {
                    if (this.currentPoint.level == this.navEndLevel) {
                        if (currentStartDistance >= 1) {
                            turnType = 1;
                            text = `前方${currentEndDistance}米到达终点`;
                            if (!voiceRecorder[`${currentLineIndex}4`] && lineDistance > 5) {
                                voice = `前方${currentEndDistance}米到达终点`;
                                voiceRecorder[`${currentLineIndex}4`] = true;
                            }
                        }
                        if (currentEndDistance < 2) {
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
                leftDistance,
                shadowLinePoint
            };
        }
    };
};

export default realNavigationFn;
