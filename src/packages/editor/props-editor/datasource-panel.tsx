import { CodeEditor } from "@/components/code-editor";
import { CodeEditorPlus } from "@/components/code-editor-plus";
import { BlockData, DataSource, DataSourceType } from "@/types";
import { ElFormItem, ElSelect, ElOption, ElInput } from "element-plus";
import { defineComponent, PropType, toRef } from "vue";

export default defineComponent({
    props: {
        blockData: {
            type: Object as PropType<BlockData & { datasource: DataSource }>,
            required: true
        }
    },
    setup(props) {
        const block = toRef(props, 'blockData');

        return () => {
            return <>
                <ElFormItem label="类型">
                    <ElSelect v-model={block.value.datasource.type}>
                        <ElOption value={DataSourceType.STATIC} label="静态数据"></ElOption>
                        <ElOption value={DataSourceType.API} label="API"></ElOption>
                    </ElSelect>
                </ElFormItem>
                {block.value.datasource.type === DataSourceType.API &&
                    <ElFormItem label="API接口地址">
                        <ElInput v-model={block.value.datasource.apiUrl}></ElInput>
                    </ElFormItem>
                }
                {block.value.datasource.type === DataSourceType.STATIC &&
                    <ElFormItem label="静态内容">
                        <CodeEditor v-model={block.value.datasource.staticData} options={{ language: "json" }}></CodeEditor>
                    </ElFormItem>
                }
                <ElFormItem label="格式化">
                    <CodeEditorPlus v-model={block.value.datasource.formatter}></CodeEditorPlus>
                </ElFormItem>
            </>
        }
    }
})