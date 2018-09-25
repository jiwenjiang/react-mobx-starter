/**
 * Created by j_bleach on 2018/9/25 0025.
 */
const unique = (array) => {
    let obj = {};
    return array.filter((item) => {
        return obj.hasOwnProperty(typeof item + JSON.stringify(item))
            ? false
            : (obj[typeof item + JSON.stringify(item)] = true);
    });
};
export {unique};