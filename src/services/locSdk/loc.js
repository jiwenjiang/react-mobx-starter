/**
 * Created by j_bleach on 2018/10/16 0016.
 */
/*eslint-disable*/
import bluetooth from "./bluetooth";
import gps from "./gps";

@gps
@bluetooth
class Loc {
    /**
     * @author j_bleach
     * @date 2018-10-15
     * @Description: 定位初始化
     * @param timeout:number 超时时间，默认无穷大
     * @param locType:string[] 定位类型
     * @param complete:fn 成功回调
     * @param error:fn 失败回调
     * @return void
     */
    initIbeacon = false;
    initGps = false;
    ibeaconCoords = null;
    gpsCoords = null;
    locType = [];
    currentPosition = null;
    currentLocation = "gps";


    init({
             timeout,
             locType,
             mapId,
             complete = () => {
             },
             error = () => {
             }
         }) {
        console.log("开始定位");
        this.mapId = mapId;
        this.timeout = timeout; // 超时时间
        this.locType = locType; // 定位类型
        this.initComplete = complete; // 初始化成功函数
        this.initError = error; // 初始化失败函数
        // locType && locType.includes("gps") && this.checkGPS();
        locType && locType.includes("ibeacon") && this.getSignature();
    }

    initSuccess() {
        if (this.locType.includes("ibeacon") && this.initIbeacon) {
            this.initComplete();
        }
    }

    // 开启定位
    startLocation({
                      complete = () => {
                      },
                      error = () => {
                      }
                  }) {
        this.startLocationComplete = complete;
        this.startLocationError = error;
        this.locType && this.locType.includes("gps") && this.startGpsSearch();
        this.locType && this.locType.includes("ibeacon") && this.startIbeaconSearch();
    }

    // 开启成功
    startSuccess(response) {
        this.startLocationComplete(response);
    }

    // 停止定位
    stopLocation(
        {
            complete = () => {
            },
            error = () => {
            }
        }
    ) {
        this.stopLocationComplete = complete;
        this.locType && this.locType.includes("gps") && this.stopGpsSearch();
        this.locType && this.locType.includes("ibeacon") && this.stopIbeaconSearch();
    }

    // 监听定位
    onLocation(
        {
            complete = () => {
            },
            error = () => {
            }
        }
    ) {
        this.onLocationComplete = complete;
    }

    onSuccessGps(data) {
        this.gpsCoords = data;
        if (this.currentLocation !== "ibeacon") {
            this.onLocationComplete(this.gpsCoords);
            this.currentPosition = data;
        }
    }

    onSuccessIbeacon(data) {
        this.ibeaconCoords = data;
        this.currentPosition = data;
        this.onLocationComplete(this.ibeaconCoords, this);
    }
}

export default new Loc();
