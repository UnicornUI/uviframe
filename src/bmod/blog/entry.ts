
import moduleConfig from "./config/moduleConfig.ts"
import { initRoutes } from "./router/index.ts";
export const init = () => {
  // 检测当前模块是否开启，如果开启则初始化，否则不初始化
  if (!app.checkBmodEnabled(moduleConfig.module)) {
    return
  }

  // 初始化当前模块的语言包
  app.getAppCtl().mergeLanguagePackage(import.meta.glob("./locales/*", { eager: true }))
  console.log(lpk("blog"))
  // 初始化当前模块的配置信息


  // 初始化当前模块的状态管理信息


  // 初始化当前模块的路由信息
  initRoutes();
}

export default {}
