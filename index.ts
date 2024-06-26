import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  Canceler,
  Method,
} from "axios";
import { CreateAxiosCustom, CustomAxiosRequestConfig } from "./types";

export class MiongAxios {
  private axiosInstance: AxiosInstance;
  private responseDataHandle: (res: any) => any;
  private loading: (isLoading: boolean) => void;
  private loadingApi: { [k: string]: boolean };
  private businessCodeMap: { [k: string]: () => void };
  private httpCodeMap: { [k: string]: () => void };
  private businessCodeField: string;
  constructor(opt: CreateAxiosCustom) {
    this.businessCodeField = this.businessCodeField;
    this.httpCodeMap = opt.httpCodeMap || {};
    this.businessCodeMap = opt.businessCodeMap || {};
    this.loadingApi = {};
    this.axiosInstance = axios.create(opt);
    this.responseDataHandle = opt.responseDataHandle || ((res) => res);
    this.loading = opt.loading || (() => {});
    this.axiosInstance.interceptors.request.use((config) => {
      config.headers.Authorization = opt.token;
      return config;
    });
  }
  request<T = any>(
    method: Method,
    url: string,
    params: any,
    otherConfig?: CustomAxiosRequestConfig
  ): Promise<T> {
    let cancelRequest: Canceler;
    const cancelToken = new axios.CancelToken((c) => {
      cancelRequest = c;
    });
    const config: CustomAxiosRequestConfig = {
      method,
      url,
      params,
      cancelToken,
      ...otherConfig,
    };
    // 处理post和get传参方式一致
    if (["POST", "PUT", "put", "post"].includes(method)) {
      config.data = params;
      delete config.params;
    }
    return new Promise((resolve, reject) => {
      if (!config.withoutLoading) {
        this.loading(true);
      }
      if (this.loadingApi[url] && !config.notThrottle) {
        return reject("网络请求中，请稍后" as T);
      }
      this.loadingApi[url] = true;
      this.loading(true);
      this.axiosInstance
        .request(config)
        .then((res) => {
          const { data } = res;
          this.businessCodeMap[data[this.businessCodeField]]();
          if (config.originalRes) {
            return resolve(res as T);
          }

          resolve(this.responseDataHandle(data));
        })
        .catch((err) => {
          console.log("MiongAxios_err_http请求出错", err);
          this.httpCodeMap[err.response.status]();
          reject(err);
        })
        .finally(() => {
          delete this.loadingApi[url];
          if (!config.withoutLoading) {
            this.loading(false);
          }
        });
    });
  }
  get<T = any>(
    url: string,
    params: any,
    otherConfig?: CustomAxiosRequestConfig
  ) {
    return this.request<T>("GET", url, params, otherConfig);
  }
  post<T = any>(
    url: string,
    params: any,
    otherConfig?: CustomAxiosRequestConfig
  ) {
    return this.request<T>("POST", url, params, otherConfig);
  }
  put<T = any>(
    url: string,
    params: any,
    otherConfig?: CustomAxiosRequestConfig
  ) {
    return this.request<T>("PUT", url, params, otherConfig);
  }
  delete<T = any>(
    url: string,
    params: any,
    otherConfig?: CustomAxiosRequestConfig
  ) {
    return this.request<T>("DELETE", url, params, otherConfig);
  }
  upload<T = any>(
    url: string,
    params: any,
    otherConfig?: CustomAxiosRequestConfig
  ) {
    const formData = new FormData();
    Object.keys(params).forEach((key) => {
      formData.append(key, params[key]);
    });
    const headers: AxiosRequestConfig["headers"] = {
      Accept: "*/*",
      "Content-Type": "multipart/form-data",
    };
    return this.request<T>("POST", url, formData, { headers, ...otherConfig });
  }
  blob<T = any>(
    url: string,
    params: any,
    otherConfig?: CustomAxiosRequestConfig
  ) {
    const headers: AxiosRequestConfig["headers"] = {
      responseType: "blob",
    };
    return this.request<T>("POST", url, params, { headers, ...otherConfig });
  }
}
