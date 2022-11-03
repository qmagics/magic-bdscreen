import 'element-plus/theme-chalk/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import '@/styles/index.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { ElButton, ElInput, ElLoading } from 'element-plus';
import App from './App.vue';
import router from '@/router';
import SvgIcon from '@/components/svg-icon';
import '@/plugins/echarts';

// 导入字体
import "//at.alicdn.com/t/c/font_3664032_hgl2336cy9d.js";

// 创建应用
const app = createApp(App);

// 按需引入element-plus组件
app.use(ElButton);
app.use(ElInput);
app.use(ElLoading);

// 注册全局组件
app.use(SvgIcon);

// 路由
app.use(router);

// 状态管理
app.use(createPinia());

// 挂在应用
app.mount('#app');

