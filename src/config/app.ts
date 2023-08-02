import appCtl from "@/controller/AppCtl.ts"
import sysConfig, {
  SysConfig, BmodItem
} from "./sysConfig.ts"
import { RouteRecordRaw } from "vue-router"
import { isArray } from "lodash";



// 存放所有业务模块对应的路由信息
let allBModRoutes: RouteRecordRaw[] = []

interface BModRouteOperate {
  registerBModRoute(mixRoute: RouteRecordRaw[] | RouteRecordRaw): void;
  getAllBModRoutes(): RouteRecordRaw[];
}

const routeBmodRouteOperate: BModRouteOperate = {
  registerBModRoute(mixRoute) {
    if (!mixRoute) {
      return;
    }
    if (isArray(mixRoute)) {
      allBModRoutes = allBModRoutes.concat(mixRoute)
      return;
    }
    allBModRoutes.push(mixRoute)
  },
  getAllBModRoutes() {
    return allBModRoutes;
  }
}

const app = {

  // 业务系统路由相关的操作
  ...routeBmodRouteOperate,

  // 加载系统配置信息
  getConfig<T>(key: keyof SysConfig): T {
    return sysConfig[key] as unknown as T
  },
  // 判断是否启用了指定的业务模块
  checkBmodEnabled(moduleName: string): boolean {
    const bmodItems: BmodItem[] = app.getConfig<BmodItem[]>("bmodNames");
    if (bmodItems.find(item => item.name == moduleName && item.enable)) {
      return true;
    }
    return false;
  },
  getAppCtl() {
    return appCtl;
  }
}

// 导出 IApp 类型，方便再全局声明后挂载
export type IApp = typeof app

export default app;
