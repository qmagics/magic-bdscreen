import { CodeEditorPlus } from "@/components/code-editor-plus";
import { MANAGER_KEY } from "@/packages/tokens";
import { BlockData, DataSource, DataSourceType } from "@/types";
import { ElFormItem, ElSelect, ElOption, ElInput } from "element-plus";
import { defineComponent, inject, PropType, toRef } from "vue";

export default defineComponent({
    props: {
        blockData: {
            type: Object as PropType<BlockData & { datasource: DataSource }>,
            required: true
        }
    },
    setup(props) {
        const manager = inject(MANAGER_KEY)!;
        const block = toRef(props, 'blockData');

        return () => {
            const component = manager.getComponentByType(block.value.type);
            const datasource = block.value.datasource;

            return <>
                <ElFormItem label="类型">
                    <ElSelect v-model={datasource.type}>
                        <ElOption value={DataSourceType.STATIC} label="静态数据"></ElOption>
                        <ElOption value={DataSourceType.API} label="API"></ElOption>
                    </ElSelect>
                </ElFormItem>
                {datasource.type === DataSourceType.API &&
                    <ElFormItem label="API接口地址">
                        <ElInput v-model={datasource.apiUrl}></ElInput>
                    </ElFormItem>
                }
                {datasource.type === DataSourceType.STATIC &&
                    <ElFormItem label="静态内容">
                        <CodeEditorPlus v-model={datasource.staticData} options={{ language: "json" }}></CodeEditorPlus>
                    </ElFormItem>
                }
                <ElFormItem label="格式化">
                    <CodeEditorPlus v-model={datasource.formatter} description={component.datasourceFormatterDesc} options={{ language: "javascript" }}></CodeEditorPlus>
                </ElFormItem>
                <ElFormItem label="结果预览">
                    {/* <CodeEditor modelValue={}></CodeEditor> */}
                </ElFormItem>
            </>
        }
    }
})