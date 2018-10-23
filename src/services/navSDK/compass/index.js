/**
 * Created by j_bleach on 2018/10/23 0023.
 */
const compassFn = (target) => {
    return class compass extends target {
        constructor() {
            super();
        }

        initCompass() {
            let u = navigator.userAgent;
            let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
            let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isiOS) {
                window.addEventListener("deviceorientation", this.callBackOrientation);
            } else if (isAndroid) {
                window.addEventListener("deviceorientationabsolute", this.callBackOrientation);
            }
        }

        callBackOrientation = (event) => {
            this.alpha = event.webkitCompassHeading || 360 - event.alpha;
            this.onCompass(this.alpha);
        };
    };
};

export default compassFn;