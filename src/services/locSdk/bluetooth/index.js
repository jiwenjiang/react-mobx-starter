/**
 * Created by j_bleach on 2018/10/16 0016.
 */

const INTERVAL = 500; // 服务器时间间隔
const POINTLENTH = 3; // 质心点计算数组长度
const ANDROID_CHANGE_GPS = 5000; // android搜索不到蓝牙5000ms后，切换gps
const IOS_CHANGE_GPS = 5000; // ios搜索不到蓝牙3000ms后，切换gps
const LAST_IBEACON = 30000; // 搜索不到蓝牙30s后,重置上一个蓝牙点

const blueToothFn = (target) => {
    // const signUrl = `https://gisgd.scu.edu.cn/wxConfig/weixin/v1/jsSdkSign`;
    const signUrl = `https://xz.parkbobo.com/wxConfig/weixin/v1/jsSdkSign`;
    // const signUrl = `https://gisapp.swun.edu.cn/wxConfig/weixin/v1/jsSdkSign`;
    const getIbeaconUrl = `https://map.parkbobo.com/location/weka/v1/classify`;// map
    // const getIbeaconUrl = `https://gismp.scu.edu.cn/location/weka/v1/classify`;// map
    // const getIbeaconUrl = `https://gl.swun.edu.cn/location/weka/v1/classify`;

    // const deviceUrl = `https://xz.parkbobo.com/location/device/v1/getAll`;
    let phoneType = "ios";
    let ibeaconArr = []; // 蓝牙地位点集合
    let gpsTimeId = null; // gps定时器标记
    let lastIbeaconTimeId = null; // gps定时器标记(30s)
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
        phoneType = `ios`;
    } else if (/android/.test(ua)) {
        phoneType = `android`;
    }
    return class bluetooth extends target {
        constructor() {
            super();
        }

        getSignature() {
            const signBody = `url=${encodeURIComponent(window.location.href.split("#")[0])}&mapId=${this.mapId}`;
            // const deviceBody = `mapId=${this.mapId}&isElevator=1`;
            // 注销页面，停止微信
            window.onunload = () => {
                this.wx.stopSearchBeacons();
            };
            // 请求签名
            fetch(signUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: signBody
            }).then((response) => response.json()).then((data) => {
                this.configWx(data.data);
                this.initIbeacon = true;
                this.initSuccess();
            }).catch((err) => {
                this.initError(err);
            });

            // fetch(deviceUrl, {
            //     method: "PUT",
            //     headers: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //     },
            //     body: deviceBody
            // }).then((response) => response.json()).then((data) => {
            //     const arr = data.data;
            //     this.elevators = arr && arr.map(v => v.device);
            // }).catch((err) => {
            //     this.initError(err);
            // });
        }

        // 配置微信
        configWx(sign) {
            this.wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: sign.appid, // 必填，公众号的唯一标识
                timestamp: sign.timestamp, // 必填，生成签名的时间戳
                nonceStr: sign.nonceStr, // 必填，生成签名的随机串
                signature: sign.signature,// 必填，签名
                beta: true,   //用于在页面加载之初调用JSAPI
                jsApiList: ["openWXDeviceLib", "closeWXDeviceLib",
                    "onWXDeviceBluetoothStateChange", "startSearchBeacons",
                    "stopSearchBeacons", "onSearchBeacons", "startRecord", "stopRecord",
                    "translateVoice", "onMenuShareAppMessage", "getLocation",
                    "openBluetoothAdapter", "onBeaconServiceChange", "onWXDeviceBluetoothStateChange",
                    "getBluetoothAdapterState", "onBluetoothAdapterStateChange"] // 必填，需要使用的JS接口列表
            });
            this.wx.error((res) => {
                this.initError(res);
            });
        }

        stopIbeaconSearch() {
            this.wx.stopSearchBeacons({
                complete: () => {
                    console.log("停止蓝牙");
                    this.stopLocationComplete({code: 0, msg: "蓝牙停止"});
                }
            });
        }

        /**
         * @author j_bleach
         * @date 2018-10-16
         * @Description: 开始搜索
         */
        startIbeaconSearch() {
            console.log("进入蓝牙");
            this.wx.ready(() => {
                let time = 0;
                let flag = false;
                let timeId = void 0;
                window.addEventListener("devicemotion", () => {
                    if (Date.now() - time >= 300) {
                        time = Date.now();
                        if (false === flag) {
                            this.wx.stopSearchBeacons({
                                complete: () => {
                                    console.log("启动蓝牙搜索");
                                    ibeaconArr = [];
                                    this.searchIbeacon();
                                },
                                fail: (err) => {
                                    console.log("stop fail", err);
                                }
                            });
                        }
                        flag = true;
                        timeId && clearTimeout(timeId);
                        timeId = setTimeout(() => {
                            flag = false;
                            this.wx.stopSearchBeacons();
                        }, 500);
                    }
                });

                if (!this.initGps) {
                    this.onSearchBeaconsWithGps();
                } else {
                    this.onSearchBeaconsWithGps();
                }
            });
        }

        /**
         * @author j_bleach
         * @date 2018-10-16
         * @Description: 搜索蓝牙点
         */
        searchIbeacon() {
            this.wx.startSearchBeacons({
                ticket: "",
                complete: (t) => {
                    this.startSuccess({code: 0, msg: `室内定位启动，${t.errMsg}`});
                    let n = t.errMsg;
                    if ("startSearchBeacons:already started" === n) {
                        return this.wx.stopSearchBeacons(() => {
                            this.searchIbeacon();
                        });
                    }
                    if ("startSearchBeacons:system unsupported" === n) {
                        this.searchIbeacon();
                    }
                    "startSearchBeacons:bluetooth power off" === n
                        ? this.startLocationError("蓝牙未打开")
                        : "startSearchBeacons:location service disable" === n && this.startLocationError("地理位置服务未打开");
                },
                fail: (t) => {
                    console.log("sdk-开启失败", t);
                }
            });
        }

        /**
         * @author j_bleach
         * @date 2018-10-17
         * @Description: 监听蓝牙点
         */
        onSearchBeacons() {
            this.wx.onSearchBeacons({ //监听iBeacon设备更新事件
                complete: (data) => {
                    this.getIbeaconPoints(data);
                }
            });
        }

        /**
         * @author j_bleach
         * @date 2018-10-18
         * @Description: 监听蓝牙点（超时切换gps）
         */
        onSearchBeaconsWithGps() {
            console.log("进入蓝牙定时搜索");
            this.wx.onSearchBeacons({ //监听iBeacon设备更新事件
                complete: (data) => {
                    const rssi = this.gpsCoords && this.gpsCoords.accuracy <= 25 ? -80 : -90;
                    data.beacons = data.beacons && data.beacons.filter(v => (v.rssi != 0 && v.rssi > rssi));
                    if (data.beacons && data.beacons.length > 0) {
                        // console.log("搜索到有效蓝牙", rssi);
                        this.currentLocation = "ibeacon";
                        this.getIbeaconPoints(data);
                        gpsTimeId && clearTimeout(gpsTimeId);
                        gpsTimeId = setTimeout(() => {
                            ibeaconArr = [];
                            this.currentLocation = "gps";
                        }, this.isIOS ? IOS_CHANGE_GPS : ANDROID_CHANGE_GPS);
                    }
                },
                fail: (err) => {
                    console.log("蓝牙扫描失败", err);
                }
            });
        }

        /**
         * @author j_bleach
         * @date 2018-10-17
         * @Description: 获取蓝牙点
         */
        getIbeaconPoints(data) {
            let filterData = data.beacons && data.beacons
                .map(v => {
                    return {rssi: ~~Number(v.rssi), device: `${v.major}_${v.minor}`};
                });
            if (filterData.length === 0) {
                // this.onSuccess();
            } else {
                filterData = JSON.stringify([filterData]);
                const getIbeaconBody = `mapId=${this.mapId}&datajson=${filterData}
            &interval=${INTERVAL}&type=wx_${phoneType}`;
                // console.log("请求", getIbeaconBody);
                fetch(getIbeaconUrl, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: getIbeaconBody
                }).then((response) => response.json()).then((data) => {
                    if (data.code == 0) {
                        const res = data.data;
                        // console.log(res);
                        const Polygon = this.setPolygonLocation(res);
                        const ibeaconObj = {
                            isOutdoor: 0,
                            longitude: res.lon,
                            latitude: res.lat,
                            buildingId: res.building,
                            level: res.level,
                            fiducialLat: res.fiducialLat,
                            fiducialLon: res.fiducialLon,
                            locType: "ibeacon",
                            timer: new Date().getTime(),
                            ...Polygon
                        };
                        lastIbeaconTimeId && clearTimeout(lastIbeaconTimeId);
                        lastIbeaconTimeId = setTimeout(() => {
                            this.ibeaconCoords = null;
                        }, LAST_IBEACON);
                        this.onSuccessIbeacon(ibeaconObj);
                    }
                }).catch((err) => {
                    // this.initError(err);
                    console.log("失败", err);
                });
            }
        }

        /**
         * @author j_bleach
         * @date 2018-10-17
         * @Description: 计算质心点
         * @param data:array
         * @return Polygon:obj
         */
        setPolygonLocation(data) {
            if (ibeaconArr.length < POINTLENTH) {
                ibeaconArr.push(data);
                return {
                    polygonLon: 0,
                    polygonLat: 0
                };
            } else {
                ibeaconArr.push(data);
                const inputArr = ibeaconArr && ibeaconArr.map((v, i) => {
                    return {...v, timestamp: new Date().getTime() + i * 2000};
                });
                const polygonLocation = this.polygonV2(inputArr);
                ibeaconArr.shift();
                return polygonLocation;
            }
        }

        /**
         * @author j_bleach
         * @date 2018-08-23
         * @Description: 更新质心点算法 polygonV2
         * @param points:Array
         */
        polygonV2(points) {
            let m = 0, x = 0, y = 0;
            for (let i = 0; i < points.length; i++) {
                m += points[i].timestamp;
                x += (points[i].lon * points[i].timestamp);
                y += (points[i].lat * points[i].timestamp);
            }
            return {polygonLon: x / m, polygonLat: y / m};
        }
    };
};

export default blueToothFn;
