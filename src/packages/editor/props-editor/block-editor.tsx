import { MANAGER_KEY, COMMANDS_KEY } from "@/packages/tokens";
import { BlockData, DataSourceType } from "@/types";
import { deepClone, isArray } from "@/utils";
import { ElCollapse, ElCollapseItem, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption, ElSelect, ElTabPane, ElTabs } from "element-plus";
import { ComputedRef, defineComponent, inject, PropType, reactive } from "vue";
import controlMap from "./controlMap";
import { watchDebounced } from '@vueuse/core';
import DatasourcePanel from "./datasource-panel";

export default defineComponent({
    props: {
        block: {
            type: Object as PropType<ComputedRef<BlockData>>,
            required: true
        }
    },
    setup(props) {
        const manager = inject(MANAGER_KEY)!;

        const commands = inject(COMMANDS_KEY)!;

        return () => {
            const { block } = props;
            const component = manager.getComponentByType(block.value.type);
            const componentProps = component.props;

            // 重新构建属性编辑对象（不能直接修改，因为要添加进操作历史记录）
            const blockData = reactive<BlockData>(deepClone(block.value));

            // 监听并触发变更事件，需要防抖
            watchDebounced(blockData, (data) => {
                const newBlock = { ...block.value, ...data };
                commands.updateBlock(newBlock, block.value, `${component.name}<更新属性>`);
            }, { debounce: 0 });

            // 元素通用属性表单项
            const commonFormItems = (
                <>
                    <ElFormItem label="宽度">
                        <ElInputNumber v-model={blockData.size.width}></ElInputNumber>
                    </ElFormItem>
                    <ElFormItem label="高度">
                        <ElInputNumber v-model={blockData.size.height}></ElInputNumber>
                    </ElFormItem>
                    <ElFormItem label="X">
                        <ElInputNumber v-model={blockData.left}></ElInputNumber>
                    </ElFormItem>
                    <ElFormItem label="Y">
                        <ElInputNumber v-model={blockData.top}></ElInputNumber>
                    </ElFormItem>
                </>
            );

            // 元素对应的组件特有的属性表单项
            const componentFormItems = (
                () => {
                    // 如果有自定义的编辑器渲染函数，则使用该函数渲染组件属性编辑器
                    if (component.editor) {
                        return component.editor({ props: block.value.props, block: props.block })
                    }

                    let arr: any;

                    if (isArray(componentProps)) {
                        arr = <ElCollapse>
                            {
                                componentProps.map((group, index) => {
                                    const { label, props } = group;

                                    return (
                                        <ElCollapseItem title={label} name={index}>
                                            {
                                                Object.entries(props).map(([propName, propConfig]) => {
                                                    const { type, label } = propConfig as any;
                                                    return <ElFormItem label={label} prop={propName}>
                                                        {controlMap[type] && controlMap[type](blockData.props, propName, propConfig)}
                                                    </ElFormItem>
                                                })
                                            }
                                        </ElCollapseItem>
                                    )
                                })
                            }
                        </ElCollapse>
                    }
                    else {
                        arr = Object.entries(componentProps || {}).map(([propName, propConfig]) => {
                            const { type, label } = propConfig as any;
                            return <ElFormItem label={label} prop={propName}>
                                {controlMap[type] && controlMap[type](blockData.props, propName, propConfig)}
                            </ElFormItem>
                        });
                    }

                    return arr;
                }
            )();

            // 数据绑定表单项
            const databindFormItems = (() => {
                let arr: any[] = [];
                if (component?.model) {
                    arr.push(Object.entries(component.model).map(([modelName, label]) => {
                        return <ElFormItem label={label}>
                            <ElInput v-model={blockData.model[modelName]}></ElInput>
                        </ElFormItem>
                    }));
                }

                return arr;
            })();

            // 数据源配置
            const datasourceFormItems = (() => {
                if (!blockData.datasource) return;

                return <DatasourcePanel blockData={blockData as any}></DatasourcePanel>
            })();

            return (
                <ElForm class="block-editor" labelWidth="100px" labelPosition="top">
                    <ElTabs>
                        <ElTabPane label="属性">{componentFormItems}</ElTabPane>
                        <ElTabPane label="数据源">{datasourceFormItems}</ElTabPane>
                        <ElTabPane label="绑定">{databindFormItems}</ElTabPane>
                        <ElTabPane label="通用">{commonFormItems}</ElTabPane>
                    </ElTabs>
                </ElForm>
            )
        }
    }
});