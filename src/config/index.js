/**
 * Created by j_bleach on 2018/9/20 0020.
 */
/**
 * @author j_bleach
 * @date 2018-09-25
 * @Description: devConfig 开发配置 / buildConfig 生产配置
 */
const devConfig = {
    mapIp: "https://map.parkbobo.com",
    // mapIp: "https://gl.swun.edu.cn",
    normalIp: "https://xz.parkbobo.com",
    // normalIp: "https://gisapp.swun.edu.cn",
    version: "v1"
};
const buildConfig = {
    mapIp: "https://map.parkbobo.com",
    // mapIp: "https://gl.swun.edu.cn",
    normalIp: "https://xz.parkbobo.com",
    // normalIp: "https://gisapp.swun.edu.cn",
    version: "v1"
};
const config = process.env.NODE_ENV === "development" ? devConfig : buildConfig;

export default config;