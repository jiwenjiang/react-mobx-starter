/**
 * Created by j_bleach on 2018/10/23 0023.
 */
import {destination} from "@turf/turf";
/*eslint-disable*/
const stepperFn = (target) => {
    let h = [.003, .556, 1.083, 1.492, 1.682, 1.56, 1.102, .394, -.382, -1.018, -1.378, -1.445, -1.3, -1.053, -.78, -.489]
        , g = 0
        , m = 0
        , v = 0
        , C = false
        , b = Array(16)
        , yy = true
        , w = Date.now()
        , B = 0
        , x = 0
        , y = 0
        , z = 0
        , E = 0
        , S = Date.now()
        , O = void 0
        , T = 0
        , M = 0
        , R = 0
        , I = 0
        , stepDistance = 0
        , totalDistance = 0
    ;
    let sampleCount = 0,
        saveTime = Date.now(),
        saveTotalAcc = 0;
    let timer = null;


    return class stepper extends target {
        constructor() {
            super();
        }

        initStepper(loc) {
            // 重置当前位置至质心点
            this.initPolygonLocate = setInterval(() => {
                if (loc.currentPosition.locType === "ibeacon") {
                    if (loc.currentPosition.polygonLon) {
                        this.currentPoint = {
                            isOutdoor: loc.currentPosition.isOutdoor,
                            buildingId: loc.currentPosition.buildingId,
                            level: loc.currentPosition.level,
                            locType: loc.currentPosition.locType,
                            orientation: this.alpha,
                            longitude: loc.currentPosition.polygonLon,
                            latitude: loc.currentPosition.polygonLat
                        };
                        clearInterval(this.initPolygonLocate);
                        this.onFreeStep(this.currentPoint);
                    }
                } else {
                    clearInterval(this.initPolygonLocate);
                }
            }, 500);
            // 步进器
            window.addEventListener("devicemotion", (e) => {
                    let n = e.accelerationIncludingGravity;
                    this.checkInAccSensor(n.x, n.y, n.z);
                    this.handleMessage();
            }, false);
        }

        stepAlgorithm() {
            let t = false;
            if (yy) {
                if (m > 9) {
                    yy = false;
                    t = true;
                }
            } else {
                if (m < -9) {
                    yy = true;
                    t = true;
                }
            }
            if (t && 0 !== (v += .5) && v !== B) {
                O = Date.now();
                T = 1000 / (O - S);
                M = 2.4 * (1.8 * (20.5 * T - 0.265487) - 5.84071 + 0);
                R += M;
                B = v;
                S = O;
                C = !0;
                w = Date.now();
                I = M / 100 * T;
                stepDistance = M;
                this.step(v, M);
            }
        }

        //计算结果
        step(v, M) {
            totalDistance = totalDistance + M;
            let stepDistance = window.parseFloat(M / 1000 / 1000);
            // console.log("当前角度", this.alpha);
            const output = destination([this.currentPoint.longitude, this.currentPoint.latitude],
                stepDistance, this.alpha);
            this.currentPoint = {
                isOutdoor: this.loc.currentPosition.isOutdoor,
                buildingId: this.currentPoint.buildingId,
                level: this.loc.currentPosition.level,
                locType: this.loc.currentPosition.locType,
                orientation: this.alpha,
                longitude: output.geometry.coordinates[0],
                latitude: output.geometry.coordinates[1]
            };
            // console.log("当前定位模式", this.loc.currentLocation);
            this.currentMode == "free" && this.onFreeStep(this.currentPoint);
            this.currentMode == "realNav" && this.onRealNavStep(this.currentPoint);
            this.initPolygonLocate && clearInterval(this.initPolygonLocate);
        }

        machine(t) {
            if (16 === g) {
                g = 0;
            }
            b[g] = t;
            for (var e = g, n = 0, r = 0; r < 16; r++) {
                n += h[r] * (b[e] || 0);
                if (-1 === --e) {
                    e = 15;
                }
            }
            g++,
                m = n,
                this.stepAlgorithm();
            return m;
        }

        checkInAccSensor(t, e, n) {
            x += t,
                y += e,
                z += n,
                E++;
        }

        r(t) {
            return t * t;
        }


        sleep(sleTime) {
            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(() => {
                this.handleMessage();
            }, sleTime || 0);
        }

        handleMessage() {
            let sleTime = 0, e = 0;
            if (0 == E) {
                e = saveTotalAcc;
            } else {
                e = this.r(x / E) + this.r(y / E) + this.r(z / E);
                e = Math.pow(e, .5);
                x = 0;
                y = 0;
                z = 0;
                E = 0;
                saveTotalAcc = e;

                for (this.machine(e - 9.8); ;) {
                    if ((sleTime = 40 * +saveTime - Date.now()) > 10) {
                        break;
                    }
                    if (sleTime < -1000) {
                        saveTime = Date.now(),
                            sampleCount = 0;
                        break;
                    }
                    this.machine(e - 9.8),
                        sampleCount++;
                }

                this.sleep(sleTime - 5);
            }

        }
    };
};

export default stepperFn;
