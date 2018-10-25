/**
 * Created by j_bleach on 2018/9/25 0025.
 */
/**
 * @author j_bleach
 * @date 2018-10-25
 * @Description: 数组对象去重
 * @param array:[{}]
 * @return arr:[{}]
 */
const unique = (array) => {
    let obj = {};
    return array.filter((item) => {
        return obj.hasOwnProperty(typeof item + JSON.stringify(item))
            ? false
            : (obj[typeof item + JSON.stringify(item)] = true);
    });
};
/**
 * @author j_bleach
 * @date 2018-10-25
 * @Description: 获取url参数值
 * @param name:String
 * @param url:String
 * @return value:String
 */
const getQueryString = (name, url = window.location.search) => {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    const r = url.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};
export {unique, getQueryString};