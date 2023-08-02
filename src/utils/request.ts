// 
// 基于 axios 封装网络请求客户端
//
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import qs from "qs";
import { LOGIN_TOKEN, BaseApiEnum } from "./constants.ts";
import { get } from "lodash";
import app from "@/config/app.ts";

export interface AxiosRequestConfigExt extends AxiosRequestConfig {
  requestParam?: AxiosRequestConfigExt, // 请求参数
  showLoading?: boolean; // 是否显示loading提示
  needCachePrevent?: boolean; // 是否需要防止缓存(添加url随机数)
  needJsonStringify?: boolean; // 是否需要 JSON.stringify()
  needQsStringify?: boolean; // 是否需要将参数构建为表达格式
  forceToLogin?: boolean; // 是否强制跳转到登录页面
}

// 定义后端返回的统一类型
export interface Response<T = any> {
  code: number;
  data: T;
  msg: string;
}

// 定义该 baseApi 模块内全局变量
//
const axiosInstance: AxiosInstance = axios.create({
  baseURL: app.getConfig("baseUrl"),
  timeout: 10000,
});

// 声明的定时器的全局变量，用户接收 setTimeout 返回值
let timeLoading: TReturnOfSetTimeout

// baseApi 最终需要输出的方法
const allowMethod: string[] = [
  BaseApiEnum.GET,
  BaseApiEnum.POST,
  BaseApiEnum.PUT,
  BaseApiEnum.PATCH,
  BaseApiEnum.DELETE
].map(method => method.toUpperCase());


// 设置 axios 中的默认配置
axios.defaults.headers.head["content-type"] = "application/json;charset=utf-8;"

// 定义一个响应拦截器来处理网络请求的返回值
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 清除遮罩
    clearTimeout(timeLoading);
    tools.hideLoadMask();

    // 获取响应内容,已经外界调用请求时的参数值
    const { status, data, config } = response;
    const { requestParam = {} } = config as AxiosRequestConfigExt;
    const { forceToLogin = false } = requestParam;

    // 判断请求的状态
    if (200 == status) {
      if (data) {
        if (401 == data.code && forceToLogin) {
          app.getAppCtl().redirectToLogin();
          return
        } else if (data.code == 400 && data.code <= 404 || 500 == data.code) {
          return Promise.reject(data);
        }
      }
      return data;
    } else {
      return Promise.reject(data);
    }
  },
  (error) => {
    clearTimeout(timeLoading);
    tools.hideLoadMask();

    // 解析错误
    let { message = "Request error", response } = error;
    const errMsg = get(response, "data.msg", message);
    return Promise.reject({ msg: errMsg })
  }
);


type AjaxMethodType = BaseApiEnum.GET | BaseApiEnum.POST | BaseApiEnum.PUT | BaseApiEnum.PATCH | BaseApiEnum.DELETE;

const AllMethod: { [key in AjaxMethodType]: FnAjaxMethodHandler } = {} as any

// 封装的 Ajax 方法的类型
type FnAjaxMethodHandler = <T = any>(requestParam: AxiosRequestConfigExt) => Promise<Response<T>>;

allowMethod.map(method => {
  const func: FnAjaxMethodHandler = <T = any>(requestParam: AxiosRequestConfigExt | string): Promise<Response<T>> => {
    if ("GET" == method) {
      if ('string' == typeof requestParam) {
        requestParam = {
          url: requestParam,
          params: "",
        }
      }
    }
    return Ajax.request<T>(method, requestParam as AxiosRequestConfigExt);
  }
  AllMethod[method.toLowerCase() as AjaxMethodType] = func;
})

const Ajax = {
  ...AllMethod,
  request<T = any>(method: string, requestParam: AxiosRequestConfigExt): Promise<Response<T>> {
    // 获取请求参数
    let {
      url,
      params,
      headers = {},
      timeout,
      showLoading = true,
      needCachePrevent,
      needJsonStringify,
      needQsStringify,
    } = requestParam;

    // 判断是否需要显示Loading
    if (false !== showLoading) {
      clearTimeout(timeLoading);
      timeLoading = setTimeout(() => {
        tools.showLoadMask();
      }, 200);
    }
    // 判断是否需要防止缓存
    needCachePrevent && (url = tools.addCachePrevent(url))

    // 判断是否需要对参数 JSON.stringify()
    needJsonStringify && (params = JSON.stringify(params))

    // 判断是否需要对参数 qs.stringify()
    needQsStringify && (params = qs.stringify(params))

    // 
    const token = tools.Cookie.getCookie(LOGIN_TOKEN)
    token && (headers.Authorization = `Bearer ${token}`)

    // 重新构建参数对象
    const sendParam: AxiosRequestConfigExt = {
      requestParam,
      url,
      method: (allowMethod.indexOf(method) > -1 ? method : "GET"),
      [method === "GET" ? "params" : "data"]: params,
      headers: Object.assign({}, headers),
    }

    // 覆盖 timeout 
    timeout && (sendParam.timeout = timeout)

    return axiosInstance.request(sendParam);
  }
}

export type AjaxInterface = typeof Ajax
export default Ajax
