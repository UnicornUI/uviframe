import { createRouter, RouteRecordRaw, Router, createWebHistory } from "vue-router";
import { get } from "lodash";

// 导入组件
import Index from "@/views/index/Index.vue";
import Home from "@/views/index/Home.vue";
import Mine from "@/views/mine/Mine.vue";
import Test from "@/views/test/Test.vue";
import Login from "@/views/login/Login.vue";
import Register from "@/views/login/Register.vue";
import NotFound from "@/views/NotFound.vue";
import { LOGIN_PATH, ROUTER_VIEW_KEY } from "@/utils/constants.ts"

// 定义一个路由扩展类型, 
// 后续可以向 children 中增加路由
type RouteRecordRawExt = RouteRecordRaw & { children?: RouteRecordRawExt[] }

// 赋值全局路由表
let gRoutes: RouteRecordRawExt[] = []

export const initRouter: () => Router = () => {
  let routes: RouteRecordRawExt[] = [
    { path: "/test", name: "test", component: Test },
    { path: "/", "redirect": "/index" },
    {
      path: "/index",
      name: "index",
      component: Index,
      meta: {
        title: lpk("page.index.title"),
        requireAuth: false,
        holdRouteViewKey: ROUTER_VIEW_KEY.Index
      },
      children: [
        {
          path: "",
          name: "home",
          component: Home,
          meta: {
            requireAuth: false,
          }
        },
        {
          path: "/mine",
          name: "mine",
          component: Mine,
          meta: {
            title: lpk("page.mine.title"),
            keepAlive: false,
            cmpName: "Mine",
          }
        }
      ]
    },
    {
      path: LOGIN_PATH,
      name: "login",
      component: Login,
      meta: {
        title: lpk("page.login.title"),
        requireAuth: false,
      }
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: {
        title: lpk("page.register.title"),
        requireAuth: false
      }
    },
  ]

  // 整合业务模块的路由信息
  routes = routes.concat(app.getAllBModRoutes())

  // Not Found 放到最后, 所有路由都找不到就返回 404 页面
  routes.push(
    { path: "/:pathMatch(.*)*", name: "notfound", component: NotFound }
  );

  gRoutes = routes;

  // 处理从属路由的父子关系
  gatherBelongToRoute()

  console.log(gRoutes)

  const router = createRouter({
    history: createWebHistory(),
    routes: routes,
  })

  router.beforeEach((to, _, next) => {
    const loginUserId = get(app.getAppCtl().getLoginUser(), "id", "")
    if (!loginUserId && to.matched.some(record => false !== get(record, "meta.requireAuth"))) {
      next({
        path: LOGIN_PATH,
        query: { redirect: to.fullPath }
      })
      return
    }
    // 已登录。进入登录页面时，直接跳转主页
    if (loginUserId && to.path == LOGIN_PATH) {
      next("/")
      return
    }
    // 已经登录直接放行
    next()
  })


  // 实现一个路由的后置钩子, 如果路由表中定义了标题内容则更新页面标题
  router.afterEach((to, _) => {
    const title = get(to, "meta.title", "");
    title && (document.title = title as string)
  });

  return router;
}

//
// 对于有特殊需求的，需要设置路由归属关系的需要根据自己定义的 key 来进行组合
const gatherBelongToRoute = () => {
  const _Do = (hostRoute: RouteRecordRawExt, aRoutes: RouteRecordRawExt[]) => {
    // 取出对应的 holdRouteViewKey, 找到对应的子记录后添加到父记录中
    const holdRouteViewKey = get(hostRoute, "meta.holdRouteViewKey");
    if (!holdRouteViewKey || !aRoutes.length) {
      return;
    }
    for (let i = 0; i < aRoutes.length;) {
      const foundItem = aRoutes[i]
      if (hostRoute == foundItem) {
        i++;
        continue;
      }
      if (holdRouteViewKey == get(foundItem, "meta.belongToRouteViewKey")) {
        // 没有 children 属性则赋值空数组
        hostRoute.children = hostRoute.children || []
        // 将当前找到的属于对应节点的子路由注入到父节点中
        hostRoute.children.push(foundItem)
        aRoutes.splice(i, 1)
      } else {
        foundItem.children && (_Do(hostRoute, foundItem.children))
        i++;
      }
    }
  }
  gRoutes.map(item => _Do(item, gRoutes));
}

