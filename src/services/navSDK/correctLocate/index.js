/**
 * Created by j_bleach on 2018/10/23 0023.
 */
import {calcDistanceFn, calcMidPoint} from "../utils";
import {point, distance} from "@turf/turf";

const correctLocateFn = (target) => {
    return class correctLocate extends target {
        constructor() {
            super();
        }

        // 自由模式
        startCorrectFreeLocate(loc) {
            console.log("entry 自由纠偏");
            // 清除nav
            this.correctNavLocateTimer = null;
            this.correctNavLocateWatchId && clearTimeout(this.correctNavLocateWatchId);
            // 开始free
            this.correctFreeLocateTimer = () => {
                this.correctFreeLocateWatchId = setTimeout(() => {
                    this.correctFreeLocateTimer && this.correctFreeLocateTimer();
                    this.chooseFreeCorrectMode(loc);
                }, 1000);
            };
            this.correctFreeLocateTimer();
        }

        updateFreeCurrentPoint = (point) => {
            this.correctFreeFlag = true;
            this.currentPoint = point;
            this.onFreeStep(point);
            setTimeout(() => {
                this.correctFreeFlag = false;
            }, 5000);
        };

        chooseFreeCorrectMode = (loc) => {
            const locate = loc.currentPosition;
            const correctMode = {
                "ibeacon": this.correctFreeLocateIndoor,
                "gps": this.correctFreeLocateOutdoor
            }[locate.locType];
            if (this.currentPoint.level != this.loc.currentPosition.level) {
                this.currentPoint = {...this.currentPoint, level: this.loc.currentPosition.level};
            }
            correctMode && correctMode(locate);
        };

        /**
         * @author j_bleach
         * @date 2018-10-24
         * @Description:
         * @param loc:object 当前定位点
         */
        correctFreeLocateIndoor = (loc) => {
            // 如果存在纠偏标志，则返回
            if (this.correctFreeFlag) {
                return false;
            }
            if (loc.timer == this.locTimer) {
                return false;
            }

            this.locTimer = loc.timer;
            const ibeaconPoint = [loc.longitude, loc.latitude]; // 蓝牙点
            const fiducialPoint = [loc.fiducialLon, loc.fiducialLat]; // 置信点
            const currentPoint = [this.currentPoint.longitude, this.currentPoint.latitude]; // 当前点
            const polygonPoint = [loc.polygonLon, loc.polygonLat]; // 质心点
            const ibeaconToFiducial = calcDistanceFn(fiducialPoint, ibeaconPoint); // 置信点蓝牙点距离
            const currentToIbeacon = calcDistanceFn(currentPoint, ibeaconPoint); // 当前点蓝牙点距离
            const currentToFiducial = calcDistanceFn(currentPoint, fiducialPoint); // 当前点蓝牙点距离
            const currentToPolygon = calcDistanceFn(currentPoint, polygonPoint); // 当前点质心点距离
            // 存在置信点
            if (loc.fiducialLon) {
                // 置信点至蓝牙点小于3米
                if (ibeaconToFiducial < 3) {
                    // 当前点至蓝牙点大于2米
                    if (currentToIbeacon > 2) {
                        console.log("free 当前点至蓝牙点大于2米");
                        const point = {...this.currentPoint, longitude: loc.longitude, latitude: loc.latitude};
                        this.updateFreeCurrentPoint(point);
                    }
                } else {
                    // 当前点距离置信点大于10米
                    if (currentToFiducial > 10) {
                        console.log("free 当前点距离置信点大于10米");
                        const point = {...this.currentPoint, longitude: loc.fiducialLon, latitude: loc.fiducialLat};
                        this.updateFreeCurrentPoint(point);
                    } else {
                        // 当前点距离蓝牙点大于5米
                        if (currentToIbeacon > 5) {
                            console.log("free 当前点距离蓝牙点大于5米");
                            const mid = calcMidPoint(ibeaconPoint, currentPoint);
                            const point = {...this.currentPoint, longitude: mid[0], latitude: mid[1]};
                            this.updateFreeCurrentPoint(point);
                        }
                    }
                }
            } else {
                if (loc.polygonLon) {
                    // 质心点和当前位置距离大于5小于10
                    if (currentToPolygon > 5 && currentToPolygon < 10) {
                        console.log("free 质心点和当前位置距离大于5小于10");
                        const mid = calcMidPoint(polygonPoint, currentPoint);
                        const point = {...this.currentPoint, longitude: mid[0], latitude: mid[1]};
                        this.updateFreeCurrentPoint(point);
                    } else {
                        //  质心点和当前位置距离大于 10
                        if (currentToPolygon > 10) {
                            console.log("free 质心点和当前位置距离大于 10");
                            const point = {
                                ...this.currentPoint,
                                longitude: loc.polygonLon, latitude: loc.polygonLat
                            };
                            this.updateFreeCurrentPoint(point);
                        }
                    }
                }
            }
        };

        correctFreeLocateOutdoor = () => {
            if (this.correctFreeFlag) {
                return false;
            }
            const gpsCoords = this.loc.gpsCoords; // 当前点
            // const gpsPoint = [gpsCoords.longitude, gpsCoords.latitude];
            // const currentPoint = [this.currentPoint.longitude, this.currentPoint.latitude]; // 当前点
            // const currentToGps = calcDistanceFn(currentPoint, gpsPoint); // 当前点gps点距离
            // ios 12.5
            // android 8
            this.calcAccuracy(gpsCoords, this.updateFreeCurrentPoint);
        };


        // 导航模式
        startCorrectNavLocate() {
            console.log("entry 导航纠偏");
            this.countNum = 0;
            this.correctFreeLocateTimer = null;
            this.correctFreeLocateWatchId && clearTimeout(this.correctFreeLocateWatchId);
            this.correctNavLocateTimer = () => {
                this.correctNavLocateWatchId = setTimeout(() => {
                    this.correctNavLocateTimer && this.correctNavLocateTimer();
                    this.chooseNavCorrectMode(this.loc);
                }, 1000);
            };
            this.correctNavLocateTimer();
        }

        chooseNavCorrectMode = (loc) => {
            const locate = loc.currentPosition;
            const correctMode = {
                "ibeacon": this.correctNavLocateIndoor,
                "gps": this.correctNavLocateOutdoor
            }[this.loc.currentLocation];
            if ((this.loc.currentPosition.level == this.navEndLevel
                || this.handleData.crossStartLevel == this.loc.currentPosition.level
                || this.handleData.crossEndLevel == this.loc.currentPosition.level
                || this.loc.currentPosition.level == this.navStartLevel)
                && this.currentPoint.level != this.loc.currentPosition.level) {
                if (this.loc.currentPosition.level != this.navEndLevel) {
                    this.countNum++;
                    if (this.countNum >= 3) {
                        this.countNum = 0;
                        this.currentPoint = {...this.currentPoint, level: this.loc.currentPosition.level};
                    }
                } else {
                    this.currentPoint = {...this.currentPoint, level: this.loc.currentPosition.level};
                }
            }

            correctMode && correctMode(locate);
            // this.lastLocation = this.loc.currentLocation;
        };

        correctNavLocateIndoor = (loc) => {
            if (this.inElevator) {
                let distanceEl = 0;
                if (this.elEndPoint) {
                    const currentPoint = point([this.loc.currentPosition.longitude, this.loc.currentPosition.latitude]); // 当前点
                    distanceEl = distance(currentPoint, this.elEndPoint) * 1000;
                }
                if (loc.level == this.handleData.crossEndLevel || distanceEl > 10) {
                    this.inElevator = false;
                }
                return false;
            }
            if (this.correctNavFlag || loc.locType == "gps") {
                return false;
            }
            // 时间戳判断
            if (loc.timer == this.locTimer) {
                return false;
            }
            this.locTimer = loc.timer;

            const ibeaconPoint = [loc.longitude, loc.latitude]; // 蓝牙点
            const fiducialPoint = [loc.fiducialLon, loc.fiducialLat]; // 置信点
            const currentPoint = [this.currentPoint.longitude, this.currentPoint.latitude]; // 当前点
            const polygonPoint = [loc.polygonLon, loc.polygonLat]; // 质心点
            const ibeaconToFiducial = calcDistanceFn(fiducialPoint, ibeaconPoint); // 置信点蓝牙点距离
            const currentToIbeacon = calcDistanceFn(currentPoint, ibeaconPoint); // 当前点蓝牙点距离
            const currentToFiducial = calcDistanceFn(currentPoint, fiducialPoint); // 当前点蓝牙点距离
            const currentToPolygon = calcDistanceFn(currentPoint, polygonPoint); // 当前点质心点距离
            // let ibeaconToLine = 0;
            // let polygonToLine = 0;
            // if (this.currentRealNavLine) {
            //     // 蓝牙点至导航线
            //     ibeaconToLine = pointToLineDistance(point(ibeaconPoint), this.currentRealNavLine) * 1000;
            //     if (loc.polygonLon) {
            //         // 质心点至导航线
            //         polygonToLine = pointToLineDistance(point(polygonPoint), this.currentRealNavLine) * 1000;
            //         // console.log("loc", loc, polygonToLine);
            //     }
            // }
            // 存在置信点
            if (loc.fiducialLon) {
                // 置信点至蓝牙点小于3米
                if (ibeaconToFiducial < 3) {
                    // if (ibeaconToLine > 10) {
                    //     console.log("nav 蓝牙点导航线距离10米 偏航，", ibeaconToLine);
                    //     if (!this.notReplan) {
                    //         const point = {
                    //             ...this.currentPoint,
                    //             longitude: loc.longitude,
                    //             latitude: loc.latitude,
                    //             isYaw: true // 偏航
                    //         };
                    //         console.log("重新规划,上次定位,本次定位", this.lastLocation, this.loc.currentLocation);
                    //         this.updateNavCurrentPoint(point);
                    //         return false;
                    //     }
                    // }
                    // 当前点至蓝牙点大于2米
                    if (currentToIbeacon > 3) {
                        console.log("nav 当前点至蓝牙点大于3米", currentToIbeacon);
                        const point = {...this.currentPoint, longitude: loc.longitude, latitude: loc.latitude};
                        this.updateNavCurrentPoint(point);
                    }
                } else {
                    // 当前点距离置信点大于10米
                    if (currentToFiducial > 10) {
                        console.log("nav 当前点距离置信点大于10米", currentToFiducial);
                        const point = {...this.currentPoint, longitude: loc.fiducialLon, latitude: loc.fiducialLat};
                        this.updateNavCurrentPoint(point);
                    } else {
                        // 当前点距离蓝牙点大于5米
                        // if (currentToIbeacon > 5) {
                        //     console.log("nav 当前点距离蓝牙点大于5米");
                        //     const mid = calcMidPoint(ibeaconPoint, currentPoint);
                        //     const point = {...this.currentPoint, longitude: mid[0], latitude: mid[1]};
                        //     this.updateNavCurrentPoint(point);
                        // }
                    }
                }
            } else {
                // if (polygonToLine > 10) {
                //     console.log("nav 质心点导航线距离10米 偏航", polygonToLine);
                //     if (!this.notReplan) {
                //         const point = {
                //             ...this.currentPoint,
                //             longitude: loc.polygonLon,
                //             latitude: loc.polygonLat,
                //             isYaw: true // 偏航
                //         };
                //         console.log("重新规划,上次定位,本次定位", this.lastLocation, this.loc.currentLocation);
                //         this.updateNavCurrentPoint(point);
                //         return false;
                //     }
                // }
                if (loc.polygonLon) {
                    // 质心点和当前位置距离大于5小于10
                    if (currentToPolygon > 5 && currentToPolygon < 10) {
                        // console.log("nav 质心点和当前位置距离大于5小于10");
                        // const mid = calcMidPoint(polygonPoint, currentPoint);
                        // const point = {...this.currentPoint, longitude: mid[0], latitude: mid[1]};
                        // this.updateNavCurrentPoint(point);
                    } else {
                        //  质心点和当前位置距离大于 10
                        // if (currentToPolygon > 15) {
                        //     console.log("nav 质心点和当前位置距离大于 15", currentToPolygon);
                        //     const point = {
                        //         ...this.currentPoint,
                        //         longitude: loc.polygonLon, latitude: loc.polygonLat
                        //     };
                        //     this.updateNavCurrentPoint(point);
                        // }
                    }
                }
            }
        };

        correctNavLocateOutdoor = (loc) => {
            if (this.inElevator) {
                let distanceEl = 0;
                if (this.elEndPoint) {
                    const currentPoint = point([this.loc.currentPosition.longitude, this.loc.currentPosition.latitude]); // 当前点
                    distanceEl = distance(currentPoint, this.elEndPoint) * 1000;
                }
                if (loc.level == this.handleData.crossEndLevel || distanceEl > 10) {
                    this.inElevator = false;
                }
                return false;
            }
            if (this.correctNavOutdoorFlag || this.loc.currentLocation == "ibeacon" || this.correctNavFlag) {
                return false;
            }
            const gpsCoords = this.loc.gpsCoords; // 当前点
            // const gpsPoint = [gpsCoords.longitude, gpsCoords.latitude];
            // const currentPoint = [this.currentPoint.longitude, this.currentPoint.latitude]; // 当前点
            // let gpsToLine = null;
            this.calcAccuracy(gpsCoords, this.updateNavCurrentPointOutDoor);
            // if (gpsCoords.accuracy <= 25) {
            //     // if (this.currentRealNavLine) {
            //     //     gpsToLine = pointToLineDistance(point(gpsPoint), this.currentRealNavLine) * 1000;  // gps点至导航线
            //     //     // console.log("gps至线", gpsToLine);
            //     // }
            //     // if (gpsToLine && gpsToLine < 30) {
            //     const currentTogps = calcDistanceFn(gpsPoint, currentPoint);
            //     // console.log("当前点至gps", currentTogps);
            //     if (currentTogps > 10) {
            //         const point = {
            //             ...this.currentPoint,
            //             longitude: gpsCoords.longitude,
            //             latitude: gpsCoords.latitude
            //         };
            //         console.log("nav gps 定位点纠偏,当前点", point);
            //         this.updateNavCurrentPointOutDoor(point);
            //     }
            // }
        };

        calcAccuracy(data, fn) {
            let k1 = null;
            if (this.isIOS && data.accuracy < 40) {
                k1 = 12.5 / data.accuracy;
            }
            if (!this.isIOS && data.accuracy < 30) {
                k1 = 8 / data.accuracy;
            }
            if (k1) {
                if (k1 >= 1) {
                    const point = {
                        ...this.currentPoint,
                        longitude: data.longitude,
                        latitude: data.latitude
                    };
                    fn(point);
                } else {
                    const longitude = k1 * (data.longitude) + (1 - k1) * this.currentPoint.longitude;
                    const latitude = k1 * (data.latitude) + (1 - k1) * this.currentPoint.latitude;
                    const point = {
                        ...this.currentPoint,
                        longitude: longitude,
                        latitude: latitude
                    };
                    fn(point);
                }
            }
        }


        updateNavCurrentPoint(point) {
            this.correctNavFlag = true;
            this.currentPoint = point;
            if (point.isYaw) {
                console.log("完成点", point);
                this.navComplete(point);
                return false;
            }
            this.onRealNavStep(point);
            setTimeout(() => {
                this.correctNavFlag = false;
            }, 5000);
        }

        updateNavCurrentPointOutDoor = (point) => {
            this.correctNavOutdoorFlag = true;
            this.currentPoint = point;
            if (point.isYaw) {
                console.log("户外偏航");
                this.stopNav();
                this.navComplete(point);
                return false;
            }
            this.onRealNavStep(point);
            setTimeout(() => {
                this.correctNavOutdoorFlag = false;
            }, 4000);
        };
    };
};

export default correctLocateFn;
