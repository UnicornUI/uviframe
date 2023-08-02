import { get, isArray } from "lodash";
import { LOCALE_OPTIONS } from "@/utils/constants.ts";

import enUS from "vant/es/locale/lang/en-US";
import { Locale } from "vant";

// 
// 多语言版本的支持的实现方案，对应的文本的映射文件 `zh_CN.json` ....
//
//
type LanguagePackageFile = {
  [path: string]: {
    default: Record<string, string | string[]>
  }
}
const languagePackageTable: Record<string, string | string[]> = {}
// 存储本地缓存中的语言包定义的 key
const LocaleCacheKey = "locale"

// 最终导出的对象
export const initLanguagePackage = () => {
  // 使用 vite 提供的 api 来导入文件
  // eager: true 表示同步加载，不使用异步加载
  // 由于官方 api 的限制，我们不能再加载文件的路径中使用变量，只能是字符常量
  // 只能导入所有的语言映射文件
  mergeLanguagePackage(import.meta.glob("@/locales/*", { eager: true }))

  // 初始化第三方组件库的语言包
  initVantLangPackage()
}

// 使用的第三方的 UI 库组件的多语言版本的初始化
const initVantLangPackage = () => {
  const vantLanguagePackage: GlobalType.IRecord = {
    "en-US": enUS,
  }
  const locale = getLocale()
  vantLanguagePackage[locale] && (Locale.use(locale, vantLanguagePackage[locale]))
}

// 确定当前的语言环境
export const getLocale: () => string = () => {
  const defaultLocale = "zh-CN";
  let locale = defaultLocale;
  // 1.优先从登录者的自定义信息中获取语言环境
  const user = app.getAppCtl().getLoginUser()
  locale = get(user, "cust.locale") || ""

  // 2.从本地存储中获取
  locale = locale || tools.LocalStorage.getItem(LocaleCacheKey)

  // 3.使用默认的语言包
  locale = locale || defaultLocale
  return locale;
}

// 合并语言包
export const mergeLanguagePackage = (files: LanguagePackageFile) => {
  const locale = getLocale()
  for (const path in files) {
    if (-1 == path.indexOf(locale)) {
      continue;
    }
    const { default: languagePackageItem } = files[path]
    for (const key in languagePackageItem) {
      languagePackageTable[key] = languagePackageItem[key]
    }
  }
}

export type FnLanguageTrans = (key: string, option?: { index?: number, default?: string }) => string

// 获取对应文本的映射语言文本
export const lpk: FnLanguageTrans = (key, option = {}) => {
  const mixValue = languagePackageTable[key]
  if (isArray(mixValue)) {
    return mixValue[option.index || 0] || option.default || key
  }
  return mixValue || option.default || key
}

// 修改本地语言包后对应的切换功能
export const changeLocale = (locale: string) => {
  if (!LOCALE_OPTIONS.find(item => item === locale)) {
    return;
  }
  // TODO:: 1.如果用户登录，需要调用API 更新用户自定义语言环境
  //
  // 2.在本地缓存最新的语言包
  tools.LocalStorage.setItem(LocaleCacheKey, locale)
  // 3.重新加载页面
  document.location.reload()

}
