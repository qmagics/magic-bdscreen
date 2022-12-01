import { BlockData, DataSource, DataSourceType, RenderContextState } from "@/types";
import request from "@/utils/request";
import { onMounted, Ref, ref } from "vue";
import { isFunction, parseJSON } from "@/utils";

export interface UseDataParams {
    block: Ref<BlockData>;
    refreshImmediate?: boolean;
    // state: RenderContextState;
}

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

    return res.data;
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

export const getData = async (datasource: DataSource) => {
    let _data = await getResolvedData(datasource);

    const data = await getFormatedData(_data, datasource);

    return data;
}

export const useData = ({ block, refreshImmediate = true }: UseDataParams) => {
    const data = ref<any>();

    const loading = ref(false);

    const refresh = async () => {
        const datasource = block.value.datasource;

        if (!datasource) return;

        loading.value = true;

        try {
            data.value = await getData(datasource);
            // let _data = await getResolvedData(datasource);
            // data.value = await getFormatedData(_data, datasource);
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        refreshImmediate && refresh();
    });

    return {
        data,
        loading,
        refresh
    }
}