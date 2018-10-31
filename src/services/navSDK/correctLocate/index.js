/**
 * Created by j_bleach on 2018/10/23 0023.
 */
import {calcDistanceFn, calcMidPoint} from "../utils";
import {pointToLineDistance, point} from "@turf/turf";

const correctLocateFn = (target) => {
    return class correctLocate extends target {
        constructor() {
            super();
        }

        // 自由模式
        startCorrectFreeLocate(loc) {
            console.log("entry 自由纠偏", this);
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

        updateFreeCurrentPoint(point) {
            this.correctFreeFlag = true;
            this.currentPoint = point;
            this.onFreeStep(point);
            setTimeout(() => {
                this.correctFreeFlag = false;
            }, 5000);
        }

        chooseFreeCorrectMode(loc) {
            const locate = loc.currentPosition;
            const correctMode = {
                "ibeacon": this.correctFreeLocateIndoor,
                "gps": this.correctFreeLocateOutdoor,
            }[locate.locType];
            correctMode(locate);
        }

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

        // 导航模式
        startCorrectNavLocate(loc) {
            console.log("entry 导航纠偏", this);
            this.correctFreeLocateTimer = null;
            this.correctFreeLocateWatchId && clearTimeout(this.correctFreeLocateWatchId);
            this.correctNavLocateTimer = () => {
                this.correctNavLocateWatchId = setTimeout(() => {
                    this.correctNavLocateTimer && this.correctNavLocateTimer();
                    this.chooseNavCorrectMode(loc);
                }, 5000);
            };
            this.correctNavLocateTimer();
        }

        chooseNavCorrectMode(loc) {
            const locate = loc.currentPosition;
            const correctMode = {
                "ibeacon": this.correctNavLocateIndoor,
                "gps": this.correctNavLocateOutdoor,
            }[this.currentPoint.locType];
            correctMode(locate);
        }

        correctNavLocateIndoor = (loc) => {
            if (this.correctNavFlag) {
                return false;
            }
            const ibeaconPoint = [loc.longitude, loc.latitude]; // 蓝牙点
            const fiducialPoint = [loc.fiducialLon, loc.fiducialLat]; // 置信点
            const currentPoint = [this.currentPoint.longitude, this.currentPoint.latitude]; // 当前点
            const polygonPoint = [loc.polygonLon, loc.polygonLat]; // 质心点
            const ibeaconToFiducial = calcDistanceFn(fiducialPoint, ibeaconPoint); // 置信点蓝牙点距离
            const currentToIbeacon = calcDistanceFn(currentPoint, ibeaconPoint); // 当前点蓝牙点距离
            const currentToFiducial = calcDistanceFn(currentPoint, fiducialPoint); // 当前点蓝牙点距离
            const currentToPolygon = calcDistanceFn(currentPoint, polygonPoint); // 当前点质心点距离
            let ibeaconToLine = 0;
            let polygonToLine = 0;
            if (this.currentRealNavLine) {
                ibeaconToLine = pointToLineDistance(point(ibeaconPoint), this.currentRealNavLine) * 1000;  // 蓝牙点至导航线
                polygonToLine = pointToLineDistance(point(polygonPoint), this.currentRealNavLine) * 1000;  // 质心点至导航线
            }
            // 存在置信点
            if (loc.fiducialLon) {
                // 置信点至蓝牙点小于3米
                if (ibeaconToFiducial < 3) {
                    if (ibeaconToLine > 10) {
                        console.log("nav 蓝牙点导航线距离10米");
                        const point = {
                            ...this.currentPoint,
                            longitude: loc.longitude,
                            latitude: loc.latitude,
                            isYaw: true // 偏航
                        };
                        this.updateNavCurrentPoint(point);
                    }
                    // 当前点至蓝牙点大于2米
                    if (currentToIbeacon > 2) {
                        console.log("nav 当前点至蓝牙点大于2米");
                        const point = {...this.currentPoint, longitude: loc.longitude, latitude: loc.latitude};
                        this.updateNavCurrentPoint(point);
                    }
                } else {
                    // 当前点距离置信点大于10米
                    if (currentToFiducial > 10) {
                        console.log("nav 当前点距离置信点大于10米");
                        const point = {...this.currentPoint, longitude: loc.fiducialLon, latitude: loc.fiducialLat};
                        this.updateNavCurrentPoint(point);
                    } else {
                        // 当前点距离蓝牙点大于5米
                        if (currentToIbeacon > 5) {
                            console.log("nav 当前点距离蓝牙点大于5米");
                            const mid = calcMidPoint(ibeaconPoint, currentPoint);
                            const point = {...this.currentPoint, longitude: mid[0], latitude: mid[1]};
                            this.updateNavCurrentPoint(point);
                        }
                    }
                }
            } else {
                if (polygonToLine > 10) {
                    console.log("nav 质心点导航线距离10米");
                    const point = {
                        ...this.currentPoint,
                        longitude: loc.polygonLon,
                        latitude: loc.polygonLat,
                        isYaw: true // 偏航
                    };
                    this.updateNavCurrentPoint(point);
                }
                if (loc.polygonLon) {
                    // 质心点和当前位置距离大于5小于10
                    if (currentToPolygon > 5 && currentToPolygon < 10) {
                        console.log("nav 质心点和当前位置距离大于5小于10");
                        const mid = calcMidPoint(polygonPoint, currentPoint);
                        const point = {...this.currentPoint, longitude: mid[0], latitude: mid[1]};
                        this.updateNavCurrentPoint(point);
                    } else {
                        //  质心点和当前位置距离大于 10
                        if (currentToPolygon > 10) {
                            console.log("nav 质心点和当前位置距离大于 10");
                            const point = {
                                ...this.currentPoint,
                                longitude: loc.polygonLon, latitude: loc.polygonLat
                            };
                            this.updateNavCurrentPoint(point);
                        }
                    }
                }
            }
        };

        updateNavCurrentPoint(point) {
            this.correctNavFlag = true;
            this.currentPoint = point;
            this.onRealNavStep(point);
            setTimeout(() => {
                this.correctNavFlag = false;
            }, 5000);
        }


    };
};

export default correctLocateFn;