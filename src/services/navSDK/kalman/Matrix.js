/*eslint-disable*/
class Matrix{
    constructor(data){
        this.type = Float64Array;
        this.shape = [];
        if (data && data.buffer && data.buffer instanceof ArrayBuffer) {
            return Matrix.fromTypedArray(data, options && options.shape);
        } else if (data instanceof Array) {
            return Matrix.fromArray(data);
        }  else if (data instanceof Matrix) {
            return Matrix.fromMatrix(data);
        } else if (typeof data === "number" && typeof options === "number") {
            // Handle new Matrix(r, c)
            return Matrix.fromShape([data, options]);
        } else if (data && !data.buffer && data.shape) {
            // Handle new Matrix({ shape: [r, c] })
            return Matrix.fromShape(data.shape);
        }
    }

    static fromArray(array) {
        var r = array.length, // number of rows
            c = array[0].length,  // number of columns
            data = new Float64Array(r * c);

        var i, j;
        for (i = 0; i < r; ++i)
            for (j = 0; j < c; ++j)
                data[i * c + j] = array[i][j];

        return Matrix.fromTypedArray(data, [r, c]);
    }

    static fromTypedArray(data, shape) {
        if (data.length !== shape[0] * shape[1])
            throw new Error("Shape does not match typed array dimensions.");

        var self = Object.create(Matrix.prototype);
        self.shape = shape;
        self.data = data;
        self.type = data.constructor;

        return self;
    }
    static fromMatrix(matrix) {
        var self = Object.create(Matrix.prototype);
        self.shape = [matrix.shape[0], matrix.shape[1]];
        self.data = new matrix.type(matrix.data);
        self.type = matrix.type;

        return self;
    }
    static binOp(a, b, op) {
        return new Matrix(a).binOp(b, op);
    }

    binOp(matrix, op) {
        var r = this.shape[0],          // rows in this matrix
            c = this.shape[1],          // columns in this matrix
            size = r * c,
            d1 = this.data,
            d2 = matrix.data;

        if (r !== matrix.shape[0] || c !== matrix.shape[1])
            throw new Error('sizes do not match!');

        var i;
        for (i = 0; i < size; i++)
            d1[i] = op(d1[i], d2[i], i);

        return this;
    }

    static add(a, b) {
        return new Matrix(a).add(b);
    }


    add(matrix) {
        return this.binOp(matrix, function(a, b) { return a + b });
    }


    static subtract(a, b) {
        return new Matrix(a).subtract(b);
    }

    subtract(matrix) {
        return this.binOp(matrix, function(a, b) { return a - b });
    }

    static fill(r, c, value, type) {
        if (r <= 0 || c <= 0)
            throw new Error('invalid size');

        value = value || +0.0;
        type = type || Float64Array;

        var size = r * c,
            data = new type(size),
            isValueFn = typeof value === 'function',
            i, j, k = 0;

        for (i = 0; i < r; i++)
            for (j = 0; j < c; j++, k++)
                data[k] = isValueFn ? value(i, j) : value;

        return Matrix.fromTypedArray(data, [r, c]);
    }


    static zeros(r, c, type) {
        return Matrix.fill(r, c, +0.0, type);
    }


    static ones(r, c, type) {
        return Matrix.fill(r, c, +1.0, type);
    }
    static multiply(a, b) {
        return a.multiply(b);
    }
    multiply(matrix) {
        var r1 = this.shape[0],   // rows in this matrix
            c1 = this.shape[1],   // columns in this matrix
            r2 = matrix.shape[0], // rows in multiplicand
            c2 = matrix.shape[1], // columns in multiplicand
            d1 = this.data,
            d2 = matrix.data;

        if (c1 !== r2)
            throw new Error('sizes do not match');

        var data = new this.type(r1 * c2),
            i, j, k,
            sum;
        for (i = 0; i < r1; i++) {
            for (j = 0; j < c2; j++) {
                sum = +0;
                for (k = 0; k < c1; k++)
                    sum += d1[i * c1 + k] * d2[j + k * c2];

                data[i * c2 + j] = sum;
            }
        }

        return Matrix.fromTypedArray(data, [r1, c2]);
    }

