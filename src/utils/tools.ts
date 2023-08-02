import cookies from "js-cookie";

// 获取随机数
const cachePreventRandom = Math.random();
// 防止随机数出现重复, 添加一个缓存计数器
let cacheNum = 0;
// 工具类对象
const Tools = {
  // 防止 API 命中本地缓存
  addCachePrevent: (url: string = "") => {
    const queryString = url.indexOf("?");
    url += `${(-1 == queryString ? "?" : "&")}cp=${(cacheNum++ + cachePreventRandom)}`
    return url
  },

  show: (title: string, msg: string) =>{
    alert(`${title}:${msg}`)
  },


  handleApiError: (
    title: string, 
    res: (string | {msg: string}) = { msg: ""}, 
    options:{isShowInfo: boolean} = { isShowInfo: true } 
  ) => {
    if ('string' == typeof res) {
      res = { msg: res };
      title = lpk(title);
      const content = lpk(res.msg) || "";
      const errorMsg = `${title}:${content}`
      if (false !== options.isShowInfo) {
        tools.show(title, content);
      }
      window.console && window.console.log && window.console.log(res)
      throw errorMsg;
    }
  },


  // 显示全局遮罩
  showLoadMask: () => {

  },
  // 隐藏全局遮罩
  hideLoadMask: () => {

  },

  // 路由操作命名空间
  Router: {},
  // 状态管理命名空间
  Store: {},
  // 本地存储命名空间
  LocalStorage: {
    setItem: (key: string, value: any) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key: string) => {
      const value = localStorage.getItem(key);
      try {
        return JSON.parse(value as string);
      } catch (e) {
        return value;
      }
    },
    removeItem: (key: string) => {
      localStorage.removeItem(key);
    }
  },
  // Cookie 管理命名空间
  Cookie: {
    SetCookie: (key: string, value: any) => {
      cookies.set(key, value, { expires: 30 })
    },
    getCookie: (key: string, defaultValue?: any) => {
      const value = cookies.get(key) || defaultValue;
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    },
    removeCookie: (key: string) => {
      cookies.remove(key);
    }
  },
  // 日期时间操作命名空间
  Time: {},
  // DOM 元素操作命名空间
  Dom: {},
}

// 
export type ITools = typeof Tools

export default Tools;
