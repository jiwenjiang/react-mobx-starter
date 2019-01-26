/*eslint-disable*/
import {Matrix, Calc} from "./gMatrix";

class Kalman {
    constructor() {
        this.Q = new Matrix(4, 4, 0);
        this.F = new Matrix(4, 4, 0);
        this.P = new Matrix(4, 4, 0);
        this.P.value(1, 1, 0.1);
        this.P.value(2, 2, 0.1);
        this.P.value(3, 3, 0.1);
        this.P.value(4, 4, 0.1);

        this.H = new Matrix(2, 4);
        this.R = new Matrix(2, 2);

        this.x_hat = new Matrix(1, 4, 0);
        this.x_hat = Calc.transposition(this.x_hat);
        //初始速度 0.1
        this.x_hat.value(3, 1, 0.000001);
        this.x_hat.value(4, 1, 0.000001);


        this.Z = new Matrix(1, 2, 0);

        this.P_temp = null;
        this.K = null;

        this.E = new Matrix(4, 4, 0);
        this.E.value(1, 1, 1);
        this.E.value(2, 2, 1);
        this.E.value(3, 3, 1);
        this.E.value(4, 4, 1);
    }

    T = 0.5; //T为时间间隔，我这里设的是0.5S

    // static pushiBeacon(d) {
    //     if (typeof d === "object")
    //         iBeacon = d;
    // }
    //
    // static pushFiducial(d) {
    //     if (typeof d === "object")
    //         fiducial = d;
    // }
    //
    // static pushStepper(d) {
    //     if (typeof d === "object")
    //         stepper = d;
    // }

    init() {
        this.x_hat.value(3, 1, 0);
        this.x_hat.value(4, 1, 0);
    }

    updateLocation(curr, lastLocation) {
        // console.log("滤波", curr, lastLocation);
        // from && console.log("updateLocation from:", from);
        const {longitude, latitude} = lastLocation;
        // let longitude = 0, latitude = 0;
        // console.log(444444444, lon, lat);
        if (!curr || !curr[0] || !curr[1]) {
            return;
        }
        this.Z.value(1, 1, curr[0]);
        this.Z.value(1, 2, curr[1]);
        // iBeacon = null;
        // fiducial = null;

        let lon2 = longitude + this.x_hat.value(3, 1) * this.T;
        let lat2 = latitude + this.x_hat.value(4, 1) * this.T;
        this.x_hat.value(1, 1, lon2);
        this.x_hat.value(2, 1, lat2);

        this.Q.value(1, 1, 0.0000000001);
        this.Q.value(2, 2, 0.0000000001);
        this.Q.value(3, 3, 0.00000095 * 0.00000095);
        this.Q.value(4, 4, 0.00000085 * 0.00000085);
        this.F.value(1, 1, 1);
        this.F.value(1, 3, this.T);
        this.F.value(2, 2, 1);
        this.F.value(2, 4, this.T);
        this.F.value(3, 3, 1);
        this.F.value(4, 4, 1);

        this.P_temp = Calc.multiplicative(this.F, this.P);
        this.P_temp = Calc.multiplicative(this.P_temp, Calc.transposition(this.F));
        this.P_temp = Calc.additive(this.P_temp, this.Q);
        this.H.value(1, 1, 1);
        this.H.value(2, 2, 1);
        this.R.value(1, 1, 0.000001 * 0.000001);
        this.R.value(2, 2, 0.000001 * 0.000001);

        let temp0 = Calc.multiplicative(this.P_temp, Calc.transposition(this.H));
        let temp1 = Calc.multiplicative(this.H, this.P_temp);
        temp1 = Calc.multiplicative(temp1, Calc.transposition(this.H));
        temp1 = Calc.additive(temp1, this.R);
        temp1 = Calc.inverse(temp1);
        this.K = Calc.multiplicative(temp0, temp1);

        //x_hat=x_hat+K*(Z'-H*x_hat);
        let temp2 = Calc.multiplicative(this.H, this.x_hat);
        temp2 = Calc.subtractive(Calc.transposition(this.Z), temp2);
        temp2 = Calc.multiplicative(this.K, temp2);

        this.x_hat = Calc.additive(this.x_hat, temp2);

        //P=(eye(4)-K*H)*P_temp;//eye(4)为4行4列的单位矩阵，对角线上的元素都为1.
        let temp3 = Calc.multiplicative(this.K, this.H);
        temp3 = Calc.subtractive(this.E, temp3);
        this.P = Calc.multiplicative(temp3, this.P_temp);
        //X1=x_hat;


        let x = this.x_hat.value(1, 1);
        let y = this.x_hat.value(2, 1);


        //  平滑
        // this.history 当前时刻及之前2个点
        // if (!this.history.length) {
        //     this.history.push(JSON.parse(JSON.stringify(this.x_hat)));
        //     this.history.push(JSON.parse(JSON.stringify(this.x_hat)));
        // }
        // let a = new Matrix(4, 1), b = new Matrix(4, 1);
        // a = Calc.additive(this.history[0], a);
        // b = Calc.additive(this.history[1], b);
        // if (window.useStepper) {
        //     x = 0.1 * (b.value(1, 1) + b.value(3, 1) * this.T ) + 0.9 * this.x_hat.value(1, 1);
        //     y = 0.1 * (b.value(2, 1) + b.value(4, 1) * this.T ) + 0.9 * this.x_hat.value(2, 1);
        //     let tempX = 2 * b.value(1, 1) - a.value(1, 1);
        //     let tempY = 2 * b.value(2, 1) - a.value(2, 1);
        //
        //     x = 0.7 * tempX + 0.3 * x;
        //     y = 0.7 * tempY + 0.3 * y;
        // }
        // this.x_hat.value(1, 1, x);
        // this.x_hat.value(2, 1, y);
        //
        // this.history.shift();
        // this.history.push(JSON.parse(JSON.stringify(this.x_hat)));

        //
        return {longitude: x, latitude: y, speedX: this.x_hat.value(3, 1), speedY: this.x_hat.value(4, 1)};
    }

    /**根据权重计算经纬度*/
    // static weighting() {
    //     if (iBeacon && fiducial && stepper) {
    //         return [
    //             iBeacon[0] * 0.1 + fiducial[0] * 0.4 + stepper[0] * 0.5,
    //             iBeacon[1] * 0.1 + fiducial[1] * 0.4 + stepper[1] * 0.5
    //         ];
    //     } else if (iBeacon && fiducial) {
    //         return [
    //             iBeacon[0] * 0.3 + fiducial[0] * 0.7,
    //             iBeacon[1] * 0.3 + fiducial[1] * 0.7
    //         ];
    //     } else if (iBeacon && stepper) {
    //         return [
    //             iBeacon[0] * 0.2 + stepper[0] * 0.8,
    //             iBeacon[1] * 0.2 + stepper[1] * 0.8
    //         ];
    //     } else if (stepper && fiducial) {
    //         return [
    //             fiducial[0] * 0.5 + stepper[0] * 0.5,
    //             fiducial[1] * 0.5 + stepper[1] * 0.5
    //         ];
    //     } else {
    //         return [].concat(iBeacon || fiducial || stepper);
    //     }
    // }
}


export default Kalman;



