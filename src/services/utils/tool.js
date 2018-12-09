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

const handleTime = (s) => {
    let h;
    h = Math.floor(s / 60);
    //计算秒
    //算法：取得秒%60的余数，既得到秒数
    s = s % 60;
    if (h === 0) {
        return s + "秒";
    } else {
        return h + "分 " + s + "秒";
    }
};

const handleDistance = (s) => {
    if (s && s > 0) {
        if (s > 1000) {
            return (s / 1000).toFixed(2) + "公里";
        } else {
            return ~~s + "米";
        }
    }
};
export {unique, getQueryString, handleTime, handleDistance};
