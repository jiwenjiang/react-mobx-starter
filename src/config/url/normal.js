/**
 * Created by j_bleach on 2018/9/20 0020.
 */
import config from "config";

const {normalIp, version} = config;
const url = {
    dynamicParams: `${normalIp}/location/locDynamicThreshold/${version}/getLocDynamicThreshold`,
    mapService: `${normalIp}/hospService/${version}/getAllService`
};

export default url