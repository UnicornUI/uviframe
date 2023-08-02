import UserApi, { User } from "@/api/UserApi.ts"
import { mergeLanguagePackage, changeLocale } from "@/config/lpk.ts"
import { LOGIN_PATH, LOGIN_TOKEN } from "@/utils/constants.ts"
import { changeTheme } from "@/config/theme.ts"

let loginUser: User = {

} as User

// 获取登录的用户
const getLoginUser: () => User = () => {
  return loginUser
}

const cleanLoginInfo: () => void = () => {
  loginUser = {} as User;
  tools.Cookie.removeCookie(LOGIN_TOKEN);
}

// 重定向到登录页面
const redirectToLogin: () => void = () => {
  cleanLoginInfo();
  document.location.href = LOGIN_PATH;
}

export const initLoginUserInfo = async () => {
  if (tools.Cookie.getCookie(LOGIN_TOKEN)) {
    loginUser = await UserApi.getSelfInfo()
    console.log("loginUser: ", loginUser)
  }
}

export default {
  cleanLoginInfo,
  redirectToLogin,
  getLoginUser,
  changeLocale,
  mergeLanguagePackage,
  changeTheme,
}
