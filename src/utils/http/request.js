import axios from "axios";
import baseConfig from "./httpBaseConfig";
import Qs from "qs";
import RNFS from "react-native-fs";
import Toast from "../Toast/Toast";
import { PermissionsAndroid } from "react-native";

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
            // console.log("====================================");
            // console.log(encode);
            // console.log("====================================");
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
            // console.log("====================================");
            // console.log(ret);
            // console.log("====================================");
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
    static async post(url, params, encode = true, callback = false) {
        try {
            // let myTypeParams = new URLSearchParams();
            // for (let it in params) {
            //     myTypeParams.append(it, params[it]);
            // }
            // console.log(Qs.stringify(params));
            // let res = await axios.post(url, Qs.stringify(params));
            if (callback) {
                params = { ...params, callback: "hei" };
            }
            if (encode) {
                for (let i in params) {
                    params[i] = encodeURIComponent(params[i]);
                }
            }
            let res = await axios({
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                url: url,
                method: "post",
                data: Qs.stringify(params),
            });
            if (callback) {
                let regex = /\((.+?)\)/g;
                res = res.match(regex)[0].replace("(", "").replace(")", "");
            }
            console.log("post====================================");
            console.log(res);
            console.log("====================================");
            return JSON.parse(res);
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

    static async checkAndroidPermission() {
        try {
            const permission =
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
            await PermissionsAndroid.request(permission);
            Promise.resolve();
        } catch (error) {
            Promise.reject(error);
        }
    }

    static async download(url, fileType, name, setProgress) {
        // let name =
        name = name ? name : (Math.random() * 1000) | 0;
        const target = `${RNFS.ExternalStorageDirectoryPath}/${name}.${fileType}`;
        const options = {
            fromUrl: url,
            toFile: target,
            background: true,
            progressDivider: 5,
            begin: (res) => {
                //开始下载时回调
                console.log("begin", res);
                Toast.showInfoToast(
                    `开始下载，资源大小为：${res.contentLength / 1024 / 1024}M`,
                    500
                );
            },
            progress: (res) => {
                //下载过程中回调，根据options中设置progressDivider:5，则在完成5%，10%，15%，...，100%时分别回调一次，共回调20次。
                console.log("progress", res);
                let pro = (res.bytesWritten / res.contentLength) * 100;
                setProgress(pro);
            },
        };
        try {
            const ret = RNFS.downloadFile(options);
            ret.promise
                .then((res) => {
                    console.log("success", res);
                    console.log("file://" + target);
                    Toast.showSuccessToast(
                        `下载成功，已下载到地址：${target}`,
                        2000
                    );
                    setProgress(-1);
                })
                .catch((err) => {
                    console.log("ERROR: ", err);
                    Toast.showDangerToast("下载失败");
                    setProgress(-1);
                });
        } catch (error) {
            console.log(error);
        }
    }
}
