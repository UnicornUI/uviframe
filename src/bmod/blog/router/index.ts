import { RouteRecordRaw } from "vue-router";
import moduleConfig from "../config/moduleConfig.ts";

import Index from "../views/index/index.vue";
import ArticleDetail from "../views/article/detail/Article.vue";
import ArticleEdit from "../views/article/detail/Edit.vue";
import { ROUTER_VIEW_KEY } from "@/utils/constants.ts";
export const initRoutes = () => {
  const modulePrefix = `${moduleConfig.module}`;

  // 当前模块下的路由信息
  const mRoutes: RouteRecordRaw[] = [
    {
      path: `/${modulePrefix}`,
      name: `${modulePrefix}-index`,
      component: Index,
      meta: {
        title: lpk("blog"),
        requireAuth: false,
        belongToRouteViewKey: ROUTER_VIEW_KEY.Index
      },
    },
    {
      path: `/${modulePrefix}/article/detail/:id`,
      name: "articleDatail",
      component: ArticleDetail,
      meta: {
        title: "",
        requreAuth: false,
      }
    },
    {
      path: `/${modulePrefix}/article/edit`,
      name: "articleEdit",
      component: ArticleEdit,
      meta: {
        title: lpk("page.blog.article.edit"),
      }
    }
  ]
  app.registerBModRoute(mRoutes);
}

