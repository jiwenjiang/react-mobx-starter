/**
 * Created by j_bleach on 2018/10/23 0023.
 */
const correctLocateFn = (target) => {
    return class correctLocate extends target {
        constructor() {
            super();
        }
    };
};

export default correctLocateFn;