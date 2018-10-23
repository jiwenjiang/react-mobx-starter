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

        initStepper() {
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
            let stepDistance = window.parseFloat(M / 1000).toFixed(3);
            // console.log("当前步长", stepDistance);
            // console.log("当前角度", this.alpha);
            const output = destination([this.currentPoint.longitude, this.currentPoint.latitude],
                stepDistance, this.alpha, {units: "miles"});
            this.currentPoint = {
                ...this.currentPoint,
                longitude: output.geometry.coordinates[0],
                latitude: output.geometry.coordinates[1]
            };
            this.onFreeStep(this.currentPoint);
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

            timer = setTimeout(function () {
                handleMessage();
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