<script setup lang="ts">
import api from '@/api';
import { ConfigData } from '@/types';
import { ref } from 'vue';

const items = ref<ConfigData[]>();

const refresh = async () => {
    const res = await api.getBDSList();
    items.value = res.data;
}

refresh();
</script>

<template>
    <router-link style="padding:20px;" v-for="i in items" :to="`/design/${i.id}`">{{i.title}}</router-link>
</template>