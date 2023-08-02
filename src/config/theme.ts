import { THEME_OPTIONS } from "@/utils/constants.ts"
import { get } from "lodash";
//
// 系统主题的定义
//
// 本地存储的用户偏好设置的主题 key
const ThemeStorageName: string = 'theme';
// 当前系统的默认主题
const DefaultTheme: string = THEME_OPTIONS[0];

// 当前正在使用的主题
let currentTheme: string = "" ;


export const initTheme = () => {
  changeTheme(getTheme(), true);

}

// 修改主题
export const changeTheme: (theme: string, init: boolean) => void  = (theme, init=false) => {
  // 传递的主题名称非系统定义的主题, 不做任何操作
  if (!THEME_OPTIONS.find(item => item === theme)) {
    return
  }
  // 非首次进入并且与当前系统正在使用的主题相同，
  // 不做任何操作
  if (!init && currentTheme === theme) {
    return
  }
  currentTheme = theme;
  document.body.setAttribute("data-theme", theme);
  // 首次进入不做持久化
  if (init) {
    return;
  }
  // 如果用户已经登录，则需要调用 API 来更新用户主题
  // 
  // 本地持久化主题
  tools.LocalStorage.setItem(ThemeStorageName, currentTheme);
}

export const getTheme: () => string = () => {
  if (currentTheme) {
    return currentTheme;
  }
  const user = app.getAppCtl().getLoginUser();

  // 优先从用户偏好设置中获取
  currentTheme = get(user, "cust.theme") || "";
  // 其次从本地存储中获取
  currentTheme = currentTheme || tools.LocalStorage.getItem(ThemeStorageName);
  // 最终没有取到值则使用默认值
  currentTheme = currentTheme || DefaultTheme;

  return currentTheme;
}
