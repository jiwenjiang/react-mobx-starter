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

    init({
             timeout,
             locType,
             complete = () => {
             },
             error = () => {
             }
         }) {
        this.timeout = timeout; // 超时时间
        this.locType = locType; // 定位类型
        this.initComplete = complete; // 初始化成功函数
        this.initError = error; // 初始化失败函数
        locType && locType.includes("gps") && this.checkGPS();
        locType && locType.includes("ibeacon") && this.getSignature();
    }

    initSuccess() {
        if (!(this.locType.includes("ibeacon") && !this.initIbeacon || this.locType.includes("gps") && !this.initGps)) {
            this.initComplete();
        }
    }

    startLocation(
        startLocationComplete = () => {
        },
        startLocationError = () => {
        }
    ) {
        this.startLocationComplete = startLocationComplete;
        this.startLocationError = startLocationError;
        this.startIbeaconSearch();
        this.startGpsSearch();
    }

    startSuccess() {
        // console.log("start succ");
        // console.log(this.gpsCoords);
    }
}

export default new Loc();