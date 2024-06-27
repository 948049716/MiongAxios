import { AxiosRequestConfig, CreateAxiosDefaults } from "axios";

export interface CreateAxiosCustom extends CreateAxiosDefaults {
  /**请求携带的token */
  token: string | null;
  /**相应数据的处理，默认返回响应的data */
  responseDataHandle?: (data: any) => any;

  /**业务状态码字段名 也就是接口返回数据体中data下状态码的字段名 一般是code */
  businessCodeField: string;

  /**接口请求时触发的loading函数 */
  loading?: (isLoading: boolean) => void;

  /**业务状态码处理映射 */
  businessCodeMap?: { [k: string]: ((data:any) => void) | null | undefined };

  /**http状态码处理映射 */
  httpCodeMap?: { [k: string]: () => void };
}
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  /** 返回原始 resp 响应信息，用于获取 http 原信息，如 status code 等 */
  originalRes?: boolean;

  /**不触发loading（在实例化axios时传入的loading） */
  withoutLoading?: boolean;
  
  /**接口不节流(不等待上一个接口请求完成才发起下一次请求) */
  notThrottle?: boolean;
}
