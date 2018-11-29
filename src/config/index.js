/**
 * Created by j_bleach on 2018/9/20 0020.
 */
/**
 * @author j_bleach
 * @date 2018-09-25
 * @Description: devConfig 开发配置 / buildConfig 生产配置
 */
const devConfig = {
    // mapIp: "https://gismp.scu.edu.cn",
    mapIp: "https://map.parkbobo.com",
    // normalIp: "https://gisgd.scu.edu.cn",
    normalIp: "https://xz.parkbobo.com",
    version: "v1"
};
const buildConfig = {
    // mapIp: "https://gismp.scu.edu.cn",
    // mapIp: "https://gl.swun.edu.cn",
    mapIp: "https://map.parkbobo.com",
    // normalIp: "https://gisgd.scu.edu.cn",
    // normalIp: "https://gisapp.swun.edu.cn",
    normalIp: "https://xz.parkbobo.com",
    version: "v1"
};
const config = process.env.NODE_ENV === "development" ? devConfig : buildConfig;

export default config;
