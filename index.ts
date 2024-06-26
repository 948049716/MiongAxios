import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  Canceler,
  Method,
} from "axios";
import { CreateAxiosCustom } from "./types";

export class SimpleAxios {
  axiosInstance: AxiosInstance;
  responseDataHandle: (res: any) => any;
  constructor(opt: CreateAxiosCustom) {
    this.axiosInstance = axios.create(opt);
    this.responseDataHandle = opt.responseDataHandle;
    this.axiosInstance.interceptors.request.use((config) => {
      config.headers.Authorization = opt.token;
      return config;
    });
  }
  request<T>(method: Method, url: string, params: any) {
    let cancelRequest: Canceler;
    const cancelToken = new axios.CancelToken((c) => {
      cancelRequest = c;
    });
    const config: AxiosRequestConfig = { method, url, params,cancelToken };
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<T>(config)
        .then((res) => {
          const {data,config,request,status,statusText,headers } = res
          resolve(this.responseDataHandle(data));
          //todo
        })
        .catch((err) => {
          reject(err);
        })
        .finally(() => {});
    });
  }
  get<T = any>(url: string, params: any) {
    return this.request<T>("GET", url, params);
  }
}
