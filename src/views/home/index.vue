<script setup lang="ts">
import api from '@/api';
import { ConfigData } from '@/types';
import { ElCard, ElCol, ElRow } from 'element-plus';
import { ref } from 'vue';

const items = ref<ConfigData[]>();

const refresh = async () => {
    const res = await api.getBDSList();
    items.value = res.data;
}

refresh();
</script>

<template>
    <ElRow :gutter="20">
        <ElCol :span="6" v-for="i in items">
            <ElCard :header="i.title">
                <router-link :to="`/design/${i.id}`">设计</router-link>
                &nbsp;&nbsp;
                <router-link :to="`/view/${i.id}`">查看</router-link>
            </ElCard>
        </ElCol>
    </ElRow>
</template>