import { CodeEditor } from "@/components/code-editor";
import { CodeEditorPlus } from "@/components/code-editor-plus";
import config from "@/config";
import { useData } from "@/packages/hooks/useData";
import { MANAGER_KEY } from "@/packages/tokens";
import { BlockData, DataSource, DataSourceType } from "@/types";
import { serializeJSON } from "@/utils";
import { watchDebounced } from "@vueuse/core";
import { ElFormItem, ElSelect, ElOption, ElInput, ElButton, ElRow, ElCol } from "element-plus";
import { computed, defineComponent, inject, PropType, toRef } from "vue";

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

        const { data, refresh, loading } = useData({ block });

        // 预览结果JSON
        const dataPreview = computed(() => serializeJSON(data.value));

        // 数据源变更后自动计算预览结果
        if (config.autoRefreshPreviewData) {
            watchDebounced([
                () => block.value.datasource?.apiUrl,
                () => block.value.datasource?.type,
                () => block.value.datasource?.staticData,
                () => block.value.datasource?.formatter
            ], refresh, { immediate: true, debounce: config.dataRefreshDebounce });
        }

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
                <ElFormItem>
                    {{
                        label: () => {
                            return <ElRow justify="space-between">
                                <ElCol span={12}>
                                    结果预览
                                </ElCol>
                                <ElCol span={12} class="text-right">
                                    <ElButton onClick={refresh} type="primary" plain loading={loading.value}>刷新结果</ElButton>
                                </ElCol>
                            </ElRow>
                        },
                        default: () => <CodeEditor modelValue={dataPreview.value} options={{ language: "json", readOnly: true }}></CodeEditor>
                    }}
                </ElFormItem>
            </>
        }
    }
})