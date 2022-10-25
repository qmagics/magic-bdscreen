import { defineConfig } from 'vite'
import path from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use 'sass:math';@import "@/styles/var.scss";@import "@/styles/mixin.scss";`
      }
    }
  },
  server: {
    port: 8888,
    open: true
  }
})
