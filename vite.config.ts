import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import {VantResolver} from "unplugin-vue-components/resolvers";

import { resolve } from 'path'
import postCssPxToRem from "postcss-pxtorem"
import autoprefixer from "autoprefixer"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 9999,
    cors: true,
  },
  plugins: [
    vue(),
    autImport({
      imports: ['vue'],
      dts: "src/types/auto-import-vue.d.ts"
    }),
    Components({
      resolvers: [VantResolver()],
      dts: "src/types/auto-inport-components.d.ts"
    })
  ],
  resolve: {
    alias: {
      // 配置路径别名
      '@': resolve(__dirname, "src"),
    },
    // 配置解析文件的别名
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.mjs'],
  },
  // 参考配置 https://cn.vitejs.dev/config/shared-options.html 
  // vite 中已经内置了less/scss/sass/stylus 等 css 预处理器，直接进行安装，
  // 不需要像 webpack 那样安装 loader 和配置
  css: {
    preprocessorOptions: {
      scss: {
        // 将自定义的变量配置引入到项目中
        additionalData: `@use "@/assets/styles/global-scss-var.scss" as *;`,
      }
    },
    // vite 已经集成了 postcss
    // https://vitejs.cn/config/#css-postcss
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: [
            "Android 4.1",
            "IOS 7.1",
            "Chrome > 31",
            "ff > 31",
            "ie >=8",
            "> 1%",
          ],
          grid: true,
        }), {
          // vite 打包的时候出现 charset utf-8 的警告信息，如果不想看到这些信息，
          // 添加这些配置
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charst: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove()
              }
            }
          }
        },
        postCssPxToRem({
          rootValue: 100, // (设计稿/10) 1rem 的大小, 具体定义见 global.scss 中 html { font-size: 26.6666667; } 定义
          propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
          selectorBlackList: ['.norem'],
          exclude: /node_modules/i,
        })
      ]
    },
  }
})



