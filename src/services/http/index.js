/**
 * @author j_bleach
 * @date 2018-09-20
 * @Description: http请求服务
 */
import axios from 'axios';

// axios.defaults.headers.common['accessToken'] = sessionStorage.accessToken;
axios.defaults.headers.common['Content-Type'] = "application/x-www-form-urlencoded";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


const http = {};
/**
 * @author j_bleach
 * @date 2018-09-20
 * @Description: 统一数据格式化
 * @param res:返回数据
 * @param succ:成功回调
 * @param err:失败回调
 */
http.format = (res, succ = () => {
}, err = () => {
}) => {
    if (res.data && res.data.code === 0) {
        succ(res.data.data)
    } else {
        err(res.data)
    }
}
// 未启用
http.init = (token) => {
    axios.defaults.headers.common['accessToken'] = token;
}

http.get = (url, data, succ, err) => {
    axios.get(url, {params: data})
        .then((res) => {
            http.format(res, succ)
        })
        .catch((error) => {
            err ? err(error) : false
        })
}

http.post = (url, data, succ, err, set) => {
    axios.post(url, data, set)
        .then((res) => {
            http.format(res, succ, err)
        })
        .catch((error) => {
            err ? err(error) : false
        })
}

http.put = (url, data, succ, err) => {
    axios.put(url, data)
        .then((res) => {
            http.format(res, succ)
        })
        .catch((error) => {
            err ? err(error) : false
        })
}

http.delete = (url, data, succ, err) => {
    axios.delete(url, {
        data: data
    })
        .then((res) => {
            http.format(res, succ)
        })
        .catch((error) => {
            err ? err(error) : false
        })
}


export default http;