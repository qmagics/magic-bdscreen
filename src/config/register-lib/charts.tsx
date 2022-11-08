import { MbChartBar } from "@/components/mb-chart-bar";
import { Manager } from "@/packages/manager";
import { ECOption } from "@/plugins/echarts";
import { DataSourceType } from "@/types";
import { serializeJSON } from "@/utils";
import { Column } from "element-plus";

export default (manager: Manager) => {
    
    // 柱状图
    manager.registerComponent<{ option: ECOption }>({
        name: "柱状图",
        type: "mb-chart-bar",
        icon: "chart-bar",
        category: "chart",
        render: ({ props, size, data, state }) => {
            return <MbChartBar {...props} size={size} data={data} loading={state.loading}></MbChartBar>
        },
        defaultSize: {
            width: 300,
            height: 150,
        },
        resize: {
            width: true,
            height: true
        },
        defaultDatasource: {
            type: DataSourceType.STATIC,
            // apiUrl: "http://localhost:3000/car/list",
            staticData: serializeJSON({
                categories: [
                    '奥迪',
                    '宝马',
                    '奔驰'
                ],
                series: [
                    {
                        name: "售价",
                        data: [
                            120000,
                            346000,
                            286000
                        ]
                    }
                ]
            })
        },
        datasourceFormatterDesc:
            `type Formatter = (data: any) => ({ 
    categories: string[], 
    series: { 
        name: string, 
        data: number[] 
    }[] 
});`
    });

    // 饼图
    manager.registerComponent<{ columns: Column[] }>({
        name: "饼图",
        type: "mb-chart-pie",
        icon: "chart-pie",
        category: "chart",
        render: ({ props, size, data, state }) => {
            return <div>...</div>
        },
        defaultSize: {
            width: 100,
            height: 100,
        },
        resize: {
            width: true,
            height: true
        },
        defaultDatasource: {
            type: DataSourceType.API,
            apiUrl: "http://localhost:3000/car/list"
        }
    })
}