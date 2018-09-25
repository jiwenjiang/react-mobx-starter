/**
 * Created by j_bleach on 2018/9/20 0020.
 */
import config from "config";

const {mapIp, version} = config;
const url = {
    mapSearch: `${mapIp}/map/search/${version}/keyword`
};

export default url