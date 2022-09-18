import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import 'element-plus/theme-chalk/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import '@/styles/index.scss';
import { ElButton, ElLoading } from 'element-plus';
import Panel from '@/components/panel';
import { createPinia } from 'pinia';

const app = createApp(App);

// 按需引入element-plus组件
app.use(ElButton);
app.use(ElLoading);

// 注册全局组件
app.use(Panel);

app.use(router);

app.use(createPinia());

app.mount('#app')
