<script setup lang="ts">
const props = defineProps({
    title: String
});
</script>

<template>
    <div class="panel">
        <div class="panel__header">
            <slot name="header">
                {{title}}
            </slot>
        </div>
        <div class="panel__body">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss">
$header-height: 50px;

.panel {
    height: 100%;

    &__header {
        height: $header-height;
        line-height: $header-height;
        box-sizing: border-box;
        border-bottom: 1px solid $border-color-1;
    }

    &__body {
        height:calc(100% - #{$header-height});
        overflow: auto;
    }
}
</style>