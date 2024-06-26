import { AxiosRequestConfig, CreateAxiosDefaults } from "axios";

export interface CreateAxiosCustom extends CreateAxiosDefaults {
    /**请求携带的token */
    token: string;
    /**相应数据的处理，默认返回响应的data */
    responseDataHandle?: (res: any) => any;
    /**接口请求时触发的loading函数 */
    loading?:(isLoading:boolean)=>void
    
}
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  /** 返回原始 resp 响应信息，用于获取 http 原信息，如 status code 等 */
    originalRes?: boolean;

    /**不触发loading（在实例化axios时传入的loading） */
    withoutLoading?: boolean;
    /**接口不节流(不等待上一个接口请求完成才发起下一次请求) */
    notThrottle?:boolean
   
}