import { createApp } from 'vue'
import App from './App.vue'

// 引入样式文件
import "./assets/styles/base-theme.scss";
import "./assets/styles/blue-theme.scss";
import "./assets/styles/black-theme.scss";

import "normalize.css/normalize.css";
import "./assets/styles/global.scss";
import "./assets/fonts/iconfont.css";


import { initRouter } from "@/router";
import { initApp, initGlobalComponents } from "@/config/init"

(async () => {
  // 记载初始化系统基础配置信息（保证所有的基础数据加载完成后，才能创建 UI 对象)
  // 1. 全局变量(app)，语言包（lpk, ajax,  tools 的定义
  // 2. 异步加载基础模块的配置信息
  // 3. 异步加载业务模块，并完成基本的初始化
  await initApp()
  //
  const vmapp = createApp(App);

  // 挂载全局组件
  initGlobalComponents(vmapp);

  // 向根组件绑定全局对象
  vmapp.config.globalProperties.app = app;
  vmapp.config.globalProperties.tools = tools;
  vmapp.config.globalProperties.lpk = lpk;


  // 初始化状态管理于路由，挂载路由
  // 1. 初始化基础模块的路由
  // 2. 初始化业务模块的路由
  // 3. 对路由守卫进行处理
  // 4. keep-alive 的使用
  vmapp.use(initRouter())

  // 挂载 UI 到根组件
  vmapp.mount('#app')

})()

