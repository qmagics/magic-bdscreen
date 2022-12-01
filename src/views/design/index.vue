<script setup lang="tsx">
import editor from '@/packages/editor/index';
import { MANAGER_KEY } from '@/packages/tokens';
import Api from '@/api/index';
import { provide, reactive, ref } from 'vue';
import manager from '@/packages/manager';
import { ConfigData } from '@/types';
import { sleep } from '@/utils';
import { ElForm, ElFormItem, ElInput } from 'element-plus';

provide(MANAGER_KEY, manager);

const props = defineProps({
    id: String
});

const state = reactive({
    loading: false
});

const configData = ref<ConfigData>({ id: '', container: { width: 100, height: 100 }, blocks: [], title: '' });

const formData = reactive({
    name: "",
    age: 22
});

const loadData = async () => {
    state.loading = true;
    const res = await Api.getBDSDetail(props.id!).finally(() => state.loading = false);

    if (res.code === 1) {
        configData.value = res.data;
    }
}

// 注册在线组件库
const registerOnlineComponentLib= async () => {
    await sleep(2000);
    manager.registerComponent<{ text: string }>({
        name: "在线组件1",
        type: "online1",
        icon: "text",
        category: "online",
        render: ({ props, size }) => {
            return <h1>{props.text}</h1>
        },
        editor({ props }) {
            return <ElForm>
                <ElFormItem label="文本">
                    <ElInput v-model={props.text}></ElInput>
                </ElFormItem>
            </ElForm>
        },
        defaultProps: {
            text: "oooo"
        }
    });
    // 图片
    manager.registerComponent<{ src: string }>({
        name: "云图片",
        type: "c-img",
        icon: "image",
        category: "online",
        render: ({ props, size }) => {
            return <h1>{props.src}</h1>
        },
        props: {
            // src: createInputProp('图片地址'),
        },
        defaultProps: {
            src: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.11665.com%2Fimg_p5%2Fi2%2F2201287339141%2FO1CN01yxhAXF2HOd84CRDJz_%21%212201287339141.jpg&refer=http%3A%2F%2Fimg.11665.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652368911&t=0f229c9586d21e9dd8257fdd9ccab0d7"
        },
        defaultSize: {
            width: 100,
            height: 100
        },
        resize: {
            width: true,
            height: true
        }
    })
}

registerOnlineComponentLib();

loadData();
</script>

<template>
    <editor v-model="configData" v-loading="state.loading" :formData="formData"></editor>
</template>