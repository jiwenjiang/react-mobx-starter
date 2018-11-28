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
/*eslint-disable*/
const getQueryString = (name, url = window.location.search) => {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    const regexS = "[\\?&]" + name + "=([^&#]*)";
    const regex = new RegExp(regexS);
    const results = regex.exec(url);
    return results == null ? null : results[1];
};
export {unique, getQueryString};
