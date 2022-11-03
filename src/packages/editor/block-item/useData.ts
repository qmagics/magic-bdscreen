import { BlockData, DataSource, DataSourceType, RenderContextState } from "@/types";
import request from "@/utils/request";
import { watchDebounced } from "@vueuse/core";
import { Ref, ref, watch } from "vue";
import { isFunction, parseJSON } from "@/utils";

export interface UseDataParams {
    block: Ref<BlockData>;
    state: RenderContextState;
}

export const useData = ({ block, state }: UseDataParams) => {
    const data = ref<any>();

    const DEFAULT_FORMATTER_FN = (v: any) => v;
    const getFormatterFn = (datasource: DataSource) => {
        const { formatter } = datasource;
        const getFn = new Function('return ' + formatter);

        let fn = null;

        try {
            fn = getFn();
        } catch (error) { };

        if (!isFunction(fn)) return DEFAULT_FORMATTER_FN;

        return fn;
    }

    const getDataFromApi = async (datasource: DataSource) => {
        const { apiUrl } = datasource;

        const res = await request({
            url: apiUrl,
            method: 'get'
        });

        return res.data.data;
    }

    const getDataFromStaticData = (datasource: DataSource) => {
        const { staticData } = datasource;

        return parseJSON(staticData!);
    }

    const getResolvedData = async (datasource: DataSource) => {
        const { type } = datasource;

        let _data = null;

        if (type === DataSourceType.API) {
            _data = await getDataFromApi(datasource);
        }
        else if (type === DataSourceType.STATIC) {
            _data = getDataFromStaticData(datasource);
        }

        return _data;
    }

    const getFormatedData = (data: any, datasource: DataSource) => {
        const fn = getFormatterFn(datasource);

        return fn(data);
    }

    const refresh = async () => {
        const datasource = block.value.datasource;

        if (!datasource) return;

        state.loading = true;

        try {
            let _data = await getResolvedData(datasource);
            data.value = await getFormatedData(_data, datasource);
        } finally {
            state.loading = false
        }
    }

    watchDebounced([
        () => block.value.datasource?.apiUrl,
        () => block.value.datasource?.type,
        () => block.value.datasource?.staticData,
        () => block.value.datasource?.formatter
    ], refresh, { immediate: true, debounce: 300 });

    return {
        data,
        refresh
    }
}