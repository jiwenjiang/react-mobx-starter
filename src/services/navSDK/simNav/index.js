/**
 * Created by j_bleach on 2018/10/25 0025.
 */
import {pointToLineDistance, point, lineString, distance, bearingToAzimuth, bearing} from "@turf/turf";

const simNavigationFn = (target) => {
    return class simNavigation extends target {
        constructor() {
            super();
        }

        startSimNavigation = (handleData, map, speed = 1) => {
            // 清除自由模式纠偏
            this.correctFreeLocateTimer = null;
            clearTimeout(this.correctFreeLocateWatchId);
            //
            const {animateArray, handleRoute, routeLength, handleRouteFloorBezierAni} = handleData;
            // 判断是否跨楼层
            let completeLength = 0;
            let currentLineIndex = 0;
            this.animateId = null;
            let voiceRecorder = {};
            const animate = () => {
                if (animateArray.length > 0) {
                    this.animateId = window.requestAnimationFrame(animate);
                    let currentPoint = animateArray[0];
                    animateArray.shift();
                    let geoPoint = point(currentPoint);
                    const distanceArr = [];
                    for (let v of handleRoute) {
                        let line = lineString(v.LineCoordinates);
                        distanceArr.push((pointToLineDistance(geoPoint, line) * 1000));
                    }

                    // console.log(distanceArr);
                    currentLineIndex = distanceArr.findIndex(v => v == Math.min(...distanceArr));
                    const leftDistance = routeLength - (completeLength / 50 / speed);
                    const simResult = this.simNavLogic(currentPoint, currentLineIndex, handleRoute, voiceRecorder);
                    handleRouteFloorBezierAni[simResult.currentFloor].shift();
                    const currentRoute = handleRouteFloorBezierAni[simResult.currentFloor];
                    if (map.getLayer("building-layer") && currentRoute && currentRoute.length > 2) {
                        const geoData = lineString(currentRoute);
                        map.getSource("building-route").setData(geoData);
                    }
                    // console.log(handleRouteFloorBezier[simResult.currentFloor]);
                    const output = {
                        leftDistance,
                        currentLon: currentPoint[0],
                        currentLat: currentPoint[1],
                        level: simResult.currentFloor,
                        totalDistance: routeLength,
                        bearing: simResult.currentBearing,
                        turn: simResult.turnType,
                        text: simResult.text,
                        voice: simResult.voice,
                        inElevator: this.inElevator
                    };
                    this.onSimStep(output);
                    completeLength++;
                } else {
                    console.log("取消");
                    this.inElevator = false;
                    this.simComplete();
                    window.cancelAnimationFrame(this.animateId);
                    if (map.getLayer("building-layer-down")) {
                        map.getSource("building-route-down").setData({
                            type: "FeatureCollection",
                            features: []
                        });
                    }
                    if (this.loc && this.loc.currentPosition) {
                        this.startCorrectFreeLocate(this.loc);
                    }
                }
            };
            animate();
        };

        // 模拟导航逻辑
        simNavLogic(currentPoint, currentLineIndex, handleRoute, voiceRecorder) {
            const currentFloor = handleRoute[currentLineIndex].startFloor; // 当前楼层
            const currentLine = handleRoute[currentLineIndex].LineCoordinates; // 当前路径
            const startPoint = point(currentLine[0]); // 当前路径终点
            const endPoint = point(currentLine[currentLine.length - 1]); // 当前路径终点
            const lineDistance = handleRoute[currentLineIndex].distance;
            const turnTypeText = handleRoute[currentLineIndex].turnTypeText;
            let turnType = handleRoute[currentLineIndex].turnType;
            const nextCrossType = currentLineIndex < handleRoute.length - 1
                ? handleRoute[currentLineIndex + 1].crossType
                : null; // 跨楼层类型
            const currentStartDistance = distance(currentPoint, startPoint) * 1000; // 当前起点距离
            const currentEndDistance = ~~(distance(currentPoint, endPoint) * 1000); // 当前终点距离
            const currentBearing = bearingToAzimuth(bearing(startPoint, endPoint)); // 当前方向
            let text = ""; // 文字提示
            let voice = ""; // 语音提示
            // 大于起点1米开始提示
            this.inElevator = false;
            if (currentStartDistance > 1) {
                if (currentLineIndex != (handleRoute.length - 1)) {
                    if (lineDistance < 5 && nextCrossType == 19) {
                        text = `请按路线行走`;
                    } else {
                        if (currentEndDistance >= 8) {
                            text = `请直行${currentEndDistance}米`;
                            turnType = 1;
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
                                this.inElevator = nextCrossType == 10 ? "stairs" : "elevator";
                                const startFloor = Number(handleRoute[currentLineIndex + 1].startFloor);
                                const endFloor = Number(handleRoute[currentLineIndex + 1].endFloor);
                                const type = startFloor > endFloor ? "下至" : "上至";
                                if (nextCrossType == 10) {
                                    turnType = 7;
                                } else {
                                    turnType = 6;
                                }
                                text = `请${type}${endFloor >= 0 ? endFloor + 1 : endFloor}楼`;
                            }
                            if (!voiceRecorder[`${currentLineIndex}3`]) {
                                if (nextCrossType == 19) {
                                    voice = `${turnTypeText}`;
                                } else if (nextCrossType == 10 || nextCrossType == 12) {
                                    const startFloor = Number(handleRoute[currentLineIndex + 1].startFloor);
                                    const endFloor = Number(handleRoute[currentLineIndex + 1].endFloor);
                                    const type = startFloor > endFloor ? "下至" : "上至";
                                    voice = `请${type}${endFloor >= 0 ? endFloor + 1 : endFloor}楼`;
                                }
                                voiceRecorder[`${currentLineIndex}3`] = true;
                            }
                        }
                    }
                } else {
                    if (currentStartDistance >= 2) {
                        text = `前方${currentEndDistance}米到达终点`;
                        if (!voiceRecorder[`${currentLineIndex}4`]) {
                            voice = `前方${currentEndDistance}米到达终点`;
                            voiceRecorder[`${currentLineIndex}4`] = true;
                        }
                    }
                }
            }
            return {
                text,
                voice,
                currentBearing,
                currentFloor,
                turnType
            };
        }
    };
};

export default simNavigationFn;
