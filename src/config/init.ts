import { App } from "vue";
import app from "./app.ts";
import tools from "@/utils/tools.ts";
import { lpk } from "@/config/lpk.ts";
import { initLanguagePackage } from "@/config/lpk.ts";
import { initLoginUserInfo } from "@/controller/AppCtl.ts";
import { initTheme } from "@/config/theme.ts";
import ajax from "@/utils/request.ts";
// 挂载 app 全局对象
//

type GlobalVarKey = "app" | "lp" | "tools" | "Ajax"

type GlobalVars = {
  [key in GlobalVarKey]?: any
}

const GlobalVars: GlobalType.IRecord = {
  app, // 全局应用对象，包含一些全局数据
  tools,
  lpk,
  ajax
}

Object.keys(GlobalVars).forEach(key => {
  (window as any)[key as GlobalVarKey] = GlobalVars[key]
})

export const initApp = async () => {

  // 初始化基础业务相关的信息(比如 当前用户登录的信息)
  await initLoginUserInfo()


  // 主题定制
  // 1. 针对不同去书写不同的样式文件，在系统初始化的时候，根据当前使用的主题，到server 端加载对应的样式文件来使用
  // 2. 通过 scss 变量与 scss 里面的函数和 mixin 来实现主题的定制
  // 3. 通过 css 变量来实现主题的定制
  initTheme()

  // 初始化语言包
  initLanguagePackage()


  // 加载业务模块
  const allEntry: GlobalType.IRecord = import.meta.glob("@/bmod/*/entry.ts", { eager: true })
  for (const path in allEntry) {
    const entryFile = allEntry[path]
    entryFile && entryFile.init && entryFile.init()
  }
}

// 全局组件的初始化，主要符合全局组件的文件夹组成规范，都会被加载，
// 以 components 下的文件夹名称作为组件的名称注册到全局
// 
export const initGlobalComponents = (ui: App<Element>) => {
  const allGlobalComponents: GlobalType.IRecord = import.meta.glob("@/components/*/src/*.vue", { eager: true })
  Object.keys(allGlobalComponents).map(path => {
    console.log(path)
    const paths = path.split("/")
    const componentName = paths[paths.length - 3]
    ui.component(componentName, allGlobalComponents[path].default)
  })
}
