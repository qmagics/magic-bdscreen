import { BlockData, DataSourceType, RenderContextState } from "@/types";
import request from "@/utils/request";
import { watchDebounced } from "@vueuse/core";
import { Ref, ref, watch } from "vue";

export interface UseDataParams {
    block: Ref<BlockData>;
    state: RenderContextState;
}

export const useData = ({ block, state }: UseDataParams) => {
    const data = ref<any>();

    const refresh = async () => {
        state.loading = true;

        const res = await request({
            url: block.value.datasource!.apiUrl,
            method: 'get'
        }).finally(() => state.loading = false);

        data.value = res.data.data;
    }

    watchDebounced([() => block.value.datasource?.apiUrl, () => block.value.datasource?.type, () => block.value.datasource?.staticData], () => {
        const v = block.value.datasource;

        if (!v) return;

        const { type, staticData, apiUrl } = v;

        if (type === DataSourceType.API) {
            refresh();
        }
        else if (type === DataSourceType.STATIC) {
            data.value = staticData;
        }
    }, { immediate: true });

    return {
        data,
        refresh
    }
}