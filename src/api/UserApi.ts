import { get } from "lodash";
import baseApi, { BaseApiEnum } from "@/api/BaseApi.ts";

export interface User {
  id: number;
  name: string;
}

const initBaseApiParams: BaseApiType.InitParam = {
  uri: {
    [BaseApiEnum.GET]: {
      path: "/user/:id",
      errMsg: "user.get.errMsg"
    },
    [BaseApiEnum.LIST]: {
      path: "/user",
      errMsg: "user.list.errMsg"
    },
    [BaseApiEnum.POST]: {
      path: "/user",
      errMsg: "user.post.errMsg",
    }
  },
  mapper(item) {
    return {
      id: get(item, "ID"),
      name: get(item, "name"),
    }
  }
}


// User 相关的请求方法

export default {
  ...baseApi.init<User, Pick<BaseApiType.BaseMethod<User>, BaseApiEnum.GET | BaseApiEnum.LIST | BaseApiEnum.POST>>(initBaseApiParams),
  getSelfInfo(): Promise<User> {
    return Promise.resolve({
      id: 1,
      name: "zs",
    })
  },
}
