<template>
    <div class="mb-table" :style="{ width: width + 'px' }" v-loading="loading">
        <ElTable :height="height" :data="props.data">
            <ElTableColumn v-for="column in columns" v-bind="column"></ElTableColumn>
        </ElTable>
    </div>
</template>

<script setup lang="ts">
import { MbSize } from "@/types/components";
import { ElTable, Column, ElTableColumn } from "element-plus";
import { computed, PropType } from "vue";

const props = defineProps({
    size: Object as PropType<MbSize>,
    columns: {
        type: Array as PropType<Column[]>,
        required: true,
    },
    data: {
        type: Array as PropType<Object[]>,
        default: () => ([])
    },
    loading: Boolean
})

const { width, height } = props.size || {};

const columns = computed(() => {
    return props.columns;
});
</script>