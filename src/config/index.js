/**
 * Created by j_bleach on 2018/9/20 0020.
 */
/**
 * @author j_bleach
 * @date 2018-09-25
 * @Description: devConfig 开发配置 / buildConfig 生产配置
 */
const devConfig = {
    normalIp: "https://xz.parkbobo.com",
    mapIp: "https://cmgis.parkbobo.com",
    version: "v1"
};
const buildConfig = {
    normalIp: "https://locmap.parkbobo.com",
    mapIp: "https://cmgis.parkbobo.com",
    version: "v1"
};
const config = process.env.NODE_ENV === "development" ? devConfig : buildConfig;

export default config;

