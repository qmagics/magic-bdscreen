<script setup lang="ts">
import editor from '@/packages/editor/index';
import { MANAGER_KEY } from '@/packages/tokens';
import Api from '@/api/index';
import { provide, reactive, ref } from 'vue';
import manager from '@/packages/manager';
import { ConfigData } from '@/types';

const data = ref<ConfigData>({ id: '', container: { width: 100, height: 100 }, blocks: [], title: '' });
const state = reactive({
    loading: false
});

const props = defineProps({
    id: String
});

const loadData = async () => {
    state.loading = true;
    const res = await Api.getBDSDetail(props.id!).finally(() => state.loading = false);

    if (res.code === 1) {
        data.value = res.data;
    }
}

provide(MANAGER_KEY, manager);

loadData();
</script>

<template>
    <editor v-model="data" v-loading="state.loading"></editor>
</template>