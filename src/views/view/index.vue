<script setup lang="ts">
import renderer from '@/packages/renderer/index';
import { MANAGER_KEY } from '@/packages/tokens';
import Api from '@/api/index';
import { provide, reactive, ref } from 'vue';
import manager from '@/packages/manager';
import { ConfigData } from '@/types';

provide(MANAGER_KEY, manager);

const props = defineProps({
    id: String
});

const state = reactive({
    loading: false
});

const loadData = async () => {
    state.loading = true;
    const res = await Api.getBDSDetail(props.id!).finally(() => state.loading = false);

    if (res.code === 1) {
        configData.value = res.data;
    }
}

const configData = ref<ConfigData>({ id: '', container: { width: 100, height: 100 }, blocks: [], title: '' });

const formData = reactive({
    name: "",
    age: 22
});

loadData();
</script>

<template>
    <renderer :configData="configData" v-loading="state.loading" :formData="formData"></renderer>
</template>