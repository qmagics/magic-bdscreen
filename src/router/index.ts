import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        redirect: "/home"
    },
    {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        props: true,
        meta: {
            title: "首页"
        }
    },
    {
        path: '/design/:id',
        component: () => import('@/views/design/index.vue'),
        props: true,
        meta: {
            title: "大屏设计"
        }
    },
    {
        path: '/view/:id',
        component: () => import('@/views/view/index.vue'),
        props: true,
        meta: {
            title: "大屏查看"
        }
    },
    {
        path: "/404",
        component: () => import("@/views/common/404.vue")
    },
    {
        path: "/:pathMatch(.*)*",
        redirect: '/404'
    }
];

export default createRouter({
    routes,
    history: createWebHistory('/')
})