import { BlockData, DataSourceType, RenderContextState } from "@/types";
import request from "@/utils/request";
import { Ref, ref } from "vue";
import { parseJSON } from "@/utils";

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

    const init = () => {
        const v = block.value.datasource;

        if (!v) return;

        const { type, staticData, apiUrl } = v;

        if (type === DataSourceType.API) {
            refresh();
        }
        else if (type === DataSourceType.STATIC) {
            if (staticData) {
                data.value = parseJSON(staticData);
            }
        }
    }

    init();

    return {
        data,
        refresh
    }
}