    get T() {
        return this.transpose();
    }


    transpose() {
        var r = this.shape[0],
            c = this.shape[1],
            i, j;

        var data = new this.type(c * r);
        for (i = 0; i < r; i++)
            for (j = 0; j < c; j++)
                data[j * r + i] = this.data[i * c + j];

        return Matrix.fromTypedArray(data, [c, r]);
    }


    inverse() {
        var l = this.shape[0],
            m = this.shape[1];

        if (l !== m)
            throw new Error('invalid dimensions');

        var identity = Matrix.identity(l);
        var augmented = Matrix.augment(this, identity);
        var gauss = augmented.gauss();

        var left = Matrix.zeros(l, m),
            right = Matrix.zeros(l, m),
            n = gauss.shape[1],
            i, j;
        for (i = 0; i < l; i++) {
            for (j = 0; j < n; j++) {
                if (j < m)
                    left.set(i, j, gauss.get(i, j));
                else
                    right.set(i, j - l, gauss.get(i, j));
            }
        }

        if (!left.equals(Matrix.identity(l)))
            throw new Error('matrix is not invertible');

        return right;
    }

    /**
     * Performs Gaussian elimination on a matrix.
     * @memberof Matrix
     * @returns {Matrix} the matrix in reduced row echelon form
     **/
    gauss() {
        var l = this.shape[0],
            m = this.shape[1];

        var copy = new Matrix(this),
            lead = 0,
            pivot,
            i, j, k,
            leadValue;

        for (i = 0; i < l; i++) {
            if (m <= lead)
                return new Error('matrix is singular');

            j = i;
            while (copy.data[j * m + lead] === 0) {
                j++;
                if (l === j) {
                    j = i;
                    lead++;

                    if (m === lead)
                        return new Error('matrix is singular');
                }
            }

            copy.swap(i, j);

            pivot = copy.data[i * m + lead];
            if (pivot !== 0) {
                // scale down the row by value of pivot
                for (k = 0; k < m; k++)
                    copy.data[(i * m) + k] = copy.data[(i * m) + k] / pivot;
            }


            for (j = 0; j < l; j++) {
                leadValue = copy.data[j * m + lead];
                if (j !== i)
                    for (k = 0; k < m; k++)
                        copy.data[j * m + k] = copy.data[j * m + k] - (copy.data[i * m + k] * leadValue);
            }

            lead++;
        }

        for (i = 0; i < l; i++) {
            pivot = 0;
            for (j = 0; j < m; j++)
                if (!pivot)
                    pivot = copy.data[i * m + j];

            if (pivot)
            // scale down the row by value of pivot
                for (k = 0; k < m; k++)
                    copy.data[(i * m) + k] = copy.data[(i * m) + k] / pivot;
        }

        return copy;
    }


    lu() {
        var r = this.shape[0],
            c = this.shape[1],
            plu = Matrix.plu(this),
            ipiv = plu[1],
            pivot = Matrix.identity(r),
            lower = new Matrix(plu[0]),
            upper = new Matrix(plu[0]),
            i, j;

        for (i = 0; i < r; i++)
            for (j = i; j < c; j++)
                lower.data[i * c + j] = i === j ? 1 : 0;

        for (i = 0; i < r; i++)
            for (j = 0; j < i && j < c; j++)
                upper.data[i * c + j] = 0;

        return [lower, upper, ipiv];
    }


    static plu(matrix) {
        return new Matrix(matrix).plu();
    }


