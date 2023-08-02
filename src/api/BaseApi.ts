import { BaseApiEnum } from "@/utils/constants.ts";
import { get } from "lodash";
import { Response } from "@/utils/request.ts";
type FnTransformUrlAndParam = (type: string, uriItem: BaseApiType.UriItem, params: GlobalType.IRecord) => { url: string; params: GlobalType.IRecord };
export { BaseApiEnum };

const transformUrlAndParam: FnTransformUrlAndParam = (type, uriItem, params = {}) => {

  let url = uriItem.path;
  if ("get" == type || "delete" == type) {
    // uri 类似值 /user/:id
    const idName = "id";
    url = url.replace(`:${idName}`, get(params, idName))
  }

  // url 和 参数的处理回调
  uriItem.fnUrlTrans && (uriItem.fnUrlTrans(url, params))
  uriItem.fnParamTrans && (uriItem.fnParamTrans(url, params))

  return {
    url,
    params,
  }
}


export default {
  init: <T = any, R = BaseApiType.BaseMethod<T>>(initParam: BaseApiType.InitParam<T>) => {
    const baseMethod: BaseApiType.BaseMethod<T> = {} as any
    [
      BaseApiEnum.GET,
      BaseApiEnum.LIST,
      BaseApiEnum.PUT,
      BaseApiEnum.POST,
      BaseApiEnum.PATCH,
      BaseApiEnum.DELETE
    ].map(method => {
      switch (method) {
        case (BaseApiEnum.GET): {
          baseMethod[method] = async (params: GlobalType.IRecord) => {
            return ajax.get<T>({
              ...transformUrlAndParam("get", get(initParam, "uri.get"), params)
            }).then(res => {
              return initParam.mapper ? initParam.mapper(res.data) : res.data;
            }).catch(e => {
              console.log(e.message);
              tools.handleApiError(get(initParam, "uri.get.errMsg", ""), e);
              return {} as T;
            });
          }
        }
          break;
        case BaseApiEnum.LIST: {
          baseMethod[method] = async (params: GlobalType.IRecord) => {
            const result: BaseApiType.ListResult<T> = {
              total: 0,
              items: [],
            }
            return ajax.get<T>({
              ...transformUrlAndParam("list", get(initParam, "uri.list"), params)
            }).then(res => {
              const { total, items = [] } = res.data as BaseApiType.ListResult<T>;
              result.total = total;
              result.items = items.map(item => initParam.mapper ? initParam.mapper(item) : item as T);
              return result;
            }).catch(e => {
              tools.handleApiError(get(initParam, "uri.list.errMsg", ""), e);
              return {} as BaseApiType.ListResult;
            });
          }
        }
          break;
        case BaseApiEnum.DELETE:
        case BaseApiEnum.PUT:
        case BaseApiEnum.PATCH:
        case BaseApiEnum.POST: {
          baseMethod[method] = async (params: GlobalType.IRecord) => {
            return ajax[method]<T>({
              ...transformUrlAndParam(method, get(initParam, `uri.${method}`), params)
            }).catch(e => {
              tools.handleApiError(get(initParam, `uri.${method}.errMsg`, ""), e);
              return {} as Response;
            })
          }
        }
      }
    });
    return baseMethod as R
  }
}
