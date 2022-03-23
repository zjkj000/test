import axios from "axios";
import baseConfig from "./httpBaseConfig";
import Qs from "qs";

// 默认域名
axios.defaults.baseURL =
    baseConfig.baseUrl + ":" + baseConfig.port + baseConfig.prefix;
// 默认请求头
// axios.defaults.headers["Content-Type"] = "application/json";
// post请求头默认参数格式
axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded";

// 响应时间
axios.defaults.timeout = 10000;

// 请求拦截器
axios.interceptors.request.use(
    (config) => {
        // TODO:在发送前做点什么
        // showLoading(); //显示加载动画
        return config;
    },
    (error) => {
        // hideLoading(); //关闭加载动画
        // TODO:对响应错误做点什么
        return Promise.reject(error);
    }
);

// 响应拦截器
axios.interceptors.response.use(
    (response) => {
        // TODO:请求返回数据后做点什么
        if (response.status === "200" || response.status === 200) {
            return response.data.data || response.data;
        } else {
            // TODO:请求失败后做点什么
            throw Error(response.opt || "服务异常");
        }
        return response;
    },
    (error) => {
        // TODO:对应响应失败做点什么
        return Promise.resolve(error.response);
    }
);

// 请求类
export default class http {
    // ES7异步get函数
    static async get(url, params, encode = false) {
        try {
            let ret = "";
            if (encode) {
                for (let it in params) {
                    ret +=
                        encodeURIComponent(it) +
                        "=" +
                        encodeURIComponent(params[it]) +
                        "&";
                }
            } else {
                ret = await new URLSearchParams(params).toString();
            }
            // let res = null;
            if (ret != "") {
                url = url + "?" + ret;
            }
            // console.log("====================================");
            // console.log(url);
            // console.log("====================================");
            res = await axios.get(url);
            return res;
        } catch (error) {
            return error;
        }
    }

    // static async post(url, params) {
    //     try {
    //         let res = await axios.post(url, params);
    //         return res;
    //     } catch (error) {
    //         return error;
    //     }
    // }
    static async post(url, params) {
        try {
            // let myTypeParams = new URLSearchParams();
            // for (let it in params) {
            //     myTypeParams.append(it, params[it]);
            // }
            // console.log(Qs.stringify(params));
            // let res = await axios.post(url, Qs.stringify(params));
            let res = await axios({
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                url: url,
                method: "post",
                data: Qs.stringify(params),
            });
            // console.log("====================================");
            // console.log(url);
            // console.log("====================================");
            return res;
        } catch (error) {
            return error;
        }
    }

    static async patch(url, params) {
        try {
            let res = await axios.patch(url, params);
            return res;
        } catch (error) {
            return error;
        }
    }

    static async put(url, params) {
        try {
            let res = await axios.put(url, params);
            return res;
        } catch (error) {
            return error;
        }
    }

    static async delete(url, params) {
        /**
         * params默认为数组
         */
        try {
            let res = await axios.delete(url, params);
            return res;
        } catch (error) {
            return error;
        }
    }
}