    plu() {
        var data = this.data,
            n = this.shape[0],
            ipiv = new Int32Array(n),
            max, abs, diag, p,
            i, j, k;

        for (k = 0; k < n; ++k) {
            p = k;
            max = Math.abs(data[k * n + k]);
            for (j = k + 1; j < n; ++j) {
                abs = Math.abs(data[j * n + k]);
                if (max < abs) {
                    max = abs;
                    p = j;
                }
            }

            ipiv[k] = p;

            if (p !== k)
                this.swap(k, p);

            diag = data[k * n + k];
            for (i = k + 1; i < n; ++i)
                data[i * n + k] /= diag;

            for (i = k + 1; i < n; ++i) {
                for (j = k + 1; j < n - 1; ++j) {
                    data[i * n + j] -= data[i * n + k] * data[k * n + j];
                    ++j;
                    data[i * n + j] -= data[i * n + k] * data[k * n + j];
                }

                if(j === n - 1)
                    data[i * n + j] -= data[i * n + k] * data[k * n + j];
            }
        }

        return [this, ipiv];
    }


    lusolve(rhs, ipiv) {
        var lu = this.data,
            n = rhs.shape[0],
            nrhs = rhs.shape[1],
            x = rhs.data,
            i, j, k;

        // pivot right hand side
        for (i = 0; i < ipiv.length; i++)
            if (i !== ipiv[i])
                rhs.swap(i, ipiv[i]);

        for (k = 0; k < nrhs; k++) {
            // forward solve
            for (i = 0; i < n; i++)
                for (j = 0; j < i; j++)
                    x[i * nrhs + k] -= lu[i * n + j] * x[j * nrhs + k];

            // backward solve
            for (i = n - 1; i >= 0; i--) {
                for (j = i + 1; j < n; j++)
                    x[i * nrhs + k] -= lu[i * n + j] * x[j * nrhs + k];
                x[i * nrhs + k] /= lu[i * n + i];
            }
        }

        return rhs;
    }
    lusolve(rhs, ipiv) {
        var lu = this.data,
            n = rhs.shape[0],
            nrhs = rhs.shape[1],
            x = rhs.data,
            i, j, k;

        // pivot right hand side
        for (i = 0; i < ipiv.length; i++)
            if (i !== ipiv[i])
                rhs.swap(i, ipiv[i]);

        for (k = 0; k < nrhs; k++) {
            // forward solve
            for (i = 0; i < n; i++)
                for (j = 0; j < i; j++)
                    x[i * nrhs + k] -= lu[i * n + j] * x[j * nrhs + k];

            // backward solve
            for (i = n - 1; i >= 0; i--) {
                for (j = i + 1; j < n; j++)
                    x[i * nrhs + k] -= lu[i * n + j] * x[j * nrhs + k];
                x[i * nrhs + k] /= lu[i * n + i];
            }
        }

        return rhs;
    }

    solve(rhs) {
        var plu = Matrix.plu(this),
            lu = plu[0],
            ipiv = plu[1];

        return lu.lusolve(new Matrix(rhs), ipiv);
    }


    static augment(a, b) {
        return new Matrix(a).augment(b);
    }


    augment(matrix) {
        if (matrix.shape.length === 0)
            return this;

        var r1 = this.shape[0],
            c1 = this.shape[1],
            r2 = matrix.shape[0],
            c2 = matrix.shape[1],
            d1 = this.data,
            d2 = matrix.data,
            i, j;

        if (r1 !== r2)
            throw new Error("Rows do not match.");

        var length = c1 + c2,
            data = new this.type(length * r1);

        for (i = 0; i < r1; i++)
            for (j = 0; j < c1; j++)
                data[i * length + j] = d1[i * c1 + j];

        for (i = 0; i < r2; i++)
            for (j = 0; j < c2; j++)
                data[i * length + j + c1] = d2[i * c2 + j];

        this.shape = [r1, length];
        this.data = data;

        return this;
    }


    static identity(size, type) {
        return Matrix.fill(size, size, function (i, j) {
            return i === j ? +1.0 : +0.0;
        })
    }


    static magic(size, type) {
        if (size < 0)
            throw new Error('invalid size');

        function f(n, x, y) {
            return (x + y * 2 + 1) % n;
        }

        type = type || Float64Array;
        var data = new type(size * size),
            i, j;
        for (i = 0; i < size; i++)
            for (j = 0; j < size; j++)
                data[(size - i - 1) * size + (size - j - 1)] =
                    f(size, size - j - 1, i) * size + f(size, j, i) + 1;

        return Matrix.fromTypedArray(data, [size, size]);
    }





