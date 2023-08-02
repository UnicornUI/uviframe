import { IApp } from "@/config/app.ts"
import { ITools } from "@/utils/tools.ts"
import { FnLanguageTrans } from "@/config/lpk.ts"
import { AjaxInterface } from "@/utils/request.ts";
import { Response } from "@/utils/request.ts";


// 扩展 window 对象，给该对象增加全局对象
declare global {
  declare namespace GlobalType {
    type IKey = string | number;
    type IRecord = Record<IKey, any>
  }

  declare namespace BaseApiType {

    interface BaseMethod<T> {
      get: (params: GlobalType.IRecord) => Promise<T>;
      list: (params: GlobalType.IRecord) => Promise<ListResult<T>>;
      post: (params: GlobalType.IRecord) => Promise<Response>;
      put: (params: GlobalType.IRecord) => Promise<Response>;
      patch: (params: GlobalType.IRecord) => Promise<Response>;
      delete: (params: GlobalType.IRecord) => Promise<Response>;
    }

    interface ListResult<T = any> {
      total: number;
      items: T[];
    }

    interface UriItem {
      path: string;
      errMsg: string;
      fnUrlTrans?: (url: string, params: GlobalType.IRecord) => string;
      fnParamTrans?: (url: string, params: GlobalType.IRecord) => GlobalType.IRecord;
    }
    interface Uri {
      [key: string]: UriItem
    }
    interface InitParam<T = IRecord> {
      mapper?: (item: IRecord) => T;
      uri: Uri
    }
  }

  // 声明一个全局变量 app 
  const app: IApp;
  const tools: ITools;
  const lpk: FnLanguageTrans;
  const ajax: AjaxInterface;

  type TReturnOfSetTimeout = ReturnType<typeof setTimeout>
  // 这里对 Window 声明一个 app 的全局对象，后续在 main.ts 中
  // 将这个 window.app 对象挂载到 vue 对象中
  interface Window {
    app: IApp,
    tools: ITools,
    lpk: FnLanguageTrans,
    ajax: AjaxInterface,
  }
}

// vue 中如果想要使用全局定义的变量，需要将这个变量声明到全局的 vue 模块中
// 参考官方文档 https://vuejs.org/api/utility-types.html#extractpublicproptypes

declare module "vue" {
  interface ComponentCustomProperties {
    app: IApp
    tools: ITools,
    lpk: FnLanguageTrans,
  }
}

export { }



