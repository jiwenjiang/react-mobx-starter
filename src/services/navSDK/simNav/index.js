/**
 * Created by j_bleach on 2018/10/25 0025.
 */
const simNavigationFn = (target) => {
    return class simNavigation extends target {
        constructor() {
            super();
        }

        startSimNavigation() {
            console.log("开始模拟导航", this.currentPoint);
            this.correctFreeLocateTimer = null;
            clearTimeout(this.correctFreeLocateWatchId);
        }
    };
};

export default simNavigationFn;