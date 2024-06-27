二次封装 axios,前端项目通用。

- 开始使用

```ts
import { MiongAxios } from "axios";

const request = new MiongAxios({
  baseURL: useEnv.baseApiUrl,
  timeout: 10 * 1000,
  responseType: "json",
  headers: {
    Accept: "application/json",
  },
  //必传 请求头上携带的token
  token: localStorage.getItem("token") || "",
  /**
   * 必传 接口返回业务状态码字段
   * 例如接口返回 {
   * data:[1,2,3],
   * code:0,
   * msg:"请求成功"
   * }
   * 则businessCodeField 为 'code'
   */
  businessCodeField: "code",
  /**
   * 业务状态码映射执行的逻辑，例如 code为1代表操作异常 下面例子中 code为1时提示接口返回的msg信息
   */
  businessCodeMap: {
    200: () => console.log("code=>200_执行函数"),
    1: (data) => useMessage.error(data.msg),
  },
  /**http请求状态码映射逻辑 ，下列例子中 在接口http请求404时执行控制台输出 '请求出错——404' 具体根据自己业务进行配置*/
  httpCodeMap: {
    404: () => {
      console.log("请求出错——404");
    },
  },
  /**
   * 接口返回数据处理，统一处理接口返回的数据，
   * 例如接口返回数据为 {data:[1,2,3],msg:'请求成功',code:0}
   * 则下面responseDataHandle处理后业务代码中获取到的数据为 [1,2,3]
   */
  responseDataHandle: (res) => res.data,
  //请求中执行函数 分别在请求开始前和请求结束后会执行，回调时传入参数 isLoading 为true时请求开始前执行，为false时请求结束后执行
  loading(isLoading) {
    if (isLoading) {
      useMessage.loading("网络请求中");
    } else {
      useMessage.hideLoading();
    }
  },
});
```
