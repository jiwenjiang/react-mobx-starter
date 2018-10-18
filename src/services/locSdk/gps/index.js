/**
 * Created by j_bleach on 2018/10/16 0016.
 */
/*eslint-disable*/
const gpsFn = (target) => {
    return class gps extends target {
        static gpsWatchId = null;

        constructor() {
            super();
        }

        checkGPS() {
            if ("geolocation" in navigator) {
                /* 地理位置服务可用 */
                this.initGps = true;
                this.initSuccess();
            } else {
                /* 地理位置服务不可用 */
            }
        }

        geo_success = (res) => {
            this.startSuccess({code: 1, msg: "gps定位启动"});
            const data = res.coords;
            const gpsObj = {
                isOutdoor: 1,
                longitude: data.longitude,
                latitude: data.latitude,
                accuracy: data.accuracy,
                locType: "gps",
                timestamp: res.timestamp
            };
            console.log("gps", res);
            this.onSuccessGps(gpsObj);
        };

        static geo_error(err) {
            throw err;
        }

        startGpsSearch() {
            console.log("jinru gps");
            gps.gpsWatchId = navigator.geolocation.watchPosition(this.geo_success, gps.geo_error, {
                enableHighAccuracy: true
            });
        }

        stopGpsSearch() {
            console.log("qingchu");
            navigator.geolocation.clearWatch(gps.gpsWatchId);
            this.stopLocationComplete({code: 1, msg: "gps定位停止"});
        }
    };
};

export default gpsFn;