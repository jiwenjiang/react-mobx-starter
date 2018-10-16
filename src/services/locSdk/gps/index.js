/**
 * Created by j_bleach on 2018/10/16 0016.
 */
/*eslint-disable*/
const gpsFn = (target) => {
    return class gps extends target {
        static gpsWatchId = null;

        checkGPS() {
            if ("geolocation" in navigator) {
                /* 地理位置服务可用 */
                this.initGps = true;
                this.initSuccess();
            } else {
                /* 地理位置服务不可用 */
            }
        }

        geo_success(data) {
            // console.log(data);
            this.gpsCoords = data.coords;
            this.startSuccess();
        }

        static geo_error(err) {
            throw err;
        }

        startGpsSearch() {
            gps.gpsWatchId = navigator.geolocation.watchPosition(gps.geo_success, gps.geo_error, {
                enableHighAccuracy: true,
                timeout: this.timeout
            });
        }
    };
};

export default gpsFn;