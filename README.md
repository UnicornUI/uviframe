# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.



## 安装依赖

```shell
npm install axios js-cookie lodash nanoid normalize.css pinia qs vant vue-router

```
## 安装开发依赖

```shell
npm install @types/node @types/js-cookie @types/lodash @types/qs postcss postcss-modules postcss-pxtorem autoprefixer sass  -D

```


###  `unplugin-auto-import` 

-  在 vite 开发过程中使用的 vue, react 这样的框架中的组件使用的时候免去导入, 需要的 `vite.config.ts` 文件中添加如下配置

```shell
npm install unplugin-auto-import -D 

```
---

```ts
import autoImport from "unplugin-auto-import" 

export default defineConfig({
  // ...
  plugins: [
    vue(),
    autImport({
      imports: ['vue'],
      dts: "src/auto-import.d.ts"
    })
  ],
 // ...
})
```

### `unplugin-vue-components` 

- vant 组件的自动引入, 在 `vite.config.ts` 添加如下的配置之后可以实现自动的导入

```shell
npm insall unplugin-vue-components -D 
```
---

```ts
import Components from "unplugin-vue-components/vite";
import {VantResolver} from "unplugin-vue-components/resolvers";

export default defineConfig({
  // ...
  plugins: [
    vue(),
    autImport({
      imports: ['vue'],
      dts: "src/types/auto-import-vue.d.ts"
    }),
    Components({
        resolvers: [VantResolver()],
        dts: "src/types/auto-import-components.d.ts"
    })
  ],
 // ...
})
```

## 国际化支持


### 项目中的的多语言支持


### 第三方组件的多语言支持



## 主题定制

实现主题一键换肤的几种实现方案

 1. 针对不同去书写不同的样式文件，在系统初始化的时候，根据当前使用的主题，到server 端加载对应的样式文件来使用
 2. 通过 scss 变量与 scss 里面的函数和 mixin 来实现主题的定制
 3. 通过 css 变量来实现主题的定制



## axios 基础请求的封装


