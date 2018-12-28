/**
 * Created by j_bleach on 2018/12/27 0027.
 */

/*eslint-disable*/

const workercode = () => {
    console.log("worker init!!!!")
    function Matrix(x, y, value) {
        const xs = [];
        const ys = [];
        for (let i = 0; i < y; i++) {
            ys.push(value || 0);
        }
        for (let i = 0; i < x; i++) {
            xs.push([].concat(ys));
        }
        this.xy = xs;
    }

    Matrix.prototype = {
        constructor: Matrix,
        value: function (x, y, value) {
            x -= 1;
            y -= 1;
            if (value) {
                this.xy[x][y] = value;
            }
            return this.xy[x][y];
        }
    };
    const Calc = {
        additive: (matrix_a, matrix_b) => {
            const a = matrix_a.xy.length,
                b = matrix_a.xy[0].length;
            const result = new Matrix(a, b, 0);

            for (let i = 0; i < a; i++) {
                for (let j = 0; j < b; j++) {
                    result.xy[i][j] = matrix_a.xy[i][j] + matrix_b.xy[i][j];
                }
            }
            return result;
        },
        transposition: (matrix) => {
            const a = matrix.xy.length,
                b = matrix.xy[0].length;
            const result = new Matrix(b, a, 0);

            for (let i = 0; i < b; i++) {
                for (let j = 0; j < a; j++) {
                    // console.log(result.xy , matrix.xy)
                    result.xy[i][j] = matrix.xy[j][i];
                }
            }
            return result;
        },
        subtractive: (matrix_a, matrix_b) => {
            const a = matrix_a.xy.length,
                b = matrix_a.xy[0].length;
            const result = new Matrix(a, b, 0);

            for (let i = 0; i < a; i++) {
                for (let j = 0; j < b; j++) {
                    result.xy[i][j] = matrix_a.xy[i][j] - matrix_b.xy[i][j];
                }
            }

            return result;
        },
        multiplicative: (matrix_a, matrix_b) => {
            const a = matrix_a.xy.length,
                b = matrix_a.xy[0].length,
                c = matrix_a.xy.length,
                d = matrix_b.xy[0].length;
            const result = new Matrix(a, d, 0);

            for (let i = 0; i < a; i++) {
                for (let j = 0; j < d; j++) {
                    let value = 0;

                    for (let m = 0; m < b; m++) {
                        for (let n = 0; n < c; n++) {
                            if (m === n) {
                                value += matrix_a.xy[i][m] * matrix_b.xy[n][j];
                            }
                        }
                    }

                    result.xy[i][j] = value;
                }
            }
            return result;
        },
        inverse: (matrix) => {
            matrix = matrix.xy;
            matrix = JSON.parse(JSON.stringify(matrix)); // 深复制，防止原矩阵被改变
            let len = matrix.length, i, j, k, res = [];
            // 只有方阵才可以求逆
            if (len !== matrix[0].length)
                throw new Error("matrix is not a square matrix");
            // 稍后会添加另一个条件（非奇异举证才可以求逆）
            // get unit matrix
            for (j = 0; j < len; j++) {
                res[j] = [];
                for (i = 0; i < len; i++) {
                    if (j === i)
                        res[j][i] = 1;
                    else
                        res[j][i] = 0;
                }
            }
            for (i = 0; i < len; i++) {  // i代表的是列
                for (j = 0; j < len; j++) {
                    if (matrix[j][i] !== 0) {
                        if (j !== 0)
                            swap(matrix, res, 0, j);
                        break;
                    }
                }
                for (j = 0; j < len; j++) {
                    // 操作第一行,将[j][i]变为1,所以第一行,除以相应位置值
                    if (j === 0) {
                        for (k = len - 1; k >= 0; k--) {
                            res[j][k] = res[j][k] / matrix[j][i];
                        }
                        for (k = len - 1; k >= i; k--)
                            matrix[j][k] /= matrix[j][i];
                    } else {
                        // 非第一行,要求[j][k]位置0,所以用[j][i] / [0][i]得到两行的倍数
                        for (k = len - 1; k >= 0; k--)
                            res[j][k] = res[j][k] - matrix[j][i] / matrix[0][i] * res[0][k];
                        for (k = len - 1; k >= i; k--)
                            matrix[j][k] = matrix[j][k] - matrix[j][i] / matrix[0][i] * matrix[0][k];
                    }
                }
                swap(matrix, res, 0, (i + 1) % len);  // 交换需要进行变化的一行到第一行
            }
            swap(matrix, res, 0, len - 1);

            // 交换两行
            function swap(input, output, target, source) {
                if (target === source)
                    return void 0;
                var a = input[target],
                    b = output[target];
                input[target] = input[source];
                input[source] = a;
                output[target] = output[source];
                output[source] = b;
            }

            const a = res.length, b = res[0].length;
            const result = new Matrix(a, b, 0);
            for (let i = 0; i < a; i++) {
                for (let j = 0; j < b; j++) {
                    result.xy[i][j] = res[i][j];
                }
            }
            return result;
        }
    };
    let _this = {};
    _this.history = [];
    _this.Q = new Matrix(4, 4, 0);
    _this.F = new Matrix(4, 4, 0);
    _this.P = new Matrix(4, 4, 0);

    _this.H = new Matrix(2, 4);
    _this.R = new Matrix(2, 2);

    _this.x_hat = new Matrix(1, 4, 0);
    _this.x_hat = Calc.transposition(_this.x_hat);
    //初始速度 0.1
    _this.x_hat.value(3, 1, 0.1);
    _this.x_hat.value(4, 1, 0.1);


    _this.Z = new Matrix(1, 2, 0);

    _this.P_temp = null;
    _this.K = null;

    _this.E = new Matrix(4, 4, 0);
    _this.E.value(1, 1, 1);
    _this.E.value(2, 2, 1);
    _this.E.value(3, 3, 1);
    _this.E.value(4, 4, 1);
    _this.T = 0.5; //T为时间间隔，我这里设的是0.5S


    const updateLocation = (o, hasStep) => {
        let {iBeacon, fiducial, stepper} = o;
        let curr = null;
        if (iBeacon && fiducial && stepper) {
            curr = [
                iBeacon[0] * 0.1 + fiducial[0] * 0.4 + stepper[0] * 0.5,
                iBeacon[1] * 0.1 + fiducial[1] * 0.4 + stepper[1] * 0.5
            ];
        } else if (iBeacon && fiducial) {
            curr = [
                iBeacon[0] * 0.3 + fiducial[0] * 0.7,
                iBeacon[1] * 0.3 + fiducial[1] * 0.7
            ];
        } else if (iBeacon && stepper) {
            curr = [
                iBeacon[0] * 0.2 + stepper[0] * 0.8,
                iBeacon[1] * 0.2 + stepper[1] * 0.8
            ];
        } else if (stepper && fiducial) {
            curr = [
                fiducial[0] * 0.5 + stepper[0] * 0.5,
                fiducial[1] * 0.5 + stepper[1] * 0.5
            ];
        } else {
            curr = [].concat(iBeacon || fiducial || stepper);
        }

        // const curr = Kalman.weighting();

        if (!curr || !curr[0] || !curr[1]) {
            return;
        }
        _this.Z.value(1, 1, curr[0]);
        _this.Z.value(1, 2, curr[1]);
        iBeacon = null;
        fiducial = null;

        let lon = curr[0] + _this.x_hat.value(3, 1) * _this.T * 0.00000898;
        let lat = curr[1] + _this.x_hat.value(4, 1) * _this.T * 0.00000773;
        _this.x_hat.value(1, 1, lon);
        _this.x_hat.value(2, 1, lat);

        _this.Q.value(1, 1, 0.0000000001);
        _this.Q.value(2, 2, 0.0000000001);
        _this.Q.value(3, 3, 0.001);
        _this.Q.value(4, 4, 0.001);
        _this.F.value(1, 1, 1);
        _this.F.value(1, 3, _this.T);
        _this.F.value(2, 2, 1);
        _this.F.value(2, 4, _this.T);
        _this.F.value(3, 3, 1);
        _this.F.value(4, 4, 1);

        _this.P_temp = Calc.multiplicative(_this.F, _this.P);
        _this.P_temp = Calc.multiplicative(_this.P_temp, Calc.transposition(_this.F));
        _this.P_temp = Calc.additive(_this.P_temp, _this.Q);
        _this.H.value(1, 1, 1);
        _this.H.value(2, 2, 1);
        _this.R.value(1, 1, 0.00002 * 0.00002);
        _this.R.value(2, 2, 0.00002 * 0.00002);

        let temp0 = Calc.multiplicative(_this.P_temp, Calc.transposition(_this.H));
        let temp1 = Calc.multiplicative(_this.H, _this.P_temp);
        temp1 = Calc.multiplicative(temp1, Calc.transposition(_this.H));
        temp1 = Calc.additive(temp1, _this.R);
        temp1 = Calc.inverse(temp1);
        _this.K = Calc.multiplicative(temp0, temp1);

        //x_hat=x_hat+K*(Z'-H*x_hat);
        let temp2 = Calc.multiplicative(_this.H, _this.x_hat);
        temp2 = Calc.subtractive(Calc.transposition(_this.Z), temp2);
        temp2 = Calc.multiplicative(_this.K, temp2);

        _this.x_hat = Calc.additive(_this.x_hat, temp2);

        //P=(eye(4)-K*H)*P_temp;//eye(4)为4行4列的单位矩阵，对角线上的元素都为1.
        let temp3 = Calc.multiplicative(_this.K, _this.H);
        temp3 = Calc.subtractive(_this.E, temp3);
        _this.P = Calc.multiplicative(temp3, _this.P_temp);
        //X1=x_hat;

        if (!_this.history.length) {
            _this.history.push(JSON.parse(JSON.stringify(_this.x_hat)));
            _this.history.push(JSON.parse(JSON.stringify(_this.x_hat)));
        }
        let a = new Matrix(4, 1), b = new Matrix(4, 1);
        a = Calc.additive(_this.history[0], a);
        b = Calc.additive(_this.history[1], b);


        let x = _this.x_hat.value(1, 1);
        let y = _this.x_hat.value(2, 1);

        if (hasStep) {
            x = 0.1 * (b.value(1, 1) + b.value(3, 1) * _this.T * 0.00000898) + 0.9 * _this.x_hat.value(1, 1);
            y = 0.1 * (b.value(2, 1) + b.value(4, 1) * _this.T * 0.00000898) + 0.9 * _this.x_hat.value(2, 1);
        }

        // _this.x_hat.value(1, 1, x);
        // _this.x_hat.value(2, 1, y);

        if (hasStep) {
            let tempX = 2 * b.value(1, 1) - a.value(1, 1);
            let tempY = 2 * b.value(2, 1) - a.value(2, 1);

            x = 0.7 * tempX + 0.3 * x;
            y = 0.7 * tempY + 0.3 * y;

        }
        _this.x_hat.value(1, 1, x);
        _this.x_hat.value(2, 1, y);

        _this.history.shift();
        _this.history.push(JSON.parse(JSON.stringify(_this.x_hat)));

        return {lon: x, lat: y};
    };

    self.onmessage = (e) => { // without self, onmessage is not defined
        console.log("收到主线程消息", e.data);
        const workerResult = updateLocation(e.data.array, e.data.hasStep);
        console.log("worker发送消息", workerResult);
    };
    self.postMessage("workerResult"); // here it's working without self
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], {type: "application/javascript"});
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;

