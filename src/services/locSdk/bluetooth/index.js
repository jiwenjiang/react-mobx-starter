/**
 * Created by j_bleach on 2018/10/16 0016.
 */
/*eslint-disable*/

import wx from "weixin-js-sdk";


const blueToothFn = (target) => {
    const signUrl = `https://map.parkbobo.com/location/weixin/v1/jsSdkSign`;
    const body = `url=${encodeURIComponent(window.location.href.split("#")[0])}`;
    return class bluetooth extends target {
        constructor() {
            super();
        }

        getSignature() {
            // 注销页面，停止微信
            window.onunload = () => {
                wx.stopSearchBeacons();
            };
            // 请求签名
            fetch(signUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body
            }).then((response) => response.json()).then((data) => {
                this.configWx(data.data);
                this.initIbeacon = true;
                this.initSuccess();
            }).catch((err) => {
                this.initError(err);
            });
        }

        // 配置微信
        configWx(sign) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: sign.appid, // 必填，公众号的唯一标识
                timestamp: sign.timestamp, // 必填，生成签名的时间戳
                nonceStr: sign.nonceStr, // 必填，生成签名的随机串
                signature: sign.signature,// 必填，签名
                beta: true,   //用于在页面加载之初调用JSAPI
                jsApiList: ["openWXDeviceLib", "closeWXDeviceLib",
                    "onWXDeviceBluetoothStateChange", "startSearchBeacons",
                    "stopSearchBeacons", "onSearchBeacons", "startRecord", "stopRecord",
                    "translateVoice", "onMenuShareAppMessage", "getLocation"] // 必填，需要使用的JS接口列表
            });
            wx.error((res) => {
                this.initError(res);
            });
        }

        stopIbeaconSearch() {
            wx.stopSearchBeacons();
        }

        /**
         * @author j_bleach
         * @date 2018-10-16
         * @Description: 开始搜索
         * @param name:String
         * @return name:String
        */
        startIbeaconSearch() {
            let t = Date.now();
            let l = !1;
            let c = void 0;
            window.addEventListener("devicemotion", () => {
                Date.now() - t < 80 || (t = Date.now(),
                !1 === l && wx.stopSearchBeacons({
                    complete: () => {
                        this.searchIbeacon();
                    }
                }),
                    l = !0,
                c && clearTimeout(c),
                    c = setTimeout(() => {
                        l = !1,
                            wx.stopSearchBeacons();
                    }, 500));
            });
        }

        /**
         * @author j_bleach
         * @date 2018-10-16
         * @Description: 搜索蓝牙点
         * @param name:String
         * @return name:String
        */
        searchIbeacon() {
            wx.startSearchBeacons({
                ticket: "",
                complete: (t) => {
                    let n = t.errMsg;
                    if ("startSearchBeacons:already started" === n) {
                        return wx.stopSearchBeacons(() => {
                            this.searchIbeacon();
                        });
                    }
                    if ("startSearchBeacons:system unsupported" === n) {
                        this.searchIbeacon();
                    }
                    "startSearchBeacons:bluetooth power off" === n
                        ? this.startLocationError("蓝牙未打开，请打开蓝牙后，重新打开页面")
                        : "startSearchBeacons:location service disable" === n && this.startLocationError("地理位置服务未打开");
                }
            });
        }

        onSearchBeacons() {
            const ua = navigator.userAgent.toLowerCase();
            let type = "ios";
            if (/iphone|ipad|ipod/.test(ua)) {
                type = `ios`;
            } else if (/android/.test(ua)) {
                type = `android`;
            }
            window.wx.onSearchBeacons({ //监听iBeacon设备更新事件
                complete: (argv) => {
                    console.log(argv);
                }
            });
        }
    };
};

export default blueToothFn;