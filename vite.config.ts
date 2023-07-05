import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv, type UserConfigExport } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { visualizer } from "rollup-plugin-visualizer";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { WltechUIResolver } from "@wltech/resolver";
import { createHtmlPlugin } from "vite-plugin-html";
import autoprefixer from "autoprefixer";
import basicSsl from "@vitejs/plugin-basic-ssl";
// import legacy from '@vitejs/plugin-legacy'

export default defineConfig(({ command, mode }) => {
  console.log(command);
  const env = loadEnv(mode, process.cwd(), "");
  const plugins = [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ["ww-open-data"].includes(tag),
        },
      },
    }),
    vueJsx(),
    basicSsl(),
    AutoImport({
      resolvers: [
        ElementPlusResolver({
          // importStyle: false,
        }),
        WltechUIResolver({
          // importStyle: false,
        }),
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          // importStyle: false,
        }),
        WltechUIResolver({
          // importStyle: false,
        }),
      ],
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          ...env,
        },
      },
    }),
    // env.VITE_MODE == "dev" && mkcert(),
    // legacy({
    //   targets: ['defaults', 'not IE 11']
    // })
  ];
  const base = env.VITE_PUBLIC_PATH;

  if (env.REPORT) {
    plugins.push(visualizer({ open: true }));
  }

  const config: UserConfigExport = {
    base,
    plugins,
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    // define:{
    //   "__COS__": JSON.stringify('https://wlmvp-cos.weiling.cn/website/worktable-erp/')
    // },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/scss/_global_scss_variable.scss" as *;`,
          // prependData: `@use "@/assets/scss/_global_scss_variable.scss" as *;`
        },
      },
      postcss: {
        plugins: [autoprefixer],
      },
    },
    build: {
      sourcemap: env.VITE_MODE == "uat" || env.VITE_MODE == "dev",
    },

    server: {
      https: true,
      // host: "weiling-frontend.cn",
      port: 8888,
      proxy: {
        "/proxy_api": {
          target: "https://mkt.demo.weiling.cn", //代理接口
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy_api/, ""),
        },
        "/cos_api": {
          target: env.VITE_APP_COS_URL, //代理接口
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/cos_api/, ""),
        },
        "/pay_api": {
          target: "https://pay.demo.weiling.cn", //代理接口
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/pay_api/, ""),
        },
      },
    },
  };

  return config;
});