    determinant() {
        if (this.shape[0] !== this.shape[1])
            throw new Error('matrix is not square');

        var plu = Matrix.plu(this),
            ipiv = plu.pop(),
            lu = plu.pop(),
            r = this.shape[0],
            c = this.shape[1],
            product = 1,
            sign = 1,
            i;

        // get sign from ipiv
        for (i = 0; i < r; i++)
            if (i !== ipiv[i])
                sign *= -1;

        for (i = 0; i < r; i++)
            product *= lu.data[i * c + i];

        return sign * product;
    }


    trace() {
        var diagonal = this.diag(),
            result = 0,
            i, l;

        for (i = 0, l = diagonal.length; i < l; i++)
            result += diagonal.get(i);

        return result;
    }


    static equals(a, b) {
        return a.equals(b);
    }


    equals(matrix) {
        var r = this.shape[0],
            c = this.shape[1],
            size = r * c,
            d1 = this.data,
            d2 = matrix.data;

        if (r !== matrix.shape[0] || c !== matrix.shape[1] || this.type !== matrix.type)
            return false;

        var i;
        for (i = 0; i < size; i++)
            if (d1[i] !== d2[i])
                return false;

        return true;
    }


    check(i, j) {
        if (Number.isNaN(i) || Number.isNaN(j) || i < 0 || j < 0 || i > this.shape[0] - 1 || j > this.shape[1] - 1)
            throw new Error('index out of bounds');
    }


    get(i, j) {
        this.check(i, j);
        return this.data[i * this.shape[1] + j];
    }


    set(i, j, value) {
        this.check(i, j);
        this.data[i * this.shape[1] + j] = value;
        return this;
    }


    swap(i, j) {
        if (i < 0 || j < 0 || i > this.shape[0] - 1 || j > this.shape[0] - 1)
            throw new Error('index out of bounds');

        var c = this.shape[1];

        // copy first row
        var copy = this.data.slice(i * c, (i + 1) * c);
        // move second row into first row spot
        this.data.copyWithin(i * c, j * c, (j + 1) * c);
        // copy first row back into second row spot
        this.data.set(copy, j * c);

        return this;
    }


    map(callback) {
        var r = this.shape[0],
            c = this.shape[1],
            size = r * c,
            mapped = new Matrix(this),
            data = mapped.data,
            i;

        for (i = 0; i < size; i++)
            data[i] = callback.call(mapped, data[i], i / c | 0, i % c, data);

        return mapped;
    }


    each(callback) {
        var r = this.shape[0],
            c = this.shape[1],
            size = r * c,
            i;

        for (i = 0; i < size; i++)
            callback.call(this, this.data[i], i / c | 0, i % c);

        return this;
    }


    reduce(callback, initialValue) {
        var r = this.shape[0],
            c = this.shape[1],
            size = r * c;

        if (size === 0 && !initialValue)
            throw new Error('Reduce of empty matrix with no initial value.');

        var i = 0,
            value = initialValue || this.data[i++];

        for (; i < size; i++)
            value = callback.call(this, value, this.data[i], i / c | 0, i % c);
        return value;
    }



    toString() {
        var result = [],
            r = this.shape[0],
            c = this.shape[1],
            i;

        for (i = 0; i < r; i++)
            // get string version of current row and store it
            result.push('[' + this.data.subarray(i * c, (i + 1) * c ).toString() + ']');

        return '[' + result.join(', \n') + ']';
    }


    toArray() {
        var result = [],
            r = this.shape[0],
            c = this.shape[1],
            i;

        for (i = 0; i < r; i++)
            // copy current row into a native array and store it
            result.push(Array.prototype.slice.call(this.data.subarray(i * c, (i + 1) * c)));

        return result;
    }
}
module.exports = Matrix;
try {
    window.Matrix = Matrix;
} catch (e) {}