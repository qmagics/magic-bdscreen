import { ConfigData } from "@/types";
import { sleep } from "@/utils";
import { RequestParams, RequestResponse } from "./interface";

export default {
    // 获取大屏列表
    async getBDSList(params?: RequestParams): Promise<RequestResponse<ConfigData[]>> {
        const { default: rows } = await import('../mocks/data.json');
        return {
            code: 1,
            data: rows,
        }
    },

    // 根据大屏id获取配置数据
    async getBDSDetail(id: string): Promise<RequestResponse<ConfigData>> {
        const { default: mockData } = await import('../mocks/data.json');
        await sleep(400);

        return {
            code: 1,
            data: mockData.find(i => i.id === id)!
        }
    },

    // 更新大屏配置数据

    // 新增大屏配置数据

    // 根据id删除大屏



    // 获取数据源列表

    // 获取数据源详情

    // 新增数据源

    // 删除数据源

    // 更新数据源


    // 获取远程物料列表

    // 获取远程物料详情
}