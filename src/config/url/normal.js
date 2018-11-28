/**
 * Created by j_bleach on 2018/9/20 0020.
 */
import config from "config";

const {normalIp, version, mapIp} = config;
const url = {
    dynamicParams: `${normalIp}/location/locDynamicThreshold/${version}/getLocDynamicThreshold`,
    mapService: `${normalIp}/hospService/${version}/getAllService`,
    searchCarByNumber: `${normalIp}/carStatus/${version}/searchCar`,
    searchCarByPosition: `${normalIp}/carStatus/${version}/getParkingNo`,
    getBaiduToken: `${mapIp}/location/BaiDuYuYin/${version}/getAccessToken`,
    evaluate: `${normalIp}/location/NavigationEvaluation/${version}/addNavigationEvaluation`,
    wxSign: `${normalIp}/wxConfig/weixin/${version}/jsSdkSign`,
};

export default url;
