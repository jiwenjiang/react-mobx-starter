class Matrix {
    constructor(x, y, value) {
        const xs = [];
        const ys = [];
        for (let i = 0; i < y; i++) {
            ys.push(value || 0)
        }
        for (let i = 0; i < x; i++) {
            xs.push([].concat(ys))
        }
        // return xs
        this.xy = xs;
    }

    value(x, y, value) {
        //使数组下标与矩阵坐标匹配
        x -= 1;
        y -= 1;

        if (value) {
            this.xy[x][y] = value;
        }
        return this.xy[x][y]
    }
}

class Calc {
    static initMatrix(x, y, value) {
        const xs = [];
        const ys = [];
        for (let i = 0; i < y; i++) {
            ys.push(value || 0)
        }
        for (let i = 0; i < x; i++) {
            xs.push([].concat(ys))
        }
        return xs
    }

    static additive(matrix_a, matrix_b) {
        const a = matrix_a.xy.length,
            b = matrix_a.xy[0].length;
        const result = new Matrix(a, b, 0);

        for (let i = 0; i < a; i++) {
            for (let j = 0; j < b; j++) {
                result.xy[i][j] = matrix_a.xy[i][j] + matrix_b.xy[i][j]
            }
        }

        return result
    }

    static transposition(matrix) {
        const a = matrix.xy.length,
            b = matrix.xy[0].length;
        const result = new Matrix(b, a, 0);

        for (let i = 0; i < b; i++) {
            for (let j = 0; j < a; j++) {
                // console.log(result.xy , matrix.xy)
                result.xy[i][j] = matrix.xy[j][i]
            }
        }
        return result
    }

    static subtractive(matrix_a, matrix_b) {
        const a = matrix_a.xy.length,
            b = matrix_a.xy[0].length;
        const result = new Matrix(a, b, 0);

        for (let i = 0; i < a; i++) {
            for (let j = 0; j < b; j++) {
                result.xy[i][j] = matrix_a.xy[i][j] - matrix_b.xy[i][j]
            }
        }

        return result
    }

    static multiplicative(matrix_a, matrix_b) {
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
                            value += matrix_a.xy[i][m] * matrix_b.xy[n][j]
                        }
                    }
                }

                result.xy[i][j] = value;
            }
        }
        return result
    }

    static inverse(matrix) {
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
                result.xy[i][j] = res[i][j]
            }
        }
        return result;
    }
}

export {Matrix, Calc}
