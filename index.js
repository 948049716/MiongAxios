"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var axios_1 = require("axios");
var MiongAxios = /** @class */ (function () {
    function MiongAxios(opt) {
        this.loadingApi = {};
        this.axiosInstance = axios_1["default"].create(opt);
        this.responseDataHandle = opt.responseDataHandle || (function (res) { return res; });
        this.loading = opt.loading || (function () { });
        this.axiosInstance.interceptors.request.use(function (config) {
            config.headers.Authorization = opt.token;
            return config;
        });
    }
    MiongAxios.prototype.request = function (method, url, params, otherConfig) {
        var _this = this;
        var cancelRequest;
        var cancelToken = new axios_1["default"].CancelToken(function (c) {
            cancelRequest = c;
        });
        var config = __assign({ method: method,
            url: url,
            params: params,
            cancelToken: cancelToken }, otherConfig);
        // 处理post和get传参方式一致
        if (["POST", "PUT"].includes(method)) {
            config.data = params;
            delete config.params;
        }
        return new Promise(function (resolve, reject) {
            if (!config.withoutLoading) {
                _this.loading(true);
            }
            if (_this.loadingApi[url] && !config.notThrottle) {
                resolve('网络请求中，请稍后');
            }
            _this.loadingApi[url] = true;
            _this.loading(true);
            _this.axiosInstance
                .request(config)
                .then(function (res) {
                var data = res.data;
                if (config.originalRes) {
                    return resolve(res);
                }
                resolve(_this.responseDataHandle(data));
            })["catch"](function (err) {
                console.log('MiongAxios_err:', err);
                reject(err);
            })["finally"](function () {
                delete _this.loadingApi[url];
                if (!config.withoutLoading) {
                    _this.loading(false);
                }
            });
        });
    };
    MiongAxios.prototype.get = function (url, params, otherConfig) {
        return this.request("GET", url, params, otherConfig);
    };
    MiongAxios.prototype.post = function (url, params, otherConfig) {
        return this.request("POST", url, params, otherConfig);
    };
    MiongAxios.prototype.put = function (url, params, otherConfig) {
        return this.request("PUT", url, params, otherConfig);
    };
    MiongAxios.prototype["delete"] = function (url, params, otherConfig) {
        return this.request("DELETE", url, params, otherConfig);
    };
    MiongAxios.prototype.upload = function (url, params, otherConfig) {
        var formData = new FormData();
        Object.keys(params).forEach(function (key) {
            formData.append(key, params[key]);
        });
        var headers = {
            Accept: "*/*",
            "Content-Type": "multipart/form-data"
        };
        return this.request("POST", url, formData, __assign({ headers: headers }, otherConfig));
    };
    MiongAxios.prototype.blob = function (url, params, otherConfig) {
        var headers = {
            responseType: "blob"
        };
        return this.request("POST", url, params, __assign({ headers: headers }, otherConfig));
    };
    return MiongAxios;
}());
exports.MiongAxios = MiongAxios;
