/**
 * Created by j_bleach on 2018/9/20 0020.
 */
const devConfig = {
    mapIp: "https://map.parkbobo.com/",
    normalIp: "https://xz.parkbobo.com/",
    version: "v1"
}
const buildConfig = {
    ip: "https://map.parkbobo.com/map/",
    version: "v1"
}
const config = process.env.NODE_ENV === 'development' ? devConfig : buildConfig;

export default config