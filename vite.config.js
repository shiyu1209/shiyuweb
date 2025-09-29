import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 把所有以 ion-icon 开头的标签视为自定义元素，跳过 Vue 组件解析
          isCustomElement: (tag) => tag.startsWith("ion-icon"),
        },
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});