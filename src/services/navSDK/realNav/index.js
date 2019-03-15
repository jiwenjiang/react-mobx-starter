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
    nearestPointOnLine,
    lineSlice, length, along
} from "@turf/turf";
import {calcIntersectionAngle} from "../utils";

const realNavigationFn = (target) => {
    return class realNavigation extends target {
        constructor() {
            super();
        }

        onRealNavStep() {
            let {
                handleRouteFloor, handleRouteFloorBezier, levelCollects,
                routeLength, handleRouteFloorBezierAni, crossEndLevel, handleRouteFloorShadow
            } = this.handleData;
            if (this.loc.currentPosition.locType == "ibeacon"
                && !levelCollects.includes(Number(this.loc.currentPosition.level))) {
                this.diffLevelCount++;
                if (this.diffLevelCount > 5) {
                    this.stopNav();
                    this.navComplete({...this.loc.currentPosition, isYaw: true});
                    return false;
                }
            }
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
            const routeFloor = handleRouteFloor[currentFloor]; // 当前线路
            const routeFloorBezier = handleRouteFloorBezier[currentFloor]; // 当前贝塞尔线路
            const routeFloorBezierAni = handleRouteFloorBezierAni[currentFloor];
            const routeFloorBezierShadow = handleRouteFloorShadow[currentFloor]; // 当前贝塞尔投影线路
            let bezierShadowPoint = null;
            let currentLineIndex = 0;

            let geoPoint = point([this.currentPoint.longitude, this.currentPoint.latitude]);

            let voice = null;
            let turnType = null;

            /**
             * @author j_bleach
             * @date 2019-03-07
             * @Description: 计算拐角投影线路
             */
            const distanceArr = [];
            routeFloor.forEach(v => {
                let line = lineString(v.LineCoordinates);
                distanceArr.push(pointToLineDistance(geoPoint, line));
            });
            // 临时线路拐角计算
            currentLineIndex = distanceArr.findIndex(v => v == Math.min(...distanceArr));
            if (currentLineIndex == this.lastCurrentLineIndex) {
                const currentLine = routeFloor[currentLineIndex].LineCoordinates; // 当前路径
                const nextLine = routeFloor[currentLineIndex + 1] ? routeFloor[currentLineIndex + 1].LineCoordinates : null;
                const endPoint = point(currentLine[currentLine.length - 1]); // 当前路径终点
                const tempCurrentRealNavLine = lineString(currentLine);
                const tempShadowPoint = nearestPointOnLine(tempCurrentRealNavLine, geoPoint); // 临时投影点
                const currentEndDistance = distance(tempShadowPoint, endPoint) * 1000;

                if (currentEndDistance <= 5 && nextLine) {
                    console.log("转角5米以内");
                    const nextLineAngle = bearingToAzimuth(bearing(point(nextLine[0]), point(nextLine[nextLine.length - 1])));
                    const absAngleValue = Math.abs(nextLineAngle - this.alpha);
                    const angleValue = absAngleValue > 180 ? 360 - absAngleValue : absAngleValue;
                    if (angleValue < 45) {
                        this.nextLineAngleNum++;
                        console.log("与下一条线夹角小于45°", this.nextLineAngleNum);
                        if (this.nextLineAngleNum > 4) {
                            console.log("切换下条线路");
                            currentLineIndex = routeFloor[currentLineIndex + 1] ? currentLineIndex + 1 : currentLineIndex;
                            this.lastCurrentLineIndex = currentLineIndex;
                        }
                    } else {
                        this.nextLineAngleNum = 0;
                    }
                }
            } else {
                console.log("与上一条投影线不同");
                this.nextLineAngleNum = 0;
                const currentLine = routeFloor[currentLineIndex].LineCoordinates; // 当前路径
                const currentLineAngle = bearing(point(currentLine[0]), point(currentLine[currentLine.length - 1]));
                const absAngleValue = Math.abs(currentLineAngle - this.alpha);
                const angleValue = absAngleValue > 180 ? 360 - absAngleValue : absAngleValue;
                if (angleValue > 55) {
                    console.log("与上一条投影线不同,且与当前方向角大于55°");
                    currentLineIndex = this.lastCurrentLineIndex;
                } else {
                    this.lastCurrentLineIndex = currentLineIndex;
                }
            }
            // 临时线路拐角计算

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
            // console.log("类型，精度，距离", this.loc.currentPosition.locType, this.loc.currentPosition.accuracy, currentDistance);
            // console.log("蓝牙楼层", this.loc.ibeaconCoords && this.loc.ibeaconCoords.level);
            if (this.loc.currentPosition.locType == "gps" && this.loc.currentPosition.accuracy <= 25 && currentDistance > 30
                && (this.loc.ibeaconCoords == null || this.loc.ibeaconCoords.level == 0)) {
                console.log("gps 偏航", currentDistance);
                this.stopNav();
                this.navComplete({...this.loc.currentPosition, isYaw: true});
                return false;
            }
            if (this.loc.currentPosition.locType == "ibeacon" && currentDistance > 15) {
                console.log("ibeacon 偏航", currentDistance);
                this.stopNav();
                this.navComplete({...this.loc.currentPosition, isYaw: true});
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
            // console.log("start,end", this.crossStartLevelArr, this.crossEndLevelArr)
            if (this.crossStartLevelArr.includes(Number(this.loc.currentPosition.level))
                && this.crossEndLevelArr.length > 0 && !this.crossEndLevelArr.includes(Number(this.loc.currentPosition.level))) {
                const coordinates = routeFloorBezier.geometry.coordinates;
                const endPoint = point(coordinates[coordinates.length - 1]);
                const elDistance = ~~(distance(shadowPoint, endPoint) * 1000);
                if (elDistance <= 2) {
                    this.crossStartLevelArr = this.crossStartLevelArr.filter(v => v != this.loc.currentPosition.level);
                    const crossType = routeFloor[currentLineIndex + 1]
                    && routeFloor[currentLineIndex + 1].crossType == 12 ? "elevator" : "stairs";
                    this.inElevator = crossType;
                    voice = this.loc.currentPosition.level < this.crossEndLevelArr[0]
                        ? `请上至${this.crossEndLevelArr[0] >= 0 ? Number(this.crossEndLevelArr[0]) + 1 : this.crossEndLevelArr[0]}楼`
                        : `请下至${this.crossEndLevelArr[0] >= 0 ? Number(this.crossEndLevelArr[0]) + 1 : this.crossEndLevelArr[0]}楼`;
                    turnType = crossType == "elevator" ? 6 : 7;
                    const coordinates = routeFloorBezier.geometry.coordinates;
                    shadowPoint = point(coordinates[coordinates.length - 1]);
                    currentPt = coordinates[coordinates.length - 1];
                    this.elEndPoint = point(coordinates[coordinates.length - 1]);
                }
            }
            /*进入电梯、扶梯判断*/

            const navResult = this.realNavLogic(shadowPoint, currentLineIndex, routeFloor, handleRouteFloor, routeFloorBezierShadow, currentFloor);

            if (!this.inElevator && navResult.shadowLinePoint) {
                bezierShadowPoint = nearestPointOnLine(routeFloorBezier, navResult.shadowLinePoint);
            } else {
                bezierShadowPoint = nearestPointOnLine(routeFloorBezier, point(currentPt));
                /*投影回跳计算*/
                if (this.lastBezierShadowPoint) {
                    const lastBezierShadowPoint = this.lastBezierShadowPoint.geometry.coordinates;
                    const currBezierShadowPoint = bezierShadowPoint.geometry.coordinates;
                    const ptLon = currBezierShadowPoint[0] - lastBezierShadowPoint[0];
                    const ptLat = currBezierShadowPoint[1] - lastBezierShadowPoint[1];
                    const lineCoordinates = routeFloor[currentLineIndex].LineCoordinates;
                    const lineLon = lineCoordinates[lineCoordinates.length - 1][0] - lineCoordinates[0][0];
                    const lineLat = lineCoordinates[lineCoordinates.length - 1][1] - lineCoordinates[0][1];
                    let currentPointDirection = [ptLon, ptLat];
                    let currentLineDirection = [lineLon, lineLat];
                    let stepDirection = [Math.sin(this.alpha * Math.PI / 180), Math.cos(this.alpha * Math.PI / 180)]; // 步进器方向向量
                    const pointToLineDirection = calcIntersectionAngle(currentPointDirection, currentLineDirection);
                    const stepToLineDirection = calcIntersectionAngle(stepDirection, currentLineDirection);
                    if (pointToLineDirection > 150 && stepToLineDirection < 90) {
                        bezierShadowPoint = this.lastBezierShadowPoint;
                    }
                }
                /*投影回跳计算*/
                this.calcNavDistance(bezierShadowPoint, routeFloorBezier, navResult, turnType, routeLength);
                this.lastBezierShadowPoint = bezierShadowPoint;
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
                isOutdoor: navResult.isOutdoor,
                info: "SUCCESS",
                inElevator: this.inElevator
            };
            this.onNavStep(output);
        }

        // 导航逻辑
        realNavLogic(shadowPoint, currentLineIndex, routeFloor, handleRouteFloor, routeFloorBezierShadow, targetFloor) {
            let voiceRecorder = this.voiceRecorder;
            const currentFloor = routeFloor[currentLineIndex].startFloor; // 当前楼层
            const currentLine = routeFloor[currentLineIndex].LineCoordinates; // 当前路径
            const startPoint = point(currentLine[0]); // 当前路径终点
            const endPoint = point(currentLine[currentLine.length - 1]); // 当前路径终点
            const lineDistance = routeFloor[currentLineIndex].distance;
            const turnTypeText = routeFloor[currentLineIndex].turnTypeText;
            const isOutdoor = !routeFloor[currentLineIndex].indoor;
            let turnType = routeFloor[currentLineIndex].turnType;
            const nextCrossType = currentLineIndex < routeFloor.length - 1
                ? routeFloor[currentLineIndex + 1].crossType
                : null; // 跨楼层类型
            const currentStartDistance = distance(shadowPoint, startPoint) * 1000; // 当前起点距离
            const currentEndDistance = ~~(distance(shadowPoint, endPoint) * 1000); // 当前终点距离
            const currentBearing = bearingToAzimuth(bearing(startPoint, endPoint)); // 当前方向

            // 当前点替换
            // const replaceLimit = this.loc.currentLocation == "gps" ? 8 : 5;
            // if (currentStartDistance > replaceLimit && currentEndDistance > replaceLimit) {
            //     this.stepLocation = {
            //         ...this.stepLocation,
            //         longitude: shadowPoint.geometry.coordinates[0],
            //         latitude: shadowPoint.geometry.coordinates[1]
            //     };
            // }

            /*计算是否位于室内最后一段及室外 禁止室内纠偏*/
            // if (routeFloor[currentLineIndex].indoor == false
            //     || (nextCrossType && routeFloor[currentLineIndex + 1].indoor == false) && currentEndDistance <= 3) {
            //     if (routeFloor[currentLineIndex + 1]) {
            //         console.log("current,next", routeFloor[currentLineIndex].indoor, routeFloor[currentLineIndex + 1].indoor);
            //     }
            //     console.log("currentEndDistance", currentEndDistance);
            //     this.stopCorrectIndoor = true;
            // } else {
            //     this.stopCorrectIndoor = false;
            // }
            /*计算是否位于室内最后一段及室外*/

            /*重新计算投影点*/
            // let currentPt = [this.currentPoint.longitude, this.currentPoint.latitude]; // 当前点
            // const currentEndShadow = routeFloorBezierShadow[currentLineIndex];
            // const currentStartShadow = currentLineIndex > 0
            //     ? routeFloorBezierShadow[currentLineIndex - 1]
            //     : null;
            // let shadowLinePoint = null;
            //
            // if (nextCrossType) {
            //     if (currentLineIndex == 0) {
            //         if (currentEndDistance < replaceLimit) {
            //             shadowLinePoint = nearestPointOnLine(currentEndShadow, point(currentPt));
            //         }
            //     } else {
            //         if (currentStartDistance < replaceLimit) {
            //             shadowLinePoint = nearestPointOnLine(currentStartShadow, point(currentPt));
            //         }
            //         if (currentEndDistance < replaceLimit) {
            //             shadowLinePoint = nearestPointOnLine(currentEndShadow, point(currentPt));
            //         }
            //     }
            // }
            /*重新计算投影点*/


            // 剩余距离计算
            let leftDistance = 0;
            if (currentLineIndex == (routeFloor.length - 1)) {
                leftDistance = currentEndDistance;
                const endLevel = JSON.stringify({
                    level: Number(this.navEndLevel),
                    index: 0
                });
                if (this.currentPoint.level != this.navEndLevel && handleRouteFloor[endLevel]) {
                    for (let i = 0; i < handleRouteFloor[endLevel].length; i++) {
                        leftDistance += handleRouteFloor[endLevel][i].distance;
                    }
                }
            } else {
                for (let i = currentLineIndex + 1; i < routeFloor.length; i++) {
                    leftDistance += routeFloor[i].distance;
                }
                leftDistance = leftDistance + currentEndDistance;
                const endLevel = JSON.stringify({
                    level: Number(this.navEndLevel),
                    index: 0
                });
                if (this.currentPoint.level != this.navEndLevel && handleRouteFloor[endLevel]) {
                    for (let i = 0; i < handleRouteFloor[endLevel].length; i++) {
                        leftDistance += handleRouteFloor[endLevel][i].distance;
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
                                else if (nextCrossType == 10 || nextCrossType == 12) {
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
                    // console.log("target", targetFloor);
                    if (targetFloor == this.navEndLevelString && !this.inElevator) {
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
                            // this.startCorrectFreeLocate(this.loc);
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
                isOutdoor
                // shadowLinePoint
            };
        }

        /**
         * @author j_bleach
         * @date 2019-02-26
         * @Description: 动画逻辑（大于0.8米）
         */
        calcNavDistance(pt, routeFloorBezier, navResult, turnType, routeDis) {
            if (this.lastBezierShadowPoint) {
                const lastToCurrPt = distance(this.lastBezierShadowPoint, pt);
                if (lastToCurrPt * 1000 > 0.8) {
                    const slicedLine = lineSlice(this.lastBezierShadowPoint, pt, routeFloorBezier);
                    const routeLength = length(slicedLine) * 1000;
                    const animateArray = [];
                    for (let i = 0, j = 0; i < routeLength * (50); i += 1) {
                        j += 1 / (50) / 1000;
                        let segment = along(slicedLine, j);
                        animateArray.push(segment.geometry.coordinates);
                    }
                    let animateId = null;
                    const animate = () => {
                        animateId = window.requestAnimationFrame(animate);
                        const output = {
                            leftDistance: navResult.leftDistance,
                            bearing: navResult.currentBearing,
                            currentLon: animateArray[0][0],
                            currentLat: animateArray[0][1],
                            level: this.currentPoint.level,
                            totalDistance: routeDis,
                            turn: turnType || navResult.turnType,
                            text: navResult.text,
                            voice: null,
                            isOutdoor: navResult.isOutdoor,
                            info: "SUCCESS",
                            inElevator: this.inElevator
                        };
                        animateArray.shift();
                        this.onNavStep(output);
                        if (animateArray.length == 0) {
                            window.cancelAnimationFrame(animateId);
                        }
                    };
                    animate();
                }
            }
        }
    };
};

export default realNavigationFn;
