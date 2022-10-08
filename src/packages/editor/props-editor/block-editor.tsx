import { MANAGER_KEY, COMMANDS_KEY } from "@/packages/tokens";
import { BlockData } from "@/types";
import { deepClone, isArray } from "@/utils";
import { ElForm, ElFormItem, ElInputNumber } from "element-plus";
import { ComputedRef, defineComponent, inject, PropType, reactive } from "vue";
import controlMap from "./controlMap";
import { watchDebounced } from '@vueuse/core';

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
            const blockData = reactive(deepClone(block.value));

            // 监听并触发变更事件，需要防抖
            watchDebounced(blockData, (data) => {
                const newBlock = { ...block.value, ...data };
                commands.updateBlock(newBlock, block.value, `${component.name}<更新属性>`);
            }, { debounce: 0 });

            // 元素通用属性
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
                    let arr: any = [];

                    if (isArray(componentProps)) {
                        arr = componentProps.map(group => {
                            const { label, props } = group;

                            return (
                                <div class="block-editor-group">
                                    <div class="block-editor-group__title">{label}</div>
                                    <div class="block-editor-group__content">
                                        {
                                            Object.entries(props).map(([propName, propConfig]) => {
                                                const { type, label } = propConfig as any;
                                                return <ElFormItem label={label} prop={propName}>
                                                    {controlMap[type] && controlMap[type](blockData.props, propName, propConfig)}
                                                </ElFormItem>
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                    else {
                        arr = Object.entries(componentProps).map(([propName, propConfig]) => {
                            const { type, label } = propConfig as any;
                            return <ElFormItem label={label} prop={propName}>
                                {controlMap[type] && controlMap[type](blockData.props, propName, propConfig)}
                            </ElFormItem>
                        });
                    }

                    return arr;
                }
            )()

            return (
                <ElForm class="block-editor" labelWidth="100px" labelPosition="top">
                    {commonFormItems}
                    {componentFormItems}
                </ElForm>
            )
        }
    }
});